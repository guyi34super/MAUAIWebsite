import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTO_GREETING } from '../content/chatbot.js';
import { fetchMessages, sendMessage as sendMessageApi } from '../lib/chatApi';
import {
  createConversationId,
  dedupeMessages,
  getLatestOptions,
  hasSubstantiveBotReplyAfterUser,
  isWelcomeMenuText,
  mapApiMessage,
  sanitizeMessageText,
  shouldHideAutoGreeting,
  shouldReshowMenu,
  stripWelcomeMenuMessages,
  WELCOME_OPTIONS,
} from '../lib/chatUtils';

const BOOTSTRAP_POLLS_MS = [600, 1000, 1500, 2000, 3000, 4000, 5000, 8000, 12000, 15000, 20000, 25000];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapVisibleMessages(messages) {
  let hiddenAutoHi = false;
  return messages.filter((msg) => {
    if (shouldHideAutoGreeting(msg) && !hiddenAutoHi) {
      hiddenAutoHi = true;
      return false;
    }
    return true;
  });
}

function hasBotReplyAfterUser(data) {
  return hasSubstantiveBotReplyAfterUser(data);
}

function keepLatestBotReplyPerTurn(messages) {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const result = [];
  let botsAfterLastUser = [];

  for (const message of sorted) {
    if (message.role === 'user') {
      if (botsAfterLastUser.length) {
        result.push(botsAfterLastUser[botsAfterLastUser.length - 1]);
        botsAfterLastUser = [];
      }
      result.push(message);
      continue;
    }
    if (message.role === 'bot') {
      if (result.some((item) => item.role === 'user')) {
        botsAfterLastUser.push(message);
      } else {
        result.push(message);
      }
    }
  }

  if (botsAfterLastUser.length) {
    result.push(botsAfterLastUser[botsAfterLastUser.length - 1]);
  }

  return result;
}

export default function useChat() {
  const conversationIdRef = useRef(createConversationId());
  const greetingStartedRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState(WELCOME_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(true);

  const applyThread = useCallback((data, { allowMenuOptions = false, updateOptions = true } = {}) => {
    const mapped = dedupeMessages((data.messages || []).map(mapApiMessage));
    const visible = keepLatestBotReplyPerTurn(
      stripWelcomeMenuMessages(mapVisibleMessages(mapped))
    );
    setMessages((prev) => {
      const serverUserTexts = new Set(
        mapped.filter((m) => m.role === 'user').map((m) => m.text)
      );
      const pending = prev.filter(
        (m) => m.id.startsWith('pending-') && !serverUserTexts.has(m.text)
      );
      return dedupeMessages([
        ...visible,
        ...pending.filter((p) => !visible.some((m) => m.role === 'user' && m.text === p.text)),
      ]);
    });
    const nextOptions = getLatestOptions(mapped, { allowMenu: allowMenuOptions });
    if (updateOptions && (nextOptions.length > 0 || allowMenuOptions)) {
      setOptions(nextOptions);
    }
    // #region agent log
    fetch('http://127.0.0.1:7319/ingest/9cf5b0d0-ec9f-4af0-a2fe-3a0c4030f0df',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22586a'},body:JSON.stringify({sessionId:'22586a',location:'useChat.js:applyThread',message:'thread applied',data:{updateOptions,optionCount:nextOptions.length,optionLabels:nextOptions.map(o=>o.label||o).slice(0,4),rawMsgCount:(data.messages||[]).length},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return nextOptions;
  }, []);

  const pollThread = useCallback(
    async (delays, { waitForReplyAfterUser = false, allowMenuOptions = false } = {}) => {
      const conversationId = conversationIdRef.current;
      let finalOptions = [];
      for (let attempt = 0; attempt <= delays.length; attempt += 1) {
        if (attempt > 0) await sleep(delays[attempt - 1]);
        const data = await fetchMessages(conversationId);
        const deferOptions = waitForReplyAfterUser && attempt < delays.length;
        finalOptions = applyThread(data, { allowMenuOptions, updateOptions: !deferOptions }) || finalOptions;
        const done = waitForReplyAfterUser ? hasBotReplyAfterUser(data) : false;
        if (done) {
          if (finalOptions.length) setOptions(finalOptions);
          // #region agent log
          fetch('http://127.0.0.1:7319/ingest/9cf5b0d0-ec9f-4af0-a2fe-3a0c4030f0df',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22586a'},body:JSON.stringify({sessionId:'22586a',location:'useChat.js:pollThread',message:'poll done',data:{attempt,optionCount:finalOptions.length},timestamp:Date.now(),hypothesisId:'A',runId:'post-fix'})}).catch(()=>{});
          // #endregion
          return true;
        }
      }
      if (waitForReplyAfterUser && finalOptions.length) {
        setOptions(finalOptions);
      }
      return false;
    },
    [applyThread]
  );

  const syncThread = useCallback(async () => {
    setSyncing(true);
    try {
      await pollThread(BOOTSTRAP_POLLS_MS, { waitForReplyAfterUser: true });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setSyncing(false);
    }
  }, [pollThread]);

  useEffect(() => {
    if (greetingStartedRef.current) return undefined;
    greetingStartedRef.current = true;
    sendMessageApi(conversationIdRef.current, AUTO_GREETING).catch(() => {});
    return undefined;
  }, []);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = sanitizeMessageText(rawText);
      if (!text || sending) return;

      const conversationId = conversationIdRef.current;
      const optimisticId = `pending-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: optimisticId, role: 'user', text, createdAt: new Date().toISOString(), options: [] },
      ]);
      setOptions([]);
      setSending(true);
      setSyncing(true);
      setError(null);

      try {
        const postData = await sendMessageApi(conversationId, text);
        if (postData.reply && !isWelcomeMenuText(postData.reply)) {
          setMessages((prev) => {
            const withoutPending = prev.filter((m) => m.id !== optimisticId);
            const mapped = mapApiMessage({
              id: `reply-${Date.now()}`,
              direction: 'outbound',
              text: postData.reply,
              created_at: new Date().toISOString(),
              options: postData.options || [],
            });
            return keepLatestBotReplyPerTurn(
              dedupeMessages([...stripWelcomeMenuMessages(withoutPending), mapped])
            );
          });
          if (postData.options?.length) {
            const mappedOptions = postData.options.map((opt) =>
              typeof opt === 'string' ? { label: opt, value: opt } : opt
            );
            setOptions(mappedOptions);
            // #region agent log
            fetch('http://127.0.0.1:7319/ingest/9cf5b0d0-ec9f-4af0-a2fe-3a0c4030f0df',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'22586a'},body:JSON.stringify({sessionId:'22586a',location:'useChat.js:sendMessage',message:'post options set',data:{count:mappedOptions.length,labels:mappedOptions.map(o=>o.label||o)},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
            // #endregion
          }
        }

        const gotReply = await pollThread(BOOTSTRAP_POLLS_MS, { waitForReplyAfterUser: true });
        if (shouldReshowMenu(text)) {
          setOptions(WELCOME_OPTIONS);
        }
        if (!gotReply) {
          setError('Still waiting for a reply. Please try again in a moment.');
        }
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setError(err.message || 'Failed to send message');
      } finally {
        setSending(false);
        setSyncing(false);
      }
    },
    [sending, pollThread]
  );

  return {
    messages,
    options,
    loading,
    sending,
    syncing,
    error,
    ready,
    sendMessage,
    retry: syncThread,
  };
}
