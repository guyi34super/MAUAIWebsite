import {
  AUTO_GREETING,
  CHAT_SERVICES,
  CONTACT_EMAIL,
  CONTACT_URL,
  WELCOME_OPTIONS,
} from '../content/chatbot.js';

const CONVERSATION_STORAGE_KEY = 'mauai-chat-conversation-id-v4';
export const WELCOME_PLACEHOLDER_ID = 'welcome-placeholder';
const INTERNAL_MARKER_RE = /__\w+__/g;
export { AUTO_GREETING };
export const MAX_MESSAGE_LENGTH = 2000;

export { WELCOME_OPTIONS };

export const WELCOME_PLACEHOLDER = {
  id: WELCOME_PLACEHOLDER_ID,
  role: 'bot',
  text: '',
  createdAt: new Date(0).toISOString(),
  options: WELCOME_OPTIONS,
};

export function createConversationId() {
  try {
    localStorage.removeItem(CONVERSATION_STORAGE_KEY);
  } catch {
    // storage unavailable
  }
  return crypto.randomUUID();
}

export function sanitizeMessageText(value) {
  return String(value)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .slice(0, MAX_MESSAGE_LENGTH)
    .trim();
}

export function cleanBotText(text) {
  if (!text) return '';
  return String(text)
    .replace(INTERNAL_MARKER_RE, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.replace(/\s{2,}/g, ' ').trim())
    .join('\n')
    .trim();
}

/** Build instant service intro from local CHAT_SERVICES data (no API wait). */
export function buildServiceIntroReply(serviceTitle) {
  const normalized = normalizeServiceSelection(serviceTitle);
  const service = CHAT_SERVICES.find((s) => s.title === normalized);
  if (!service) return '';

  const lines = [service.title, service.description];
  if (service.features?.length) {
    for (const feature of service.features) {
      lines.push(`- ${feature}`);
    }
  }
  return lines.join('\n');
}

/** Remove booking CTAs, pricing, and upsell questions from the first service intro reply. */
export function stripInitialServiceBooking(text) {
  if (!text) return '';
  return cleanBotText(
    String(text)
      .replace(/\s*Want a free consultation\??\s*/gi, ' ')
      .replace(/\s*Would you like to book a consultation or get more information\??\s*/gi, ' ')
      .replace(/\s*Book here:?\s*/gi, ' ')
      .replace(/\s*Book a free consultation[^.!\n]*[.!]?\s*/gi, ' ')
      .replace(/https?:\/\/[^\s]*\/contact[^\s]*/gi, '')
      .replace(/mailto:[^\s]+/gi, '')
      .replace(/\n\s*(?:\*\*)?Pricing(?:\*\*)?\s*:\s*[^\n]*/gi, '')
      .replace(/\n\s*(?:\*\*)?Price(?:\*\*)?\s*:\s*[^\n]*/gi, '')
      .replace(/\s*(?:\*\*)?Price(?:\*\*)?\s*:\s*[^\n]*/gi, '')
      .replace(/\n[^\n]*\b(as from|from)\s+mur\b[^\n]*/gi, '')
      .replace(
        /\s*Do you want to know more about this service[^.?\n]*[.?]?\s*/gi,
        ' '
      )
      .replace(/\s*would you like to proceed with pricing\??\s*/gi, ' ')
      .replace(/\s*Do you want to choose another option\??\s*/gi, ' ')
      .replace(/\s+([.!])/g, '$1')
  );
}

export function sanitizeServiceIntroMessages(messages) {
  if (!messages?.length) return messages;
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const lastUserIdx = sorted.findLastIndex((m) => m.role === 'user');
  if (lastUserIdx === -1) return messages;

  const lastUser = sorted[lastUserIdx];
  if (!isServiceSelection(lastUser.text) || isFollowUpSelection(lastUser.text)) {
    return messages;
  }

  const botsAfter = sorted.slice(lastUserIdx + 1).filter((m) => m.role === 'bot');
  const introBot = botsAfter[0];
  if (!introBot) return messages;

  const stripped = stripInitialServiceBooking(introBot.text);
  if (stripped === introBot.text) return messages;

  return messages.map((m) =>
    m.id === introBot.id ? { ...m, text: stripped, rawText: stripped } : m
  );
}

