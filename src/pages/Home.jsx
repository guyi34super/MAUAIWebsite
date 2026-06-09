import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bot, UserCheck, Settings2, Globe, Megaphone, Mic2,
  Clock, TrendingUp, DollarSign, Zap, Scaling, Target,
  Building2, Hotel, Home as HomeIcon, Briefcase, GraduationCap,
  ShoppingCart, Landmark, ArrowRight, ChevronRight,
} from 'lucide-react';
import Robot from '../components/Robot';

/* ── scroll reveal ── */
function useReveal(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('reveal-up');
    el.style.transitionDelay = `${delay}ms`;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ── section header ── */
function SectionHeader({ tag, title, desc }) {
  const r = useReveal();
  return (
    <div ref={r} className="text-center mb-14">
      <span className="tag-pill">{tag}</span>
      <h2 className="mt-4 font-extrabold" style={{ fontSize: 'clamp(1.9rem,3.6vw,2.8rem)', letterSpacing: '-0.5px', color: '#0d0d12', lineHeight: 1.12 }}>
        {title}
      </h2>
      <div className="section-line" />
      {desc && <p className="mt-4 mx-auto text-sm leading-7" style={{ color: '#6b7280', maxWidth: 500 }}>{desc}</p>}
    </div>
  );
}

/* ── floating panel (ChainGPT-style) ── */
function FloatPanel({ children, style, delay = 0 }) {
  return (
    <motion.div
      className="float-panel"
      style={{ padding: '14px 18px', ...style }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="float-panel-corner tl" />
      <div className="float-panel-corner tr" />
      <div className="float-panel-corner bl" />
      <div className="float-panel-corner br" />
      {children}
    </motion.div>
  );
}

/* ── data ── */
const SERVICES = [
  { Icon: Bot,       title: 'AI Customer Service Chatbot',  desc: 'Conversational AI trained on your business, products and policies. Available 24/7 across websites, WhatsApp and email with zero wait time.' },
  { Icon: UserCheck, title: 'AI Virtual Receptionist',      desc: 'Multilingual AI receptionist for answering questions, qualifying leads, booking appointments and escalating high-value opportunities.' },
  { Icon: Settings2, title: 'Custom AI Solutions',          desc: 'Purpose-built AI systems: workflow automation, document processing, knowledge bases, integrations and internal productivity tools.' },
  { Icon: Globe,     title: 'AI Website Development',       desc: 'Modern websites enhanced with AI for lead generation, customer engagement, automation and intelligent user experiences.' },
  { Icon: Megaphone, title: 'AI Marketing',                 desc: 'AI-powered marketing for lead generation, content creation, customer targeting and campaign optimisation.' },
  { Icon: Mic2,      title: 'AI Voice Interfaces',          desc: 'Voice-enabled AI assistants handling inquiries, bookings and customer interactions with natural, human-like conversation.' },
];

const WHY = [
  { Icon: Clock,      title: '24/7 Customer Engagement',  desc: 'Round-the-clock availability ensures your business never misses a customer query or opportunity.' },
  { Icon: TrendingUp, title: 'Increased Lead Conversion', desc: 'Intelligent qualification and instant follow-up dramatically improve conversion rates.' },
  { Icon: DollarSign, title: 'Reduced Operational Costs', desc: 'AI handles repetitive tasks at a fraction of the cost of full-time staff.' },
  { Icon: Zap,        title: 'Faster Response Times',     desc: 'Customers receive answers in seconds, not hours, dramatically improving satisfaction.' },
  { Icon: Scaling,    title: 'Scalable Automation',       desc: 'Solutions grow with your business from SME to enterprise without added overhead.' },
  { Icon: Target,     title: 'Tailored Implementations',  desc: 'Custom-built for each client — SMEs and enterprises across every industry.' },
];

const INDUSTRIES = [
  { Icon: Building2,     label: 'Healthcare' },
  { Icon: Hotel,         label: 'Hospitality' },
  { Icon: HomeIcon,      label: 'Real Estate' },
  { Icon: Briefcase,     label: 'Professional' },
  { Icon: GraduationCap, label: 'Education' },
  { Icon: ShoppingCart,  label: 'E-Commerce' },
  { Icon: Landmark,      label: 'Finance' },
];

/* ── service card ── */
function ServiceCard({ Icon, title, desc, i }) {
  const r = useReveal(i * 60);
  return (
    <div ref={r} className="glass-card hover-glow rounded-2xl p-7 group"
      style={{ border: '1px solid #e8e8ec' }}>
      <div className="mb-5 rounded-xl flex items-center justify-center"
        style={{ width: 52, height: 52, background: '#f4f4f8', border: '1px solid #e0e0e8' }}>
        <Icon size={22} color="#0d0d12" />
      </div>
      <div style={{ width: 32, height: 1.5, background: '#0d0d12', marginBottom: 12, opacity: 0.15 }} />
      <h3 className="font-bold mb-3 text-sm leading-snug" style={{ color: '#0d0d12' }}>{title}</h3>
      <p className="text-sm leading-7" style={{ color: '#6b7280' }}>{desc}</p>
    </div>
  );
}

/* ── why card ── */
function WhyCard({ Icon, title, desc, i }) {
  const r = useReveal(i * 55);
  return (
    <div ref={r} className="glass-card hover-glow rounded-2xl p-6" style={{ border: '1px solid #e8e8ec' }}>
      <div className="mb-4 rounded-xl flex items-center justify-center"
        style={{ width: 44, height: 44, background: '#f4f4f8', border: '1px solid #e0e0e8' }}>
        <Icon size={18} color="#0d0d12" />
      </div>
      <h3 className="font-bold mb-2 text-sm">{title}</h3>
      <p className="text-sm leading-7" style={{ color: '#6b7280' }}>{desc}</p>
    </div>
  );
}

/* ── page ── */
export default function Home() {
  return (
    <>
      {/* ═══ HERO (ChainGPT-inspired layout) ═══ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 80 }}
      >
        {/* Top label bar — like ChainGPT's "UNLEASH THE POWER OF" */}
        <motion.div
          className="absolute top-28 left-16 right-16 flex justify-between items-start z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#aaa', letterSpacing: '3px' }}>
            MAURITIUS-BASED AI SOLUTIONS
          </p>
          <p className="hidden md:block text-xs font-bold tracking-widest uppercase" style={{ color: '#aaa', letterSpacing: '3px' }}>
            INTELLIGENCE THAT WORKS
          </p>
        </motion.div>

        {/* Robot + floating panels — centred in hero */}
        <div className="absolute inset-0 flex items-center justify-center z-10">

          {/* LEFT floating panel — big query */}
          <FloatPanel
            delay={0.7}
            style={{ left: '6%', top: '28%', maxWidth: 240, display: 'none' }}
          >
            <div className="flex items-start gap-2 mb-3">
              <div style={{ width: 22, height: 22, background: '#f0f0f4', border: '1px solid #e0e0e8', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#888' }}>"</span>
              </div>
              <div style={{ width: 10, height: 10, marginTop: 6 }}>
                <div style={{ width: '100%', height: 1.5, background: '#0d0d12', marginBottom: 3 }} />
                <div style={{ width: 20, height: 1.5, background: '#0d0d12' }} />
              </div>
            </div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '1.5px', lineHeight: 1.6, color: '#0d0d12', textTransform: 'uppercase' }}>
              AUTOMATE MY<br />CUSTOMER SERVICE<br />WITH AI
            </p>
          </FloatPanel>

          {/* RIGHT panels — visible on lg screens */}
          <div className="absolute right-6 xl:right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-20" style={{ maxWidth: 230 }}>
            <FloatPanel delay={0.7} style={{ position: 'relative' }}>
              <div className="flex items-center gap-2 mb-2">
                <div style={{ width: 20, height: 20, borderRadius: 4, background: '#f4f4f8', border: '1px solid #e0e0e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#666' }}>"</span>
                </div>
                <div style={{ width: 8, height: 8, marginTop: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5 L8 5 M6 3 L8 5 L6 7" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', lineHeight: 1.7, color: '#0d0d12', textTransform: 'uppercase' }}>
                AUTOMATE MY<br />CUSTOMER SERVICE<br />WITH AI
              </p>
            </FloatPanel>

            <FloatPanel delay={0.9} style={{ position: 'relative' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1px', lineHeight: 1.7, color: '#555', textTransform: 'uppercase' }}>
                BOOK APPOINTMENTS<br />AUTOMATICALLY
              </p>
            </FloatPanel>
          </div>

          {/* Robot — centered */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Robot />
          </motion.div>

          {/* LEFT floating panels */}
          <div className="absolute left-6 xl:left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-20" style={{ maxWidth: 200 }}>
            <FloatPanel delay={0.8} style={{ position: 'relative' }}>
              <div className="flex items-center gap-2 mb-1">
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0be881' }} />
                <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', color: '#555', textTransform: 'uppercase' }}>
                  AI CHATBOT LIVE
                </p>
              </div>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0d0d12' }}>247 LEADS CAPTURED</p>
            </FloatPanel>

            <FloatPanel delay={1.0} style={{ position: 'relative' }}>
              <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', color: '#555', textTransform: 'uppercase', marginBottom: 4 }}>
                RESPONSE TIME
              </p>
              <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0d0d12' }}>0.3s</p>
            </FloatPanel>

            <FloatPanel delay={1.1} style={{ position: 'relative' }}>
              <p style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '1.5px', color: '#555', textTransform: 'uppercase', marginBottom: 4 }}>
                AI RECEPTIONIST
              </p>
              <div className="flex items-center gap-1.5">
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff4757', animation: 'pulse 1.5s infinite' }} />
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0d0d12' }}>ONLINE 24/7</p>
              </div>
            </FloatPanel>
          </div>
        </div>

        {/* Bottom left — BIG headline like ChainGPT */}
        <motion.div
          className="relative z-20 px-14 md:px-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#aaa', letterSpacing: '3px' }}>
            UNLEASH THE POWER OF
          </p>
          <h1 className="font-black leading-none tracking-tight" style={{ fontSize: 'clamp(3rem,7vw,6rem)', letterSpacing: '-2px', color: '#0d0d12', lineHeight: 0.95 }}>
            Artificial<br />Intelligence
          </h1>
          <p className="mt-5 text-sm leading-7 max-w-sm" style={{ color: '#6b7280' }}>
            MAU AI helps Mauritian businesses automate operations, improve customer
            experience, and unlock new revenue through custom-built AI systems.
          </p>
          <div className="flex flex-wrap gap-4 mt-7">
            <Link to="/contact"
              className="btn-primary rounded-lg px-8 py-3.5 text-sm font-bold no-underline inline-flex items-center gap-2"
              style={{ letterSpacing: '0.5px' }}>
              Get Started <ArrowRight size={15} />
            </Link>
            <Link to="/services"
              className="btn-outline rounded-lg px-8 py-3.5 text-sm no-underline inline-flex items-center gap-2">
              Our Services <ChevronRight size={15} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ═══ STATS TICKER ═══ */}
      <div className="relative z-10 overflow-hidden" style={{ background: '#0d0d12', padding: '18px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="ticker-track flex gap-14 whitespace-nowrap" style={{ width: 'max-content' }}>
          {[
            ['6+', 'AI Service Categories'], ['7+', 'Industries Served'],
            ['24/7', 'AI Availability'], ['100%', 'Tailored Solutions'],
            ['6+', 'AI Service Categories'], ['7+', 'Industries Served'],
            ['24/7', 'AI Availability'], ['100%', 'Tailored Solutions'],
          ].map(([num, label], i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="font-extrabold text-xl" style={{ color: 'white' }}>{num}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>{label}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT ═══ */}
      <section className="relative z-10" style={{ background: '#f2f3f5', padding: '100px 64px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {(() => { const r = useReveal(); return (
            <div ref={r}>
              <span className="tag-pill">Who We Are</span>
              <h2 className="mt-5 font-extrabold tracking-tight" style={{ fontSize: 'clamp(1.8rem,3.4vw,2.6rem)', letterSpacing: '-0.5px', lineHeight: 1.15, color: '#0d0d12' }}>
                Transforming Mauritian Businesses Through Artificial Intelligence
              </h2>
              <p className="mt-5 text-sm leading-8" style={{ color: '#6b7280' }}>
                MAU AI is a Mauritian AI solutions company focused on helping businesses automate
                operations, improve customer experience, increase revenue, and save time through
                intelligent systems.
              </p>
              <p className="mt-3 text-sm leading-8" style={{ color: '#6b7280' }}>
                Our team combines expertise in software engineering, electronics, operations, and
                business strategy to deliver practical AI solutions that create measurable results.
              </p>
              <p className="mt-8 text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#aaa', letterSpacing: '2px' }}>
                Leadership Team
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Pydiah Reezvi-Mathiah', 'Founder & MD'],
                  ['Bhavish', 'Director of Technology'],
                  ['Rushal', 'Director of Engineering'],
                  ['Taj', 'Director of Operations'],
                ].map(([name, role]) => (
                  <div key={name} className="glass-card hover-glow rounded-xl p-4" style={{ border: '1px solid #e8e8ec' }}>
                    <p className="font-bold text-sm" style={{ color: '#0d0d12' }}>{name}</p>
                    <p className="text-xs mt-1" style={{ color: '#888' }}>{role}</p>
                  </div>
                ))}
              </div>
            </div>
          ); })()}

          {(() => { const r = useReveal(100); return (
            <div ref={r} className="glass-card rounded-3xl p-10 relative overflow-hidden" style={{ border: '1px solid #e8e8ec' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#0d0d12' }} />
              <div className="rounded-2xl flex items-center justify-center mb-7"
                style={{ width: 64, height: 64, background: '#f4f4f8', border: '1px solid #e0e0e8' }}>
                <Globe size={26} color="#0d0d12" />
              </div>
              <h3 className="font-bold text-2xl mb-5" style={{ color: '#0d0d12' }}>Our Vision</h3>
              <p className="text-sm leading-8 mb-8" style={{ color: '#6b7280' }}>
                Our mission is to build an AI ecosystem that enables businesses across Mauritius
                to operate more efficiently, serve customers better, and unlock new growth
                opportunities through intelligent technology.
              </p>
              <Link to="/contact"
                className="btn-primary inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-bold no-underline">
                Book a Consultation <ArrowRight size={15} />
              </Link>
            </div>
          ); })()}
        </div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section className="relative z-10" style={{ background: '#fafafa', padding: '100px 64px' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="What We Build" title="Our AI Services"
            desc="End-to-end AI solutions designed for Mauritian businesses — from chatbots to voice interfaces to full workflow automation." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => <ServiceCard key={s.title} {...s} i={i} />)}
          </div>
          <div className="text-center mt-12">
            {(() => { const r = useReveal(); return (
              <div ref={r}>
                <Link to="/services" className="btn-outline inline-flex items-center gap-2 rounded-lg px-9 py-4 text-sm no-underline font-bold">
                  View All Services <ArrowRight size={15} />
                </Link>
              </div>
            ); })()}
          </div>
        </div>
      </section>

      {/* ═══ WHY MAU AI ═══ */}
      <section className="relative z-10" style={{ background: '#f2f3f5', padding: '100px 64px' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="Why Choose Us" title="Why MAU AI?" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((w, i) => <WhyCard key={w.title} {...w} i={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ INDUSTRIES ═══ */}
      <section className="relative z-10" style={{ background: '#fafafa', padding: '100px 64px' }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader tag="Industries We Serve" title="Built for Every Sector"
            desc="Any business with a website and customer inquiries can benefit from intelligent, automated support." />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {INDUSTRIES.map(({ Icon, label }, i) => {
              const r = useReveal(i * 40);
              return (
                <div key={label} ref={r} className="glass-card hover-glow rounded-2xl flex flex-col items-center justify-center gap-3 py-7 px-3 text-center cursor-default" style={{ border: '1px solid #e8e8ec' }}>
                  <div className="rounded-xl flex items-center justify-center"
                    style={{ width: 44, height: 44, background: '#f4f4f8', border: '1px solid #e0e0e8' }}>
                    <Icon size={18} color="#0d0d12" />
                  </div>
                  <p className="text-xs font-semibold leading-snug" style={{ color: '#555' }}>{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative z-10 text-center overflow-hidden" style={{ background: '#0d0d12', padding: '110px 64px' }}>
        {(() => { const r = useReveal(); return (
          <div ref={r} className="relative max-w-2xl mx-auto">
            <h2 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.6rem)', letterSpacing: '-1.5px', lineHeight: 1.08, color: 'white' }}>
              Ready to Transform Your Business?
            </h2>
            <p className="mt-5 text-sm leading-8" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 460, margin: '20px auto 0' }}>
              Schedule a consultation with MAU AI and discover how intelligent automation can elevate your operations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-10">
              <Link to="/contact"
                className="inline-flex items-center gap-2 rounded-lg px-10 py-4 font-bold text-sm no-underline transition-all"
                style={{ background: 'white', color: '#0d0d12', letterSpacing: '0.5px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0f0f4'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                Contact MAU AI <ArrowRight size={16} />
              </Link>
              <Link to="/services"
                className="inline-flex items-center gap-2 rounded-lg px-10 py-4 font-semibold text-sm no-underline transition-all"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
                Learn More <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        ); })()}
      </section>
    </>
  );
}
