import { Hotel, Home } from 'lucide-react';

export const PORTFOLIO_PROJECTS = [
  {
    slug: 'ile-elan',
    title: 'Ile Elan',
    tagline: 'Luxury hotel booking website',
    description:
      'A premium hotel booking experience with elegant design, room browsing, and seamless reservation flows built for luxury hospitality brands.',
    url: 'https://my-project-hotel2.vercel.app/',
    Icon: Hotel,
  },
  {
    slug: 'lakaz',
    title: 'Lakaz',
    tagline: 'Real estate property marketplace',
    description:
      'A modern property marketplace for browsing listings, comparing homes, and connecting buyers with real estate opportunities.',
    url: 'https://my-project-hotel.vercel.app/',
    Icon: Home,
  },
];

export function getPortfolioProject(slug) {
  return PORTFOLIO_PROJECTS.find((project) => project.slug === slug);
}
