import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTO_GREETING } from '../content/chatbot.js';
import { fetchMessages, sendMessage as sendMessageApi } from '../lib/chatApi';
import { getCachedPriceReply } from '../lib/chatCache';
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
  getBookOrderContactBlock,
  getLastSelectedServiceTitle,
  ANOTHER_SERVICE_QUESTION_TEXT,
  BOOK_DECISION_QUESTION_TEXT,
  isExactPriceButton,
  isFollowUpSelection,
  isFollowUpOptionSet,
  isLoopOptionSet,
  isNegative,
  isPriceCacheFlow,
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

function isLocalOnlyBotMessage(message) {
  if (message?.role !== 'bot') return false;
  const id = String(message.id || '');
  return (
    id.startsWith('local-') ||
    id.startsWith('cached-') ||
    id.startsWith('book-contact-') ||
    id.startsWith('another-service-') ||
    id.startsWith('goodbye-')
  );
}

/** Keep instant local bot replies when a late server sync has user turns but no bot reply yet. */
function mergeLocalBotReplies(prev, serverVisible) {
  const prevSorted = [...prev].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const serverSorted = [...serverVisible].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const merged = [...serverSorted];

  for (const localBot of prevSorted.filter(isLocalOnlyBotMessage)) {
    const botIdx = prevSorted.findIndex((m) => m.id === localBot.id);
    const userBefore = [...prevSorted.slice(0, botIdx)].reverse().find((m) => m.role === 'user');
    if (!userBefore) continue;

    const serverUserIdx = serverSorted.findLastIndex(
      (m) => m.role === 'user' && m.text === userBefore.text
    );
    if (serverUserIdx === -1) continue;

    const hasServerBotAfter = serverSorted
      .slice(serverUserIdx + 1)
      .some((m) => m.role === 'bot' && String(m.text || '').trim());
    if (hasServerBotAfter) continue;

    const insertAfterIdx = merged.findLastIndex(
      (m) => m.role === 'user' && m.text === userBefore.text
    );
    if (insertAfterIdx === -1) continue;
    merged.splice(insertAfterIdx + 1, 0, localBot);
  }

  return keepLatestBotReplyPerTurn(dedupeMessages(merged));
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

export default function useChat({ isOpen = false } = {}) {
  const conversationIdRef = useRef(createConversationId());
  const greetingStartedRef = useRef(false);
  const conversationPhaseRef = useRef('welcome');
  const pollAbortRef = useRef(null);
  const requestAbortRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
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
      const serverWithPendingUsers = dedupeMessages([
        ...visible,
        ...pending.filter((p) => !visible.some((m) => m.role === 'user' && m.text === p.text)),
      ]);
      const merged = mergeLocalBotReplies(prev, serverWithPendingUsers);
      return merged;
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
    if (!isOpen || greetingStartedRef.current) return undefined;
    greetingStartedRef.current = true;
    const conversationId = conversationIdRef.current;
    sendMessageApi(conversationId, AUTO_GREETING)
      .then((postData) => {
        const userAlreadyActive = messagesRef.current.some(
          (m) => m.role === 'user' && !shouldHideAutoGreeting(m)
        );
        if (userAlreadyActive) return;
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
  }, [isOpen, applyThread]);

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

      if (isPriceCacheFlow(text)) {
        const serviceTitle = getLastSelectedServiceTitle(messagesRef.current);
        const cached = serviceTitle ? getCachedPriceReply(serviceTitle) : null;
        if (cached) {
          const replyText = isExactPriceButton(text)
            ? buildPriceReply(cached)
            : buildBookOrderReply(cached);
          setMessages((prev) =>
            buildThreadWithBotReply(
              prev,
              optimisticId,
              text,
              replyText,
              `cached-${Date.now()}`
            )
          );
          const { finalOptions, phase } = resolveTurnOptions({
            text,
            lastBotText: replyText,
            wasAwaitingAnotherService,
            wasAwaitingBook,
            effectiveApiOptions: [],
            phaseRef: conversationPhaseRef,
            setMessages,
          });
          applyFinalOptions(finalOptions, phase, conversationPhaseRef, setOptions);
          setSending(false);
          setSyncing(false);
          sendMessageApi(conversationId, text).catch(() => {});
          return;
        }
      }

      let postApiOptions = [];

      try {
        const postData = await sendMessageApi(conversationId, text, { signal });

        if (postData.messages?.length) {
          applyPostDataThread(postData, applyThread);
        }

        let postReplyText = '';
        if (hasSubstantivePostReply(postData)) {
          postReplyText = isServiceSelection(text)
            ? stripInitialServiceBooking(postData.reply)
            : postData.reply;
        }

        let gotReply = hasSubstantivePostReply(postData);
        let lastBotText = postReplyText || getLastBotTextFromData(postData);
        let effectiveApiOptions = postApiOptions;

        if (hasSubstantivePostReply(postData)) {
          setMessages((prev) =>
            buildThreadWithBotReply(
              prev,
              optimisticId,
              text,
              postReplyText || lastBotText,
              `reply-${Date.now()}`
            )
          );
          if (postData.options?.length) {
            postApiOptions = mapApiOptions(postData.options);
            effectiveApiOptions = postApiOptions;
          }
        }

        if (!gotReply) {
          const pollResult = await pollThread(POLL_DELAYS_MS, {
            waitForReplyAfterUser: true,
            signal: pollAbortRef.current.signal,
          });
          gotReply = pollResult.gotReply;
          lastBotText = pollResult.lastBotText || postReplyText;
          effectiveApiOptions = mapApiOptions(
            pollResult.apiOptions.length ? pollResult.apiOptions : postApiOptions
          );
        } else if (postData.options?.length) {
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
