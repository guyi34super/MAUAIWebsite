import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTO_GREETING } from '../content/chatbot.js';
import { fetchMessages, sendMessage as sendMessageApi } from '../lib/chatApi';
import {
  createConversationId,
  dedupeMessages,
  getAutoRestoreOptions,
  getLatestOptions,
  getPostPriceOptions,
  hasSubstantiveBotReplyAfterUser,
  botAskedToChooseAnotherOption,
  botAskedToBookOrLearnMore,
  botTurnNeedsLoopQuestion,
  isAffirmative,
  isBookOrderOptionSet,
  isBookOrderSelection,
  isExactPriceButton,
  isFollowUpSelection,
  isFollowUpOptionSet,
  isLoopOptionSet,
  isNegative,
  isServiceSelection,
  isWelcomeMenuText,
  isWelcomeOptionSet,
  mapApiMessage,
  normalizeServiceSelection,
  resolveRestoredOptions,
  sanitizeMessageText,
  sanitizeServiceIntroMessages,
  shouldHideAutoGreeting,
  shouldReshowMenu,
  stripWelcomeMenuMessages,
  stripInitialServiceBooking,
  FOLLOW_UP_OPTIONS,
  BOOK_ORDER_OPTIONS,
  BOOK_ORDER_PROMPT,
  LOOP_DECISION_OPTIONS,
  LOOP_GOODBYE_TEXT,
  LOOP_QUESTION_TEXT,
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
  const lastUser = sorted[lastUserIndex];
  const botsAfterUser = sorted.slice(lastUserIndex + 1).filter((m) => m.role === 'bot');
  const lastBot = botsAfterUser[botsAfterUser.length - 1];
  if (!lastBot || isWelcomeMenuText(lastBot.rawText ?? lastBot.text)) return '';
  let text = lastBot.text || '';
  if (
    lastUser?.role === 'user' &&
    isServiceSelection(lastUser.text) &&
    !isFollowUpSelection(lastUser.text)
  ) {
    text = stripInitialServiceBooking(lastBot.rawText ?? lastBot.text);
  }
  return text;
}