export function parseBotMessage(text) {
  const cleaned = cleanBotText(text);
  const lines = cleaned.split('\n').map((line) => line.trim()).filter(Boolean);
  const options = [];
  const introLines = [];
  let inList = false;

  for (const line of lines) {
    const match = line.match(/^(\d+)\.\s+(.+)$/);
    if (match) {
      inList = true;
      const title = match[2].split(' — ')[0].split(' - ')[0].trim();
      options.push({
        label: `${match[1]}. ${title}`,
        value: match[1],
      });
    } else if (/^reply with the number/i.test(line)) {
      continue;
    } else if (!inList) {
      introLines.push(line);
    }
  }

  return {
    displayText: introLines.join('\n').trim() || cleaned,
    options,
  };
}

export function mapApiMessage(msg) {
  const isBot = msg.direction !== 'inbound';
  const rawText = msg.text;
  const parsed = isBot ? parseBotMessage(rawText) : null;
  const apiOptions = Array.isArray(msg.options) ? msg.options : [];

  return {
    id: msg.id,
    role: isBot ? 'bot' : 'user',
    rawText: isBot ? rawText : undefined,
    text: parsed?.displayText ?? (isBot ? cleanBotText(rawText) : rawText),
    createdAt: msg.created_at,
    options:
      apiOptions.length > 0
        ? apiOptions.map((opt) =>
            typeof opt === 'string'
              ? { label: opt, value: opt }
              : { label: opt.label || opt.text, value: opt.value || opt.label || opt.text }
          )
        : parsed?.options ?? [],
  };
}

export function shouldHideAutoGreeting(message) {
  return message.role === 'user' && message.text.trim().toLowerCase() === AUTO_GREETING;
}

export function dedupeMessages(messages) {
  const seen = new Set();
  const result = [];
  for (const msg of messages) {
    if (seen.has(msg.id)) continue;
    seen.add(msg.id);
    const prev = result[result.length - 1];
    if (prev && prev.role === msg.role && prev.text === msg.text) continue;
    result.push(msg);
  }
  return result;
}

function botTextForMenuCheck(message) {
  return message.rawText ?? message.text;
}

export function isWelcomeMenuText(text) {
  if (!text) return false;
  const parsed = parseBotMessage(text);
  if (parsed.options.length < 3) return false;
  const lower = cleanBotText(text).toLowerCase();
  if (
    lower.includes('great choice') ||
    lower.includes("you've selected") ||
    lower.includes('you have selected') ||
    lower.includes('**')
  ) {
    return false;
  }
  return (
    lower.includes('here are our services') ||
    lower.includes("what's available") ||
    lower.includes('welcome to mo') ||
    lower.includes('welcome to moi bot') ||
    lower.includes("here's what's available")
  );
}

export function stripWelcomeMenuMessages(messages) {
  return messages.filter((m) => !(m.role === 'bot' && isWelcomeMenuText(botTextForMenuCheck(m))));
}

export function hasSubstantiveBotReplyAfterUser(data) {
  const messages = data.messages || [];
  const lastUserIdx = messages.findLastIndex((m) => m.direction === 'inbound');
  if (lastUserIdx === -1) return false;
  return messages
    .slice(lastUserIdx + 1)
    .some((m) => m.direction === 'outbound' && !isWelcomeMenuText(m.text));
}

export function getLatestOptions(messages, { allowMenu = false } = {}) {
  if (!messages.length) return [];
  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const lastUserIndex = sorted.findLastIndex((m) => m.role === 'user');
  const hasUserAction = lastUserIndex !== -1;

  if (!hasUserAction) {
    if (allowMenu) {
      const menuBot = [...sorted].reverse().find((m) => m.role === 'bot' && isWelcomeMenuText(m.rawText ?? m.text));
      if (menuBot?.options?.length) return menuBot.options;
    }
    return WELCOME_OPTIONS;
  }

  const botsAfterUser = sorted.slice(lastUserIndex + 1).filter((m) => m.role === 'bot');
  const lastBot = botsAfterUser[botsAfterUser.length - 1];
  if (!lastBot || isWelcomeMenuText(lastBot.rawText ?? lastBot.text)) return [];
  return lastBot.options?.length ? lastBot.options : [];
}

