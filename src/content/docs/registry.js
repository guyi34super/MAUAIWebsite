import { callCenterNav, getCallCenterPagePath } from './callCenter';
import { moiNav, getMoiPagePath } from './moi';

export const docsNavProducts = [callCenterNav, moiNav];

export function getDocsPagePath(nav, slug = '') {
  if (nav.slug === 'call-center') return getCallCenterPagePath(slug);
  if (nav.slug === 'moi') return getMoiPagePath(slug);
  return slug ? `/docs/${nav.slug}/${slug}` : `/docs/${nav.slug}`;
}

export const docsProducts = [
  {
    slug: callCenterNav.slug,
    title: callCenterNav.product,
    tagline: callCenterNav.tagline,
    description: callCenterNav.description,
    href: '/docs/call-center',
  },
  {
    slug: moiNav.slug,
    title: 'Research & Development',
    tagline: moiNav.tagline,
    description: moiNav.description,
    href: '/docs/moi',
  },
];
