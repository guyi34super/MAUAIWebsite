import {
  AUTO_GREETING,
  WELCOME_OPTIONS,
} from '../content/chatbot.js';

const CONVERSATION_STORAGE_KEY = 'mauai-chat-conversation-id-v4';
const WELCOME_CACHE_KEY = 'mauai-chat-welcome-cache-v2';
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
    sessionStorage.removeItem(WELCOME_CACHE_KEY);
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
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.replace(/\s{2,}/g, ' ').trim())
    .join('\n')
    .trim();
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

const RESHOW_MENU_RE =
  /\b(other services|what else|show menu|see menu|list services|all services|more services|what do you offer|what services|menu options|back to menu|different service|another service)\b/i;

export function shouldReshowMenu(text) {
  return RESHOW_MENU_RE.test(String(text).trim());
}
