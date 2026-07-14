export const BRAND = {
  name: 'MO Intelligence',
  shortName: 'MO Intelligence',
  tagline: 'Intelligence That Works',
  url: 'https://moi-ai.dev',
  email: 'team.mau.ai@gmail.com',
  defaultTitle: 'MO Intelligence — #1 AI Solutions Company in Mauritius & Africa',
  defaultDescription:
    "MO Intelligence is Mauritius's leading AI solutions company. We build AI chatbots, AI receptionists, custom AI automation, AI websites and AI voice systems for businesses across Mauritius and Africa. Book a free consultation today.",
  keywords:
    'MO Intelligence, AI Mauritius, AI Africa, artificial intelligence Mauritius, AI company Mauritius, AI chatbot Mauritius, AI automation Africa, AI solutions Africa, best AI company Mauritius',
  logo: {
    line1: 'MO',
    line2Bold: 'intelligence',
    line2Rest: ' that works',
  },
};

export function brandUrl(path = '/') {
  return path === '/' ? `${BRAND.url}/` : `${BRAND.url}${path}`;
}
