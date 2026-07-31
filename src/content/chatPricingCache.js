/**
 * Static chat cache — bundled with the app, same for every user.
 * Update pricing here when knowledge-base documents change.
 */
import { CHAT_SERVICES } from './chatbot.js';

const CONSULT_FALLBACK =
  'Exact pricing is confirmed after a free consultation. Contact us for a tailored quote.';

/** Verbatim-style pricing per service (sync with Call Center KB documents). */
export const CHAT_PRICE_BY_SERVICE = {
  'AI Customer Service Chatbot':
    'As from MUR 25,000 setup + MUR 10,000/month. Varies by channels (website, WhatsApp, email), languages, and monthly conversation volume.',
  'AI Virtual Receptionist':
    'As from MUR 30,000 setup + MUR 12,000/month. Varies by languages, call volume, and CRM integrations.',
  'Custom AI Solutions':
    'As from MUR 50,000 project-based. Scope depends on workflows, integrations, and data sources — consultation required for exact pricing.',
  'AI Website Development':
    'As from MUR 40,000. Varies by pages, AI features, and integrations.',
  'AI Marketing':
    'As from MUR 10,000/month. Varies by channels, content volume, and campaign scope.',
  'AI Voice Interfaces':
    'As from MUR 35,000 setup + MUR 15,000/month. Varies by call volume, languages, and telephony integration.',
};

export function getStaticPriceReply(serviceTitle) {
  const key = String(serviceTitle || '').trim();
  return CHAT_PRICE_BY_SERVICE[key] || CONSULT_FALLBACK;
}

export function getAllCachedServiceTitles() {
  return CHAT_SERVICES.map((s) => s.title);
}

export function getStaticCacheSummary() {
  const titles = getAllCachedServiceTitles();
  const cached = titles.filter((t) => Boolean(CHAT_PRICE_BY_SERVICE[t]));
  return {
    total: titles.length,
    cachedCount: cached.length,
    missing: titles.filter((t) => !CHAT_PRICE_BY_SERVICE[t]),
  };
}
