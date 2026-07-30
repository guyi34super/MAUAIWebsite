import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTO_GREETING } from '../content/chatbot.js';
import { fetchMessages, sendMessage as sendMessageApi } from '../lib/chatApi';
import {
  createConversationId,
  dedupeMessages,
  getAutoRestoreOptions,
  getLatestOptions,
  hasSubstantiveBotReplyAfterUser,
  isFollowUpSelection,
  isFollowUpOptionSet,
  isServiceSelection,
  isWelcomeMenuText,
  isWelcomeOptionSet,
  mapApiMessage,
  resolveRestoredOptions,
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

function getLastBotTextFromData(data) {
  const messages = (data.messages || []).map(mapApiMessage);
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const lastUserIndex = sorted.findLastIndex((m) => m.role === 'user');
  const botsAfterUser = sorted.slice(lastUserIndex + 1).filter((m) => m.role === 'bot');
  const lastBot = botsAfterUser[botsAfterUser.length - 1];
  if (!lastBot || isWelcomeMenuText(lastBot.rawText ?? lastBot.text)) return '';
  return lastBot.text || '';
}

function mapApiOptions(options) {
  if (!options?.length) return [];
  return options.map((opt) => {
    if (typeof opt === 'string') return { label: opt, value: opt };
    return {
      label: opt.label || opt.text || String(opt.payload || opt.id || ''),
      value: opt.value || opt.payload || opt.label || opt.text || String(opt.id || ''),
    };
  });
}

export default function useChat() {
  const conversationIdRef = useRef(createConversationId());
  const greetingStartedRef = useRef(false);
  const conversationPhaseRef = useRef('welcome');

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
    return nextOptions;
  }, []);

  const pollThread = useCallback(
    async (delays, { waitForReplyAfterUser = false, allowMenuOptions = false } = {}) => {
      const conversationId = conversationIdRef.current;
      let finalOptions = [];
      let lastData = null;
      for (let attempt = 0; attempt <= delays.length; attempt += 1) {
        if (attempt > 0) await sleep(delays[attempt - 1]);
        const data = await fetchMessages(conversationId);
        lastData = data;
        const deferOptions = waitForReplyAfterUser && attempt < delays.length;
        finalOptions = applyThread(data, { allowMenuOptions, updateOptions: !deferOptions }) || finalOptions;
        const done = waitForReplyAfterUser ? hasBotReplyAfterUser(data) : false;
        if (done) {
          if (finalOptions.length) setOptions(finalOptions);
          return {
            gotReply: true,
            lastBotText: getLastBotTextFromData(data),
            apiOptions: finalOptions,
          };
        }
      }
      if (waitForReplyAfterUser && finalOptions.length) {
        setOptions(finalOptions);
      }
      return {
        gotReply: false,
        lastBotText: lastData ? getLastBotTextFromData(lastData) : '',
        apiOptions: finalOptions,
      };
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

      if (isServiceSelection(text)) {
        conversationPhaseRef.current = 'service_selected';
      } else if (isFollowUpSelection(text)) {
        conversationPhaseRef.current = 'in_conversation';
      } else if (conversationPhaseRef.current === 'service_selected') {
        conversationPhaseRef.current = 'in_conversation';
      }

      setMessages((prev) => [
        ...prev,
        { id: optimisticId, role: 'user', text, createdAt: new Date().toISOString(), options: [] },
      ]);
      setOptions([]);
      setSending(true);
      setSyncing(true);
      setError(null);

      let postApiOptions = [];
      let postReplyText = '';

      try {
        const postData = await sendMessageApi(conversationId, text);
        if (postData.reply && !isWelcomeMenuText(postData.reply)) {
          postReplyText = postData.reply;
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
            postApiOptions = mapApiOptions(postData.options);
            setOptions(postApiOptions);
            conversationPhaseRef.current = 'service_selected';
          }
        }

        const { gotReply, lastBotText: polledBotText, apiOptions } = await pollThread(
          BOOTSTRAP_POLLS_MS,
          { waitForReplyAfterUser: true }
        );

        const lastBotText = polledBotText || postReplyText;
        const effectiveApiOptions = mapApiOptions(
          apiOptions.length ? apiOptions : postApiOptions
        );

        let finalOptions = [];

        if (isFollowUpSelection(text)) {
          finalOptions = WELCOME_OPTIONS;
        } else if (effectiveApiOptions.length && isServiceSelection(text)) {
          finalOptions = effectiveApiOptions;
        } else if (effectiveApiOptions.length && !isFollowUpOptionSet(effectiveApiOptions)) {
          finalOptions = effectiveApiOptions;
        } else if (shouldReshowMenu(text, lastBotText)) {
          finalOptions = resolveRestoredOptions(text, lastBotText) || [];
        } else {
          finalOptions =
            getAutoRestoreOptions(text, lastBotText, conversationPhaseRef.current) || [];
        }

        if (finalOptions.length) {
          setOptions(finalOptions);
          conversationPhaseRef.current = isWelcomeOptionSet(finalOptions)
            ? 'welcome'
            : 'service_selected';
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