const LINK_RE =
  /(?:https?:\/\/[^\s<>"']+|mailto:[^\s<>"']+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
const TRAILING_PUNCT_RE = /[.,!?;:)\]}]+$/;

function normalizeLink(raw) {
  let href = raw;
  let label = raw;
  const trailing = raw.match(TRAILING_PUNCT_RE);
  if (trailing) {
    href = raw.slice(0, -trailing[0].length);
    label = href;
  }
  if (/^mailto:/i.test(href)) {
    return { href, label: href.replace(/^mailto:/i, '') };
  }
  if (/@/.test(href) && !/^https?:\/\//i.test(href)) {
    return { href: `mailto:${href}`, label: href };
  }
  return { href, label };
}

export function linkifyMessageText(text) {
  if (!text) return [{ type: 'text', value: '' }];

  const parts = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_RE)) {
    const raw = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, index) });
    }
    const { href, label } = normalizeLink(raw);
    parts.push({ type: 'link', href, value: label });
    lastIndex = index + raw.length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts.length ? parts : [{ type: 'text', value: text }];
}

export const FOLLOW_UP_OPTIONS = [
  { label: 'Book / order', value: 'Book / order' },
  { label: 'Price', value: 'Price' },
];

export function getBookOrderContactBlock() {
  return `To book or place an order, contact us:\n${CONTACT_URL}\nEmail: ${CONTACT_EMAIL}`;
}

export function hasPricingContent(text) {
  const lower = String(text).toLowerCase();
  return (
    /\bmur\b/.test(lower) ||
    /\bprice\b/.test(lower) ||
    /\bpricing\b/.test(lower) ||
    /\bas from\b/.test(lower)
  );
}

