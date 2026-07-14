import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import PageHero, { HeroLink } from '../components/marketing/PageHero';
import SectionBlock from '../components/marketing/SectionBlock';
import FeatureGrid from '../components/marketing/FeatureGrid';
import FaqList from '../components/marketing/FaqList';
import CtaBand from '../components/marketing/CtaBand';
import Robot3DLazy from '../components/Robot3DLazy';
import SpeechBubble from '../components/SpeechBubble';
import {
  SERVICES, WHY, INDUSTRIES, AFRICA_POINTS, FAQS, TEAM,
} from '../content/marketing';

export default function Home() {
  useSEO({
    title: 'MO Intelligence — #1 AI Solutions Company in Mauritius & Africa',
    description: "MO Intelligence is Mauritius's leading AI solutions company. We build AI chatbots, AI receptionists, custom AI automation, AI websites and AI voice systems for businesses across Mauritius and Africa. Book a free consultation today.",
    keywords: 'AI Mauritius, AI Africa, artificial intelligence Mauritius, AI company Mauritius, MO Intelligence, AI chatbot Mauritius, AI automation Africa, AI solutions Africa, best AI company Mauritius, AI startup Mauritius',
    url: 'https://moi-ai.dev/',
  });

  return (
    <>
      <PageHero
        eyebrow="Mauritius-based AI solutions"
        title="Intelligence That Works for Your Business"
        subtitle="MO Intelligence is Mauritius's leading AI solutions company — helping businesses across Mauritius and Africa automate operations, improve customer experience, and unlock new revenue through custom-built AI systems."
        actions={(
          <>
            <HeroLink to="/contact" primary>Get Started</HeroLink>
            <HeroLink to="/services">Our Services</HeroLink>
          </>
        )}
      >
        <div className="robot-stage">
          <SpeechBubble />
          <Robot3DLazy interactive />
        </div>
      </PageHero>

      <div className="site-page">
      <SectionBlock
        title="Mauritius's Leading AI Company — Transforming Businesses Across Africa"
        subtitle="Our team combines expertise in software engineering, electronics, operations, and business strategy to deliver practical AI solutions tailored for the Mauritian and African market."
      >
        <div className="site-team-grid">
          {TEAM.map(([name, role]) => (
            <div key={name} className="site-team-card">
              <p className="site-team-card__name">{name}</p>
              <p className="site-team-card__role">{role}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: '0.9375rem', lineHeight: 1.75, color: 'var(--color-body)' }}>
          Our mission is to build an AI ecosystem that enables businesses across Mauritius
          and Africa to operate more efficiently, serve customers better, and unlock new
          growth opportunities through intelligent technology.
        </p>
      </SectionBlock>

      <SectionBlock
        title="Our AI Services"
        subtitle="End-to-end AI solutions designed for Mauritian businesses — from chatbots to voice interfaces to full workflow automation."
      >
        <FeatureGrid
          items={SERVICES.map((s) => ({ ...s, href: '/services' }))}
          columns={3}
        />
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/services" className="site-btn site-btn--outline">View all services</Link>
        </div>
      </SectionBlock>

      <SectionBlock title="Why MO Intelligence?">
        <FeatureGrid items={WHY} columns={3} />
      </SectionBlock>

      <SectionBlock
        title="Built for Every Sector"
        subtitle="Any business with a website and customer inquiries can benefit from intelligent, automated support."
      >
        <div className="site-industries">
          {INDUSTRIES.map(({ Icon, label }) => (
            <div key={label} className="site-industry">
              <div className="site-industry__icon"><Icon size={18} /></div>
              <span className="site-industry__label">{label}</span>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock
        title="AI Solutions for Mauritius & Africa"
        subtitle="Mauritius is Africa's technology gateway. MO Intelligence delivers intelligent automation to businesses across the continent — with local expertise, multilingual support, and African market understanding."
      >
        <FeatureGrid items={AFRICA_POINTS} columns={3} />
        <p className="sr-only">
          MO Intelligence provides AI solutions in Mauritius, Réunion, Madagascar, Seychelles, Comoros,
          East Africa, Kenya, Tanzania, South Africa, Zimbabwe, Zambia, Mozambique, Botswana,
          Namibia, Nigeria, Ghana, Senegal, Ivory Coast, Cameroon, and across Francophone Africa
          and Anglophone Africa.
        </p>
      </SectionBlock>

      <SectionBlock
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about AI solutions for your business in Mauritius and Africa."
      >
        <FaqList items={FAQS} />
      </SectionBlock>
      </div>

      <CtaBand
        title="Ready to Transform Your Business?"
        description="Schedule a consultation with MO Intelligence and discover how intelligent automation can elevate your operations."
        primaryLabel="Contact MO Intelligence"
        primaryTo="/contact"
        secondaryLabel="Learn More"
        secondaryTo="/services"
      />
    </>
  );
}
