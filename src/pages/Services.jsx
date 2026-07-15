import useSEO from '../hooks/useSEO';
import PageHero, { HeroLink } from '../components/marketing/PageHero';
import SectionBlock from '../components/marketing/SectionBlock';
import FeatureGrid from '../components/marketing/FeatureGrid';
import CtaBand from '../components/marketing/CtaBand';
import DocsStepList from '../components/docs/DocsStepList';
import { SERVICES_DETAILED, PROCESS } from '../content/marketing';

export default function Services() {
  useSEO({
    title: 'AI Services in Mauritius & Africa — MO Intelligence',
    description: 'Explore MO Intelligence\'s full range of AI services: AI chatbots, AI virtual receptionists, custom AI automation, AI website development, AI marketing, AI voice interfaces, SEO, AI SEO, and Research and Development for businesses in Mauritius and Africa.',
    keywords: 'AI chatbot Mauritius, AI receptionist Africa, AI automation Mauritius, custom AI solutions Africa, AI website Mauritius, AI marketing Africa, AI voice Mauritius, MO Intelligence services, SEO Mauritius, AI SEO, AI Engine Optimization, Research and Development Mauritius',
    url: 'https://moi-ai.dev/services',
  });

  const steps = PROCESS.map(({ title, desc }, i) => ({
    id: `step-${i + 1}`,
    title,
    description: desc,
  }));

  return (
    <>
      <PageHero
        eyebrow="What we build"
        title="AI Services That Drive Real Business Results"
        subtitle="End-to-end AI solutions custom-built for businesses in Mauritius and across Africa. Each service is designed to create measurable, lasting results."
        actions={<HeroLink to="/contact" primary>Book a consultation</HeroLink>}
      />

      <div className="site-page">
        <SectionBlock title="Our Services">
          <FeatureGrid
            items={SERVICES_DETAILED.map(({ Icon, title, desc, features }) => ({
              Icon,
              title,
              desc,
              features,
            }))}
            columns={2}
          />
        </SectionBlock>

        <SectionBlock title="How We Work">
          <DocsStepList steps={steps} />
        </SectionBlock>
      </div>

      <CtaBand
        title="Ready to Get Started?"
        description="Book a free consultation and discover which AI solutions can make the biggest impact on your business."
        primaryLabel="Book Free Consultation"
        primaryTo="/contact"
      />
    </>
  );
}
