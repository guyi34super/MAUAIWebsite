import useSEO from '../hooks/useSEO';
import PageHero, { HeroLink } from '../components/marketing/PageHero';
import SectionBlock from '../components/marketing/SectionBlock';
import FeatureGrid from '../components/marketing/FeatureGrid';
import CtaBand from '../components/marketing/CtaBand';
import { PORTFOLIO_PROJECTS } from '../content/portfolio';

export default function Portfolio() {
  useSEO({
    title: 'Portfolio — MO Intelligence',
    description:
      'Explore MO Intelligence portfolio projects: Ile Elan luxury hotel booking, Lakaz real estate marketplace, and AI Business Portal — AI-powered websites built for Mauritius and Africa.',
    keywords:
      'MO Intelligence portfolio, AI website Mauritius, hotel booking website, real estate marketplace Africa, AI business portal, Ile Elan, Lakaz',
    url: 'https://moi-ai.dev/portfolio',
  });

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Portfolio"
        subtitle="Selected AI-powered websites and digital products we've built for hospitality and real estate."
        actions={<HeroLink to="/contact" primary>Start your project</HeroLink>}
      />

      <div className="site-page">
        <SectionBlock title="Featured Projects">
          <FeatureGrid
            items={PORTFOLIO_PROJECTS.map(({ Icon, title, tagline, description, slug }) => ({
              Icon,
              title,
              tagline,
              desc: description,
              href: `/portfolio/${slug}`,
            }))}
            columns={2}
          />
        </SectionBlock>
      </div>

      <CtaBand
        title="Want something like this?"
        description="Book a free consultation and we'll design an AI-powered website tailored to your business."
        primaryLabel="Book Free Consultation"
        primaryTo="/contact"
      />
    </>
  );
}
