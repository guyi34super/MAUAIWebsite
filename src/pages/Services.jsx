import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot, UserCheck, Settings2, Globe, Megaphone, Mic2,
  CheckCircle2, ArrowRight,
} from 'lucide-react';

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
    color: '#00d4ff',
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
    color: '#00ff88',
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
    color: '#7b2fff',
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
    color: '#00d4ff',
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
    color: '#00ff88',
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
    color: '#7b2fff',
  },
];

const PROCESS = [
  { step: '01', title: 'Discovery Call', desc: 'We learn about your business, goals, pain points, and the opportunities AI can unlock for you.' },
  { step: '02', title: 'Solution Design', desc: 'We design a tailored AI solution that fits your specific workflows, systems, and customers.' },
  { step: '03', title: 'Build & Integrate', desc: 'Our team builds and integrates the AI system into your existing tools and platforms.' },
  { step: '04', title: 'Launch & Optimise', desc: 'We launch, monitor, and continuously optimise for performance and business outcomes.' },
];

function ServiceCard({ Icon, title, desc, features, color, delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="glass-card hover-glow rounded-2xl p-9 relative overflow-hidden flex flex-col" style={{ transitionDelay: `${delay}ms` }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}55, transparent)`, opacity: 0, transition: 'opacity .3s' }} className="card-line" />
      <div className="mb-6 rounded-2xl flex items-center justify-center"
        style={{ width: 68, height: 68, background: `${color}12`, border: `1px solid ${color}22` }}>
        <Icon size={28} color={color} />
      </div>
      <h3 className="font-bold text-xl mb-4 leading-snug">{title}</h3>
      <p className="text-sm leading-7 mb-6" style={{ color: 'rgba(255,255,255,0.54)' }}>{desc}</p>
      <ul className="flex flex-col gap-3 mt-auto">
        {features.map(f => (
          <li key={f} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <CheckCircle2 size={15} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Services() {
  return (
    <>
      {/* Page Hero */}
      <section className="relative z-10 text-center overflow-hidden" style={{ padding: '160px 64px 80px', background: '#050508' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 600px 300px at 50% 40%, rgba(0,212,255,0.07) 0%, transparent 70%)' }} />
        <motion.div
          className="relative max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ background: 'rgba(0,212,255,0.09)', border: '1px solid rgba(0,212,255,0.28)', color: '#00d4ff', padding: '6px 16px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff' }} />
            What We Build
          </span>
          <h1 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2.4rem,5vw,4rem)', letterSpacing: '-1.5px', lineHeight: 1.08 }}>
            AI Services That Drive<br /><span className="gradient-text">Real Business Results</span>
          </h1>
          <div style={{ width: 54, height: 2, background: 'linear-gradient(90deg,#00d4ff,#00ff88)', margin: '18px auto' }} />
          <p className="text-base leading-8" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 540, margin: '0 auto' }}>
            End-to-end AI solutions custom-built for Mauritian businesses.
            Each service is designed to create measurable, lasting results.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="relative z-10" style={{ background: '#08080f', padding: '72px 64px 100px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map((s, i) => <ServiceCard key={s.title} {...s} delay={i * 70} />)}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10" style={{ background: '#050508', padding: '100px 64px' }}>
        <div className="max-w-5xl mx-auto">
          {(() => { const r = useReveal(); return (
            <div ref={r} className="text-center mb-16">
              <span className="inline-flex items-center gap-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
                style={{ background: 'rgba(0,212,255,0.09)', border: '1px solid rgba(0,212,255,0.28)', color: '#00d4ff', padding: '6px 16px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff' }} />
                Our Process
              </span>
              <h2 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', letterSpacing: '-0.5px' }}>
                How We Work
              </h2>
              <div style={{ width: 54, height: 2, background: 'linear-gradient(90deg,#00d4ff,#00ff88)', margin: '14px auto 0' }} />
            </div>
          ); })()}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROCESS.map(({ step, title, desc }, i) => {
              const r = useReveal();
              return (
                <div key={step} ref={r} className="glass-card rounded-2xl p-7 relative hover-glow" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="font-extrabold text-4xl gradient-text block mb-5" style={{ lineHeight: 1 }}>{step}</span>
                  <h3 className="font-bold text-base mb-3">{title}</h3>
                  <p className="text-sm leading-7" style={{ color: 'rgba(255,255,255,0.52)' }}>{desc}</p>
                  {i < PROCESS.length - 1 && (
                    <div className="absolute top-9 right-0 translate-x-1/2 hidden lg:block z-10">
                      <ArrowRight size={16} color="rgba(0,212,255,0.35)" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center overflow-hidden" style={{ background: '#08080f', padding: '100px 64px' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 600px 280px at 50% 50%, rgba(0,212,255,0.07) 0%, transparent 70%)' }} />
        {(() => { const r = useReveal(); return (
          <div ref={r} className="relative max-w-2xl mx-auto">
            <h2 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', letterSpacing: '-1px', lineHeight: 1.1 }}>
              Ready to Get Started?
            </h2>
            <p className="mt-5 text-base leading-8" style={{ color: 'rgba(255,255,255,0.54)' }}>
              Book a free consultation and discover which AI solutions can make
              the biggest impact on your business.
            </p>
            <div className="mt-10">
              <Link to="/contact" className="btn-gradient inline-flex items-center gap-2 rounded-lg px-10 py-4 font-bold text-sm no-underline">
                Book Free Consultation <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ); })()}
      </section>
    </>
  );
}