/** Strip booking/contact upsell from API price replies; UI already shows contact details. */
export function stripBookOrderApiFluff(text) {
  if (!text) return '';
  return cleanBotText(
    String(text)
      .replace(/\s*let me know if you(?:'d| would) like to proceed[^.?\n]*[.?!]?\s*/gi, ' ')
      .replace(/\s*would you like to proceed[^.?\n]*[.?!]?\s*/gi, ' ')
      .replace(/\s*to proceed with booking[^.?\n]*[.?!]?\s*/gi, ' ')
      .replace(/\s*please visit our contact page[^.?\n]*[.?!]?\s*/gi, ' ')
      .replace(/\s*discuss your requirements[^.?\n]*[.?!]?\s*/gi, ' ')
      .replace(/\s*secure your quote[^.?\n]*[.?!]?\s*/gi, ' ')
      .replace(/https?:\/\/[^\s]*\/contact[^\s]*/gi, '')
      .replace(/mailto:[^\s]+/gi, '')
      .replace(/\s*book here:?\s*/gi, ' ')
      .replace(/\s*book a free consultation[^.!\n]*[.!]?\s*/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export function extractPricingLine(text) {
  const cleaned = stripBookOrderApiFluff(text);
  const murMatch = cleaned.match(/[^\n.]*\bmur\b[^\n.]*/i);
  if (murMatch) return murMatch[0].trim();
  const priceMatch = cleaned.match(/[^\n.]*\b(?:price|pricing)\b[^\n.]*/i);
  if (priceMatch) return priceMatch[0].trim();
  return cleaned;
}

export function buildPriceReply(priceText) {
  const priceLine = extractPricingLine(priceText);
  let body = priceLine || stripBookOrderApiFluff(priceText);
  body = body
    .replace(/\s*do you want to choose another option\??\s*/gi, ' ')
    .replace(/\s*do you want another service\??\s*/gi, ' ')
    .replace(/\s*do you want to order or book\??\s*/gi, ' ')
    .trim();
  return `${body}\n\n${BOOK_DECISION_QUESTION_TEXT}`.trim();
}

export function buildBookOrderReply(priceText) {
  const priceLine = extractPricingLine(priceText);
  const body = priceLine || stripBookOrderApiFluff(priceText);
  return `${getBookOrderContactBlock()}\n\n${body}\n\n${ANOTHER_SERVICE_QUESTION_TEXT}`.trim();
}

export const BOOK_DECISION_QUESTION_TEXT = 'Do you want to order or book?';

export const ANOTHER_SERVICE_QUESTION_TEXT = 'Do you want another service?';

/** @deprecated Use ANOTHER_SERVICE_QUESTION_TEXT */
export const LOOP_QUESTION_TEXT = ANOTHER_SERVICE_QUESTION_TEXT;

export const LOOP_GOODBYE_TEXT = 'Thank you from the team and see you later!';

export const LOOP_DECISION_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

const RESHOW_MENU_RE =
  /\b(other services|what else|show menu|see menu|list services|all services|more services|what do you offer|what services|menu options|back to menu|different service|another service)\b/i;

const AFFIRMATIVE_RE = /^(yes|yeah|yep|yup|sure|ok|okay|please|y)$/i;

const NEGATIVE_RE = /^(no|nope|nah|not really|no thanks|no thank you)$/i;

const OTHER_SERVICES_RE =
  /\b(anything else|other services|another service|explore other|see our services|pick another|different service|what else|our other services|explore our other)\b/i;

const CHOOSE_ANOTHER_OPTION_RE =
  /\b(choose another option|another service|would you like to choose another|want to choose another|pick another option|select another service|explore another service|do you want another service)\b/i;

const BOOK_DECISION_RE =
  /\b(do you want to order or book|want to order or book|order or book)\b/i;

const BOOK_OR_MORE_RE =
  /\b(book a consultation|book a free consultation|more information|tell you more|like to book|free consultation|get more information|book or order)\b/i;

export function isAffirmative(text) {
  return AFFIRMATIVE_RE.test(String(text).trim());
}

export function isNegative(text) {
  return NEGATIVE_RE.test(String(text).trim());
}

export function botAskedForOtherServices(text) {
  return OTHER_SERVICES_RE.test(String(text).trim());
}

export function botAskedToChooseAnotherOption(text) {
  return CHOOSE_ANOTHER_OPTION_RE.test(String(text).trim());
}

export function botAskedBookDecision(text) {
  return BOOK_DECISION_RE.test(String(text).trim());
}

export function botAskedForAnotherService(text) {
  return botAskedToChooseAnotherOption(text);
}

/** Bot finished a service turn but did not ask the gated loop question yet. */
export function botTurnNeedsLoopQuestion(text, phase) {
  if (!text || botAskedToChooseAnotherOption(text)) return false;
  if (phase !== 'in_conversation') return false;
  const lower = String(text).trim().toLowerCase();
  return (
    /moi-ai\.dev\/contact/.test(lower) ||
    /\bbook here\b/.test(lower) ||
    /\bhow can i assist you further\b/.test(lower)
  );
}

export function botAskedToBookOrLearnMore(text) {
  return BOOK_OR_MORE_RE.test(String(text).trim());
}

export function getOptionsForAffirmative(lastBotText) {
  if (!lastBotText) return null;
  if (botAskedToChooseAnotherOption(lastBotText)) return WELCOME_OPTIONS;
  if (botAskedForOtherServices(lastBotText)) return WELCOME_OPTIONS;
  if (botAskedToBookOrLearnMore(lastBotText)) return FOLLOW_UP_OPTIONS;
  return null;
}

export function resolveRestoredOptions(userText, lastBotText) {
  const text = String(userText).trim();
  if (RESHOW_MENU_RE.test(text)) return WELCOME_OPTIONS;
  return getOptionsForAffirmative(lastBotText);
}

export function normalizeServiceSelection(text) {
  const value = String(text).trim();
  if (/^[1-6]$/.test(value)) {
    const opt = WELCOME_OPTIONS[parseInt(value, 10) - 1];
    return opt?.value ?? value;
  }
  const lower = value.toLowerCase();
  const match = WELCOME_OPTIONS.find(
    (opt) =>
      opt.value.toLowerCase() === lower ||
      opt.label.toLowerCase() === lower ||
      opt.label.toLowerCase().includes(lower) ||
      lower.includes(opt.label.toLowerCase())
  );
  return match?.value ?? value;
}

export function isServiceSelection(text) {
  const normalized = normalizeServiceSelection(text);
  return WELCOME_OPTIONS.some((opt) => opt.value === normalized);
}

export function isPricingQuestion(text) {
  return /\b(price|pricing|cost|how much|fee|fees|expensive|budget|quote|rate|rates)\b/i.test(
    String(text).trim()
  );
}

export function getLastSelectedServiceTitle(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];
    if (message.role === 'user' && isServiceSelection(message.text)) {
      return normalizeServiceSelection(message.text);
    }
  }
  return null;
}

export function getPostPriceOptions() {
  return FOLLOW_UP_OPTIONS.filter((opt) => opt.value !== 'Price');
}

export function isBookOrderSelection(text) {
  return String(text).trim().toLowerCase() === 'book / order';
}

export function isPriceSelection(text) {
  const value = String(text).trim().toLowerCase();
  return value === 'price' || isPricingQuestion(text);
}

export function isExactPriceButton(text) {
  return String(text).trim().toLowerCase() === 'price';
}

export function isPriceCacheFlow(text) {
  return isExactPriceButton(text) || isBookOrderSelection(text);
}

export function isFollowUpSelection(text) {
  const value = String(text).trim().toLowerCase();
  return FOLLOW_UP_OPTIONS.some(
    (opt) => opt.value.toLowerCase() === value || opt.label.toLowerCase() === value
  );
}

export function isLoopDecisionSelection(text) {
  const value = String(text).trim().toLowerCase();
  return LOOP_DECISION_OPTIONS.some(
    (opt) => opt.value.toLowerCase() === value || opt.label.toLowerCase() === value
  );
}

export function isLoopOptionSet(options) {
  if (!options?.length || options.length !== LOOP_DECISION_OPTIONS.length) return false;
  return options.every((opt, i) => {
    const label = (opt.label || opt.value || '').toLowerCase();
    return label === LOOP_DECISION_OPTIONS[i].label.toLowerCase();
  });
}

export function isWelcomeOptionSet(options) {
  return (
    options?.length === WELCOME_OPTIONS.length &&
    options[0]?.value === WELCOME_OPTIONS[0]?.value
  );
}

export function isFollowUpOptionSet(options) {
  if (!options?.length || options.length !== FOLLOW_UP_OPTIONS.length) return false;
  return options.every((opt, i) => {
    const label = (opt.label || opt.value || '').toLowerCase();
    return label === FOLLOW_UP_OPTIONS[i].label.toLowerCase();
  });
}

export function shouldReshowMenu(userText, lastBotText) {
  const text = String(userText).trim();
  if (RESHOW_MENU_RE.test(text)) return true;
  if (isAffirmative(text) && getOptionsForAffirmative(lastBotText)) return true;
  return false;
}

export function botTurnCompleteForMenuRestore(text) {
  const lower = String(text).trim().toLowerCase();
  if (!lower) return false;
  return (
    botAskedToChooseAnotherOption(text) ||
    botAskedForOtherServices(text) ||
    /moi-ai\.dev\/contact/.test(lower) ||
    /\bbook here\b/.test(lower)
  );
}

/** @deprecated Use botTurnCompleteForMenuRestore for menu restore decisions. */
export function botCompletedServiceTurn(text) {
  return botTurnCompleteForMenuRestore(text);
}

/** Proactively restore options to keep the conversation loop going. */
export function getAutoRestoreOptions(userText, lastBotText, phase) {
  if (!lastBotText) return null;

  if (botAskedToChooseAnotherOption(lastBotText) || botTurnNeedsLoopQuestion(lastBotText, phase)) {
    return null;
  }

  if (phase === 'awaiting_another_service' || phase === 'awaiting_loop_decision') {
    if (isAffirmative(userText) && botAskedForAnotherService(lastBotText)) {
      return WELCOME_OPTIONS;
    }
    return null;
  }

  if (phase === 'awaiting_book_decision') {
    return null;
  }

  const inServiceFlow =
    isServiceSelection(userText) || phase === 'service_selected' || phase === 'in_conversation';

  if (inServiceFlow) {
    if (isServiceSelection(userText) || botAskedToBookOrLearnMore(lastBotText)) {
      return FOLLOW_UP_OPTIONS;
    }
    if (isExactPriceButton(userText)) {
      return getPostPriceOptions();
    }
  }

  return null;
}
