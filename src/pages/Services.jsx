import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot, UserCheck, Settings2, Globe, Megaphone, Mic2,
  CheckCircle2, ArrowRight,
} from 'lucide-react';
import useSEO from '../hooks/useSEO';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('reveal-up');
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const SERVICES = [
  {
    Icon: Bot,
    title: 'AI Customer Service Chatbot',
    desc: 'A conversational AI agent trained on your business, products, services, FAQs and policies. Deployable across websites, WhatsApp, and email. Available 24/7 with zero wait time.',
    features: [
      'Trained on your specific business content',
      'Multi-platform: website, WhatsApp, email',
      '24/7 availability with instant responses',
      'Seamless handoff to human agents',
      'Analytics and conversation insights',
    ],
  },
  {
    Icon: UserCheck,
    title: 'AI Virtual Receptionist',
    desc: 'Multilingual AI receptionist for answering questions, qualifying leads, booking appointments, capturing customer information, and escalating high-value opportunities.',
    features: [
      'Multilingual support (English, French, Creole)',
      'Lead qualification and scoring',
      'Calendar integration and appointment booking',
      'Customer data capture and CRM sync',
      'High-value lead escalation alerts',
    ],
  },
  {
    Icon: Settings2,
    title: 'Custom AI Solutions',
    desc: 'Purpose-built AI systems for your operations: workflow automation, document processing, knowledge bases, integrations, and internal productivity systems.',
    features: [
      'Workflow and process automation',
      'Document processing and extraction',
      'Internal knowledge base systems',
      'API integrations and custom pipelines',
      'AI-powered dashboards and reporting',
    ],
  },
  {
    Icon: Globe,
    title: 'AI Website Development',
    desc: 'Modern websites enhanced with AI capabilities including lead generation, customer engagement, automation, and intelligent user experiences.',
    features: [
      'AI-enhanced UI and user flows',
      'Integrated chatbot and lead capture',
      'Personalised content and recommendations',
      'Automated follow-up sequences',
      'Performance analytics and A/B testing',
    ],
  },
  {
    Icon: Megaphone,
    title: 'AI Marketing',
    desc: 'AI-powered marketing systems for lead generation, content creation, customer targeting, and campaign optimisation.',
    features: [
      'AI-generated content and copywriting',
      'Intelligent audience segmentation',
      'Automated campaign management',
      'Lead scoring and nurturing sequences',
      'ROI tracking and optimisation',
    ],
  },
  {
    Icon: Mic2,
    title: 'AI Voice Interfaces',
    desc: 'Voice-enabled AI assistants capable of handling inquiries, bookings, and customer interactions with natural, human-like conversation.',
    features: [
      'Natural language voice processing',
      'Phone and IVR system integration',
      'Booking and inquiry handling',
      'Multi-language voice support',
      'Voice analytics and reporting',
    ],
  },
];

const PROCESS = [
  { step: '01', title: 'Discovery Call', desc: 'We learn about your business, goals, pain points, and the opportunities AI can unlock for you.' },
  { step: '02', title: 'Solution Design', desc: 'We design a tailored AI solution that fits your specific workflows, systems, and customers.' },
  { step: '03', title: 'Build & Integrate', desc: 'Our team builds and integrates the AI system into your existing tools and platforms.' },
  { step: '04', title: 'Launch & Optimise', desc: 'We launch, monitor, and continuously optimise for performance and business outcomes.' },
];

