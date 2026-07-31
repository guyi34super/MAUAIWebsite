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
  botAskedBookDecision,
  botAskedForAnotherService,
  botTurnNeedsLoopQuestion,
  isAffirmative,
  isBookOrderSelection,
  buildBookOrderReply,
  buildPriceReply,
  buildServiceIntroReply,
  cleanBotText,
  getBookOrderContactBlock,
  hasPricingContent,
  ANOTHER_SERVICE_QUESTION_TEXT,
  BOOK_DECISION_QUESTION_TEXT,
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
  LOOP_DECISION_OPTIONS,
  LOOP_GOODBYE_TEXT,
  LOOP_QUESTION_TEXT,
  WELCOME_OPTIONS,
} from '../lib/chatUtils';

const POLL_DELAYS_MS = [150, 250, 400, 600, 900, 1200, 1800, 2500, 3500, 5000];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sleepWithAbort(ms, signal) {
  if (!signal?.aborted) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms);
      const onAbort = () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      };
      signal?.addEventListener('abort', onAbort, { once: true });
    });
  }
  return Promise.reject(new DOMException('Aborted', 'AbortError'));
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

function hasSubstantivePostReply(postData) {
  if (postData?.reply && !isWelcomeMenuText(postData.reply)) return true;
  return hasSubstantiveBotReplyAfterUser(postData);
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

function applyPostDataThread(postData, applyThread) {
  if (postData?.messages?.length) {
    applyThread(postData, { updateOptions: false });
  }
}

function resolveTurnOptions({
  text,
  lastBotText,
  wasAwaitingAnotherService,
  wasAwaitingBook,
  effectiveApiOptions,
  phaseRef,
  setMessages,
}) {
  let finalOptions = [];
  let phase = phaseRef.current;

  if (wasAwaitingAnotherService && isAffirmative(text)) {
    finalOptions = WELCOME_OPTIONS;
    phase = 'welcome';
  } else if (wasAwaitingAnotherService && isNegative(text)) {
    finalOptions = [];
    phase = 'closed';
  } else if (wasAwaitingBook && isAffirmative(text)) {
    finalOptions = LOOP_DECISION_OPTIONS;
    phase = 'awaiting_another_service';
  } else if (wasAwaitingBook && isNegative(text)) {
    finalOptions = LOOP_DECISION_OPTIONS;
    phase = 'awaiting_another_service';
  } else if (isAffirmative(text) && botAskedForAnotherService(lastBotText)) {
    finalOptions = WELCOME_OPTIONS;
    phase = 'welcome';
  } else if (isNegative(text) && botAskedForAnotherService(lastBotText)) {
    finalOptions = [];
    phase = 'closed';
  } else if (isServiceSelection(text)) {
    finalOptions = FOLLOW_UP_OPTIONS;
    phase = 'service_selected';
  } else if (isExactPriceButton(text)) {
    phase = 'awaiting_book_decision';
    finalOptions = LOOP_DECISION_OPTIONS;
  } else if (isBookOrderSelection(text)) {
    phase = 'awaiting_another_service';
    finalOptions = LOOP_DECISION_OPTIONS;
  } else if (botAskedForAnotherService(lastBotText)) {
    phase = 'awaiting_another_service';
    finalOptions = LOOP_DECISION_OPTIONS;
  } else if (botAskedBookDecision(lastBotText)) {
    phase = 'awaiting_book_decision';
    finalOptions = LOOP_DECISION_OPTIONS;
  } else if (botTurnNeedsLoopQuestion(lastBotText, phaseRef.current)) {
    phase = 'awaiting_another_service';
    finalOptions = LOOP_DECISION_OPTIONS;
    setMessages((prev) => {
      const result = keepLatestBotReplyPerTurn(prev);
      const lastBotIdx = result.findLastIndex((m) => m.role === 'bot');
      if (lastBotIdx < 0) return prev;
      const bot = result[lastBotIdx];
      if (bot.text.includes(ANOTHER_SERVICE_QUESTION_TEXT)) return prev;
      result[lastBotIdx] = {
        ...bot,
        text: `${bot.text}\n\n${ANOTHER_SERVICE_QUESTION_TEXT}`,
      };
      return result;
    });
  } else if (isFollowUpSelection(text)) {
    finalOptions = getAutoRestoreOptions(text, lastBotText, phaseRef.current) || [];
  } else if (effectiveApiOptions.length && isServiceSelection(text)) {
    finalOptions = effectiveApiOptions;
  } else if (effectiveApiOptions.length && !isFollowUpOptionSet(effectiveApiOptions)) {
    finalOptions = effectiveApiOptions;
  } else if (shouldReshowMenu(text, lastBotText)) {
    finalOptions = resolveRestoredOptions(text, lastBotText) || [];
  } else {
    finalOptions = getAutoRestoreOptions(text, lastBotText, phaseRef.current) || [];
  }

  return { finalOptions, phase };
}

function applyFinalOptions(finalOptions, phase, phaseRef, setOptions) {
  if (finalOptions.length) {
    setOptions(finalOptions);
    if (isWelcomeOptionSet(finalOptions)) {
      phaseRef.current = 'welcome';
    } else if (isLoopOptionSet(finalOptions)) {
      phaseRef.current = phase;
    } else {
      phaseRef.current = phase || 'service_selected';
    }
  } else if (phase === 'closed') {
    phaseRef.current = 'closed';
    setOptions([]);
  } else {
    phaseRef.current = phase;
  }
}

export default function useChat() {
  const conversationIdRef = useRef(createConversationId());
  const greetingStartedRef = useRef(false);
  const conversationPhaseRef = useRef('welcome');
  const pollAbortRef = useRef(null);
  const requestAbortRef = useRef(null);

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
    async (delays, { waitForReplyAfterUser = false, allowMenuOptions = false, signal } = {}) => {
      const conversationId = conversationIdRef.current;
      let finalOptions = [];
      let lastData = null;

      for (let attempt = 0; attempt <= delays.length; attempt += 1) {
        if (signal?.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }
        if (attempt > 0) {
          await sleepWithAbort(delays[attempt - 1], signal);
        }
        const data = await fetchMessages(conversationId, { signal });
        lastData = data;
        const deferOptions = waitForReplyAfterUser && attempt < delays.length;
        finalOptions = applyThread(data, { allowMenuOptions, updateOptions: !deferOptions }) || finalOptions;
        const done = waitForReplyAfterUser ? hasSubstantiveBotReplyAfterUser(data) : false;
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
      pollAbortRef.current?.abort();
      pollAbortRef.current = new AbortController();
      await pollThread(POLL_DELAYS_MS, {
        waitForReplyAfterUser: true,
        signal: pollAbortRef.current.signal,
      });
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load messages');
      }
    } finally {
      setSyncing(false);
    }
  }, [pollThread]);

  useEffect(() => {
    if (greetingStartedRef.current) return undefined;
    greetingStartedRef.current = true;

    const conversationId = conversationIdRef.current;
    sendMessageApi(conversationId, AUTO_GREETING)
      .then((postData) => {
        if (hasSubstantivePostReply(postData)) {
          applyPostDataThread(postData, applyThread);
          return;
        }
        if (postData?.messages?.length) {
          applyThread(postData);
        }
      })
      .catch(() => {});

    return undefined;
  }, [applyThread]);

  const sendMessage = useCallback(
    async (rawText) => {
      const text = normalizeServiceSelection(sanitizeMessageText(rawText));
      if (!text || sending) return;

      pollAbortRef.current?.abort();
      requestAbortRef.current?.abort();
      pollAbortRef.current = new AbortController();
      requestAbortRef.current = new AbortController();
      const signal = requestAbortRef.current.signal;

      const conversationId = conversationIdRef.current;
      const optimisticId = `pending-${Date.now()}`;
      const wasAwaitingAnotherService =
        conversationPhaseRef.current === 'awaiting_another_service' ||
        conversationPhaseRef.current === 'awaiting_loop_decision';
      const wasAwaitingBook = conversationPhaseRef.current === 'awaiting_book_decision';

      if (wasAwaitingAnotherService) {
        if (isAffirmative(text)) {
          conversationPhaseRef.current = 'welcome';
        } else if (isNegative(text)) {
          conversationPhaseRef.current = 'closed';
        }
      } else if (wasAwaitingBook) {
        if (isAffirmative(text) || isNegative(text)) {
          conversationPhaseRef.current = 'awaiting_another_service';
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

      if (wasAwaitingAnotherService && isAffirmative(text)) {
        setOptions(WELCOME_OPTIONS);
        conversationPhaseRef.current = 'welcome';
        setSending(false);
        setSyncing(false);
        sendMessageApi(conversationId, text).catch(() => {});
        return;
      }

      if (wasAwaitingAnotherService && isNegative(text)) {
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

      if (wasAwaitingBook && isAffirmative(text)) {
        setMessages((prev) => [
          ...prev,
          {
            id: `book-contact-${Date.now()}`,
            role: 'bot',
            text: `${getBookOrderContactBlock()}\n\n${ANOTHER_SERVICE_QUESTION_TEXT}`,
            createdAt: new Date().toISOString(),
            options: [],
          },
        ]);
        setOptions(LOOP_DECISION_OPTIONS);
        conversationPhaseRef.current = 'awaiting_another_service';
        setSending(false);
        setSyncing(false);
        sendMessageApi(conversationId, text).catch(() => {});
        return;
      }

      if (wasAwaitingBook && isNegative(text)) {
        setMessages((prev) => [
          ...prev,
          {
            id: `another-service-${Date.now()}`,
            role: 'bot',
            text: ANOTHER_SERVICE_QUESTION_TEXT,
            createdAt: new Date().toISOString(),
            options: [],
          },
        ]);
        setOptions(LOOP_DECISION_OPTIONS);
        conversationPhaseRef.current = 'awaiting_another_service';
        setSending(false);
        setSyncing(false);
        sendMessageApi(conversationId, text).catch(() => {});
        return;
      }

      if (isServiceSelection(text) && !isFollowUpSelection(text)) {
        const introText = buildServiceIntroReply(text);
        setMessages((prev) =>
          buildThreadWithBotReply(
            prev,
            optimisticId,
            text,
            introText,
            `local-intro-${Date.now()}`
          )
        );
        setOptions(FOLLOW_UP_OPTIONS);
        conversationPhaseRef.current = 'service_selected';
        setSending(false);
        setSyncing(false);
        sendMessageApi(conversationId, text).catch(() => {});
        return;
      }

      let postApiOptions = [];
      let postReplyText = '';

      try {
        const postData = await sendMessageApi(conversationId, text, { signal });

        if (postData.messages?.length) {
          applyPostDataThread(postData, applyThread);
        }

        if (hasSubstantivePostReply(postData)) {
          postReplyText = isServiceSelection(text)
            ? stripInitialServiceBooking(postData.reply)
            : postData.reply;
          if (isExactPriceButton(text)) {
            postReplyText = buildPriceReply(postReplyText);
          }
        }

        let gotReply = hasSubstantivePostReply(postData);
        let lastBotText = postReplyText;
        let effectiveApiOptions = postApiOptions;

        if (isBookOrderSelection(text)) {
          let priceText = postReplyText;
          if (!hasPricingContent(priceText)) {
            const priceData = await sendMessageApi(conversationId, 'Price', { signal });
            if (hasSubstantivePostReply(priceData)) {
              priceText = cleanBotText(priceData.reply);
            } else {
              const pricePoll = await pollThread(POLL_DELAYS_MS, {
                waitForReplyAfterUser: true,
                signal: pollAbortRef.current.signal,
              });
              if (pricePoll.lastBotText) {
                priceText = cleanBotText(pricePoll.lastBotText);
              }
            }
          } else {
            priceText = cleanBotText(priceText);
          }
          postReplyText = buildBookOrderReply(priceText);
          lastBotText = postReplyText;
          gotReply = Boolean(postReplyText);
          setMessages((prev) =>
            buildThreadWithBotReply(
              prev,
              optimisticId,
              text,
              postReplyText,
              `reply-${Date.now()}`
            )
          );
        } else if (hasSubstantivePostReply(postData)) {
          const replyForThread = isExactPriceButton(text)
            ? buildPriceReply(cleanBotText(postData.reply))
            : postData.reply;
          setMessages((prev) =>
            buildThreadWithBotReply(
              prev,
              optimisticId,
              text,
              replyForThread,
              `reply-${Date.now()}`
            )
          );
          if (postData.options?.length) {
            postApiOptions = mapApiOptions(postData.options);
            effectiveApiOptions = postApiOptions;
          }
        }

        if (!isBookOrderSelection(text) && !gotReply) {
          const pollResult = await pollThread(POLL_DELAYS_MS, {
            waitForReplyAfterUser: true,
            signal: pollAbortRef.current.signal,
          });
          gotReply = pollResult.gotReply;
          lastBotText = pollResult.lastBotText || postReplyText;
          effectiveApiOptions = mapApiOptions(
            pollResult.apiOptions.length ? pollResult.apiOptions : postApiOptions
          );
        } else if (!isBookOrderSelection(text) && postData.options?.length) {
          effectiveApiOptions = postApiOptions;
        }

        const { finalOptions, phase } = resolveTurnOptions({
          text,
          lastBotText,
          wasAwaitingAnotherService,
          wasAwaitingBook,
          effectiveApiOptions,
          phaseRef: conversationPhaseRef,
          setMessages,
        });

        applyFinalOptions(finalOptions, phase, conversationPhaseRef, setOptions);

        if (!gotReply) {
          setError('Still waiting for a reply. Please try again in a moment.');
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setError(err.message || 'Failed to send message');
      } finally {
        setSending(false);
        setSyncing(false);
      }
    },
    [sending, pollThread, applyThread]
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
