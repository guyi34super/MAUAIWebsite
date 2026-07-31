import { getStaticPriceReply } from '../content/chatPricingCache.js';
import { normalizeServiceSelection } from './chatUtils.js';

export function normalizeCacheServiceKey(serviceTitle) {
  return normalizeServiceSelection(serviceTitle);
}

/** Read price reply from bundled static cache (same for all users). */
export function getCachedPriceReply(serviceTitle) {
  const key = normalizeCacheServiceKey(serviceTitle);
  if (!key) return null;
  return getStaticPriceReply(key);
}