function ServiceCard({ Icon, title, desc, features, delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="glass-card hover-glow rounded-2xl p-9 flex flex-col" style={{ transitionDelay: `${delay}ms` }}>
      <div className="mb-6 rounded-2xl flex items-center justify-center"
        style={{ width: 68, height: 68, background: '#f0f0f4', border: '1px solid #e0e0e8' }}>
        <Icon size={28} color="#0d0d12" />
      </div>
      <h3 className="font-bold text-xl mb-4 leading-snug" style={{ color: '#0d0d12' }}>{title}</h3>
      <p className="text-sm leading-7 mb-6" style={{ color: '#6b7280' }}>{desc}</p>
      <ul className="flex flex-col gap-3 mt-auto">
        {features.map(f => (
          <li key={f} className="flex items-start gap-3 text-sm" style={{ color: '#4b5563' }}>
            <CheckCircle2 size={15} color="#0d0d12" style={{ flexShrink: 0, marginTop: 1 }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProcessStep({ step, title, desc, last, delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="glass-card rounded-2xl p-7 relative hover-glow" style={{ transitionDelay: `${delay}ms` }}>
      <span className="font-extrabold text-4xl block mb-5" style={{ lineHeight: 1, color: '#0d0d12' }}>{step}</span>
      <h3 className="font-bold text-base mb-3" style={{ color: '#0d0d12' }}>{title}</h3>
      <p className="text-sm leading-7" style={{ color: '#6b7280' }}>{desc}</p>
      {!last && (
        <div className="absolute top-9 right-0 translate-x-1/2 hidden lg:block z-10">
          <ArrowRight size={16} color="#9ca3af" />
        </div>
      )}
    </div>
  );
}

function SectionHeader({ tag, title, delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="text-center mb-16" style={{ transitionDelay: `${delay}ms` }}>
      <span className="tag-pill inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-5">
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d0d12', display: 'inline-block' }} />
        {tag}
      </span>
      <h2 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', letterSpacing: '-0.5px', color: '#0d0d12' }}>
        {title}
      </h2>
      <div className="section-line" style={{ margin: '14px auto 0' }} />
    </div>
  );
}

export default function Services() {
  useSEO({
    title: 'AI Services in Mauritius & Africa — MAU AI',
    description: 'Explore MAU AI\'s full range of AI services: AI chatbots, AI virtual receptionists, custom AI automation, AI website development, AI marketing, and AI voice interfaces for businesses in Mauritius and Africa.',
    keywords: 'AI chatbot Mauritius, AI receptionist Africa, AI automation Mauritius, custom AI solutions Africa, AI website Mauritius, AI marketing Africa, AI voice Mauritius, MAU AI services',
    url: 'https://mau-ai.com/services',
  });

  return (
    <>
      {/* Hero */}
      <section className="relative z-10 text-center overflow-hidden" style={{ padding: '160px 64px 80px', background: '#fafafa' }}>
        <motion.div
          className="relative max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="tag-pill inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-5">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d0d12', display: 'inline-block' }} />
            What We Build
          </span>
          <h1 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', letterSpacing: '-1.5px', lineHeight: 1.08, color: '#0d0d12' }}>
            AI Services That Drive<br />Real Business Results
          </h1>
          <div className="section-line" style={{ margin: '18px auto' }} />
          <p className="text-base leading-8" style={{ color: '#6b7280', maxWidth: 540, margin: '0 auto' }}>
            End-to-end AI solutions custom-built for businesses in Mauritius and across Africa.
            Each service is designed to create measurable, lasting results.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="relative z-10" style={{ background: '#f2f3f5', padding: '72px 64px 100px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map((s, i) => <ServiceCard key={s.title} {...s} delay={i * 70} />)}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10" style={{ background: '#fafafa', padding: '100px 64px' }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader tag="Our Process" title="How We Work" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map(({ step, title, desc }, i) => (
              <ProcessStep key={step} step={step} title={title} desc={desc} last={i === PROCESS.length - 1} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center overflow-hidden" style={{ background: '#0d0d12', padding: '100px 64px' }}>
        {(() => {
          const ref = useReveal();
          return (
            <div ref={ref} className="relative max-w-2xl mx-auto">
              <h2 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', letterSpacing: '-1px', lineHeight: 1.1, color: '#fff' }}>
                Ready to Get Started?
              </h2>
              <p className="mt-5 text-base leading-8" style={{ color: 'rgba(255,255,255,0.54)' }}>
                Book a free consultation and discover which AI solutions can make
                the biggest impact on your business.
              </p>
              <div className="mt-10">
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg px-10 py-4 font-bold text-sm no-underline"
                  style={{ background: '#fff', color: '#0d0d12', letterSpacing: '0.5px' }}>
                  Book Free Consultation <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          );
        })()}
      </section>
    </>
  );
}
