import { Hotel, Home, Briefcase } from 'lucide-react';

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
  {
    slug: 'ai-business-portal',
    title: 'AI Business Portal',
    tagline: 'AI business portal',
    description:
      'A secure business portal with login, dashboards, and AI-powered tools to manage operations, insights, and customer workflows in one place.',
    url: 'https://my-project-ai-website.vercel.app/login',
    Icon: Briefcase,
  },
];

export function getPortfolioProject(slug) {
  return PORTFOLIO_PROJECTS.find((project) => project.slug === slug);
}
