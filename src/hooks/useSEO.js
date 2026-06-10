import { useEffect } from 'react';

const SITE_URL = 'https://mau-ai.com';

const DEFAULTS = {
  title: 'MAU AI — #1 AI Solutions Company in Mauritius & Africa',
  description:
    "MAU AI is Mauritius's leading AI solutions company. We build AI chatbots, AI receptionists, custom AI automation, AI websites and AI voice systems for businesses across Mauritius and Africa. Book a free consultation today.",
  keywords:
    'AI Mauritius, AI Africa, artificial intelligence Mauritius, AI company Mauritius, MAU AI, AI chatbot Mauritius, AI automation Africa',
  url: SITE_URL + '/',
  type: 'website',
};

function setTag(selector, attr, value, create = true) {
  let el = document.querySelector(selector);
  if (!el && create) {
    el = document.createElement('meta');
    const [k, v] = attr.split('=');
    el.setAttribute(k, v.replace(/"/g, ''));
    document.head.appendChild(el);
  }
  if (el) el.setAttribute('content', value);
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
}

export default function useSEO({ title, description, keywords, url, type } = {}) {
  useEffect(() => {
    const t = title || DEFAULTS.title;
    const d = description || DEFAULTS.description;
    const k = keywords || DEFAULTS.keywords;
    const u = url || DEFAULTS.url;
    const tp = type || DEFAULTS.type;

    document.title = t;

    setTag('meta[name="description"]', 'name=description', d);
    setTag('meta[name="keywords"]', 'name=keywords', k);

    setTag('meta[property="og:title"]', 'property=og:title', t);
    setTag('meta[property="og:description"]', 'property=og:description', d);
    setTag('meta[property="og:url"]', 'property=og:url', u);
    setTag('meta[property="og:type"]', 'property=og:type', tp);

    setTag('meta[name="twitter:title"]', 'name=twitter:title', t);
    setTag('meta[name="twitter:description"]', 'name=twitter:description', d);

    setCanonical(u);
  }, [title, description, keywords, url, type]);
}