function buildThreadWithBotReply(prev, optimisticId, userText, botReplyRaw, botMessageId) {
  const withoutPending = prev.filter((m) => m.id !== optimisticId);
  const userMessage = prev.find((m) => m.id === optimisticId) || {
    id: optimisticId,
    role: 'user',
    text: userText,
    createdAt: new Date().toISOString(),
    options: [],
  };
  const botText = isServiceSelection(userText)
    ? stripInitialServiceBooking(botReplyRaw)
    : botReplyRaw;
  const mapped = mapApiMessage({
    id: botMessageId,
    direction: 'outbound',
    text: botText,
    created_at: new Date().toISOString(),
    options: [],
  });
  return sanitizeServiceIntroMessages(
    keepLatestBotReplyPerTurn(
      dedupeMessages([
        ...stripWelcomeMenuMessages(mapVisibleMessages(withoutPending)),
        userMessage,
        mapped,
      ])
    )
  );
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
    const visible = sanitizeServiceIntroMessages(
      keepLatestBotReplyPerTurn(
        stripWelcomeMenuMessages(mapVisibleMessages(mapped))
      )
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
      const text = normalizeServiceSelection(sanitizeMessageText(rawText));
      if (!text || sending) return;

      const conversationId = conversationIdRef.current;
      const optimisticId = `pending-${Date.now()}`;
      const wasAwaitingLoop = conversationPhaseRef.current === 'awaiting_loop_decision';

      if (wasAwaitingLoop) {
        if (isAffirmative(text)) {
          conversationPhaseRef.current = 'welcome';
        } else if (isNegative(text)) {
          conversationPhaseRef.current = 'closed';
        }
      } else if (isServiceSelection(text)) {
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

      if (wasAwaitingLoop && isAffirmative(text)) {
        setOptions(WELCOME_OPTIONS);
        conversationPhaseRef.current = 'welcome';
        setSending(false);
        setSyncing(false);
        sendMessageApi(conversationId, text).catch(() => {});
        return;
      }

      if (wasAwaitingLoop && isNegative(text)) {
        setOptions([]);
        conversationPhaseRef.current = 'closed';
        setMessages((prev) => [
          ...prev,
          {
            id: `goodbye-${Date.now()}`,
            role: 'bot',
            text: LOOP_GOODBYE_TEXT,
            createdAt: new Date().toISOString(),
            options: [],
          },
        ]);
        setSending(false);
        setSyncing(false);
        sendMessageApi(conversationId, text).catch(() => {});
        return;
      }

      if (isBookOrderSelection(text)) {
        conversationPhaseRef.current = 'book_order_sub';
        setOptions(BOOK_ORDER_OPTIONS);
        setMessages((prev) => [
          ...prev,
          {
            id: `book-prompt-${Date.now()}`,
            role: 'bot',
            text: BOOK_ORDER_PROMPT,
            createdAt: new Date().toISOString(),
            options: [],
          },
        ]);
        setSending(false);
        setSyncing(false);
        sendMessageApi(conversationId, text).catch(() => {});
        return;
      }

      let postApiOptions = [];
      let postReplyText = '';

      try {
        const postData = await sendMessageApi(conversationId, text);
        if (postData.reply && !isWelcomeMenuText(postData.reply)) {
          postReplyText = isServiceSelection(text)
            ? stripInitialServiceBooking(postData.reply)
            : postData.reply;
          setMessages((prev) =>
            buildThreadWithBotReply(
              prev,
              optimisticId,
              text,
              postData.reply,
              `reply-${Date.now()}`
            )
          );
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

        if (wasAwaitingLoop && isAffirmative(text)) {
          finalOptions = WELCOME_OPTIONS;
          conversationPhaseRef.current = 'welcome';
        } else if (wasAwaitingLoop && isNegative(text)) {
          finalOptions = [];
          conversationPhaseRef.current = 'closed';
        } else if (isAffirmative(text) && botAskedToChooseAnotherOption(lastBotText)) {
          finalOptions = WELCOME_OPTIONS;
          conversationPhaseRef.current = 'welcome';
        } else if (isNegative(text) && botAskedToChooseAnotherOption(lastBotText)) {
          finalOptions = [];
          conversationPhaseRef.current = 'closed';
        } else if (isServiceSelection(text)) {
          finalOptions = FOLLOW_UP_OPTIONS;
          conversationPhaseRef.current = 'service_selected';
        } else if (isExactPriceButton(text)) {
          finalOptions = getPostPriceOptions();
          conversationPhaseRef.current = 'service_selected';
        } else if (botAskedToChooseAnotherOption(lastBotText)) {
          conversationPhaseRef.current = 'awaiting_loop_decision';
          finalOptions = LOOP_DECISION_OPTIONS;
        } else if (/^more information$/i.test(text)) {
          conversationPhaseRef.current = 'awaiting_loop_decision';
          finalOptions = LOOP_DECISION_OPTIONS;
          if (!botAskedToChooseAnotherOption(lastBotText)) {
            setMessages((prev) => {
              const result = keepLatestBotReplyPerTurn(prev);
              const lastBotIdx = result.findLastIndex((m) => m.role === 'bot');
              if (lastBotIdx < 0) return prev;
              const bot = result[lastBotIdx];
              if (bot.text.includes(LOOP_QUESTION_TEXT)) return prev;
              result[lastBotIdx] = {
                ...bot,
                text: `${bot.text}\n\n${LOOP_QUESTION_TEXT}`,
              };
              return result;
            });
          }
        } else if (botTurnNeedsLoopQuestion(lastBotText, conversationPhaseRef.current)) {
          conversationPhaseRef.current = 'awaiting_loop_decision';
          finalOptions = LOOP_DECISION_OPTIONS;
          setMessages((prev) => {
            const result = keepLatestBotReplyPerTurn(prev);
            const lastBotIdx = result.findLastIndex((m) => m.role === 'bot');
            if (lastBotIdx < 0) return prev;
            const bot = result[lastBotIdx];
            if (bot.text.includes(LOOP_QUESTION_TEXT)) return prev;
            result[lastBotIdx] = {
              ...bot,
              text: `${bot.text}\n\n${LOOP_QUESTION_TEXT}`,
            };
            return result;
          });
        } else if (isFollowUpSelection(text)) {
          finalOptions =
            getAutoRestoreOptions(text, lastBotText, conversationPhaseRef.current) || [];
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
          if (isWelcomeOptionSet(finalOptions)) {
            conversationPhaseRef.current = 'welcome';
          } else if (isLoopOptionSet(finalOptions)) {
            conversationPhaseRef.current = 'awaiting_loop_decision';
          } else if (isBookOrderOptionSet(finalOptions)) {
            conversationPhaseRef.current = 'book_order_sub';
          } else {
            conversationPhaseRef.current = 'service_selected';
          }
        } else if (
          conversationPhaseRef.current === 'closed'
        ) {
          setOptions([]);
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
