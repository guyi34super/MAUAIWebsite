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

/* ── tiny helpers ─────────────────────────────────── */
function Tag({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full text-xs font-semibold tracking-widest uppercase"
      style={{ background: 'rgba(0,212,255,0.09)', border: '1px solid rgba(0,212,255,0.28)', color: '#00d4ff', padding: '6px 16px' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', animation: 'dot-pulse 2s ease-in-out infinite' }} />
      {children}
    </span>
  );
}

function SectionHeader({ tag, title, desc, light }) {
  return (
    <div className="text-center mb-16">
      <Tag>{tag}</Tag>
      <h2 className="mt-4 font-extrabold tracking-tight" style={{ fontSize: 'clamp(1.9rem,3.8vw,2.9rem)', letterSpacing: '-0.5px', lineHeight: 1.14 }}>
        {title}
      </h2>
      <div style={{ width: 54, height: 2, background: 'linear-gradient(90deg,#00d4ff,#00ff88)', margin: '14px auto 0' }} />
      {desc && <p className="mt-4 mx-auto text-base leading-7" style={{ color: 'rgba(255,255,255,0.56)', maxWidth: 520 }}>{desc}</p>}
    </div>
  );
}

/* ── scroll-reveal hook ───────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('reveal-up');
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ── data ─────────────────────────────────────────── */
const SERVICES = [
  { Icon: Bot,       title: 'AI Customer Service Chatbot',   desc: 'A conversational AI agent trained on your business, products, FAQs and policies. Deployable across websites, WhatsApp, and email — 24/7 with zero wait time.' },
  { Icon: UserCheck, title: 'AI Virtual Receptionist',       desc: 'Multilingual AI receptionist for answering questions, qualifying leads, booking appointments, capturing customer information, and escalating high-value opportunities.' },
  { Icon: Settings2, title: 'Custom AI Solutions',           desc: 'Purpose-built AI systems for your operations: workflow automation, document processing, knowledge bases, integrations, and internal productivity systems.' },
  { Icon: Globe,     title: 'AI Website Development',        desc: 'Modern websites enhanced with AI capabilities including lead generation, customer engagement, automation, and intelligent user experiences.' },
  { Icon: Megaphone, title: 'AI Marketing',                  desc: 'AI-powered marketing systems for lead generation, content creation, customer targeting, and campaign optimisation.' },
  { Icon: Mic2,      title: 'AI Voice Interfaces',           desc: 'Voice-enabled AI assistants capable of handling inquiries, bookings, and customer interactions with natural, human-like conversation.' },
];

const WHY = [
  { Icon: Clock,    title: '24/7 Customer Engagement',  desc: 'Round-the-clock availability ensures your business never misses a customer query or opportunity.' },
  { Icon: TrendingUp,title: 'Increased Lead Conversion', desc: 'Intelligent qualification and instant follow-up dramatically improve conversion rates.' },
  { Icon: DollarSign,title: 'Reduced Operational Costs', desc: 'AI handles repetitive tasks at a fraction of the cost of full-time staff.' },
  { Icon: Zap,       title: 'Faster Response Times',     desc: 'Customers receive answers in seconds, not hours, dramatically improving satisfaction.' },
  { Icon: Scaling,   title: 'Scalable Automation',       desc: 'Solutions grow with your business from SME to enterprise without added overhead.' },
  { Icon: Target,    title: 'Tailored Implementations',  desc: 'Custom-built for each client — SMEs and enterprises across every industry.' },
];

const INDUSTRIES = [
  { Icon: Building2,    label: 'Healthcare & Laboratories' },
  { Icon: Hotel,        label: 'Hospitality & Tourism' },
  { Icon: HomeIcon,     label: 'Real Estate' },
  { Icon: Briefcase,    label: 'Professional Services' },
  { Icon: GraduationCap,label: 'Education' },
  { Icon: ShoppingCart, label: 'Retail & E-Commerce' },
  { Icon: Landmark,     label: 'Financial Services' },
];

const STATS = [
  { num: '6+',   label: 'AI Service Categories' },
  { num: '7+',   label: 'Industries Served' },
  { num: '24/7', label: 'AI Availability' },
  { num: '100%', label: 'Tailored Solutions' },
];

/* ── components ───────────────────────────────────── */
function ServiceCard({ Icon, title, desc, delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="glass-card hover-glow rounded-2xl p-8 group" style={{ transitionDelay: `${delay}ms` }}>
      <div className="mb-5 rounded-xl flex items-center justify-center"
        style={{ width: 56, height: 56, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.16)', transition: 'all .3s' }}>
        <Icon size={24} color="#00d4ff" />
      </div>
      <div style={{ width: 36, height: 1, background: 'rgba(0,212,255,0.38)', margin: '0 0 14px' }} />
      <h3 className="font-bold mb-3 leading-snug" style={{ fontSize: '1.02rem' }}>{title}</h3>
      <p className="text-sm leading-7" style={{ color: 'rgba(255,255,255,0.54)' }}>{desc}</p>
    </div>
  );
}

function WhyCard({ Icon, title, desc, delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="glass-card rounded-2xl p-7 hover-glow" style={{ transitionDelay: `${delay}ms` }}>
      <div className="mb-4 rounded-xl flex items-center justify-center"
        style={{ width: 48, height: 48, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.16)' }}>
        <Icon size={20} color="#00ff88" />
      </div>
      <h3 className="font-bold mb-2 text-sm">{title}</h3>
      <p className="text-sm leading-7" style={{ color: 'rgba(255,255,255,0.52)' }}>{desc}</p>
    </div>
  );
}

function IndustryCard({ Icon, label }) {
  return (
    <div className="glass-card hover-glow rounded-2xl flex flex-col items-center justify-center gap-4 py-8 px-4 text-center cursor-default">
      <div className="rounded-2xl flex items-center justify-center"
        style={{ width: 52, height: 52, background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.14)' }}>
        <Icon size={22} color="#00d4ff" />
      </div>
      <p className="text-xs font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</p>
    </div>
  );
}

/* ── page ─────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef(null);

  return (
    <>
      {/* style for dot-pulse inline */}
      <style>{`@keyframes dot-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(1.5)}}`}</style>

      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        className="relative flex items-center min-h-screen"
        style={{ padding: '130px 64px 80px', overflow: 'hidden', gap: 48 }}
      >
        {/* ambient blobs */}
        <div className="absolute pointer-events-none" style={{ top: '-20%', left: '-12%', width: 640, height: 640, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,212,255,0.07) 0%,transparent 65%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-15%', right: '8%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(123,47,255,0.06) 0%,transparent 65%)' }} />

        {/* Left content */}
        <motion.div
          className="flex-1 relative z-10"
          style={{ maxWidth: 580 }}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Tag>Mauritius-Based AI Solutions</Tag>

          <h1 className="mt-7 font-extrabold leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.6rem,5.2vw,4.8rem)', letterSpacing: '-2px', lineHeight: 1.06 }}>
            Transform Your<br />
            Business With<br />
            <span className="gradient-text">Intelligent AI</span>
          </h1>

          <p className="mt-7 leading-8 text-base" style={{ color: 'rgba(255,255,255,0.58)', maxWidth: 470 }}>
            MAU AI helps Mauritian businesses automate operations, improve customer
            experience, and unlock new revenue through practical, custom-built AI systems.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link to="/contact"
              className="btn-gradient rounded-lg px-8 py-4 font-bold text-sm no-underline inline-flex items-center gap-2"
              style={{ letterSpacing: '0.5px' }}>
              Start Your AI Journey <ArrowRight size={16} />
            </Link>
            <Link to="/services"
              className="rounded-lg px-8 py-4 font-semibold text-sm no-underline inline-flex items-center gap-2 transition-all duration-300 hover:border-cyan-DEFAULT"
              style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
              Explore Services <ChevronRight size={16} />
            </Link>
          </div>

          {/* Mini trust bar */}
          <div className="flex flex-wrap gap-6 mt-12">
            {[['6+', 'AI Services'], ['7+', 'Industries'], ['24/7', 'Availability']].map(([n, l]) => (
              <div key={l} className="flex flex-col gap-1">
                <span className="font-extrabold text-2xl gradient-text leading-none">{n}</span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.44)', letterSpacing: '0.5px' }}>{l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right robot */}
        <motion.div
          className="flex-1 flex justify-center items-center relative z-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Robot />
        </motion.div>
      </section>

      {/* ═══ STATS TICKER ═══ */}
      <div className="relative z-10 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(10px)', padding: '22px 0' }}>
        <div className="ticker-track flex gap-16 whitespace-nowrap" style={{ width: 'max-content' }}>
          {[...STATS, ...STATS, ...STATS, ...STATS].map(({ num, label }, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="font-extrabold text-2xl gradient-text">{num}</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.44)' }}>{label}</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(0,212,255,0.4)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ ABOUT ═══ */}
      <section className="relative z-10" style={{ background: '#08080f', padding: '100px 64px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text */}
          {(() => { const r = useReveal(); return (
            <div ref={r}>
              <Tag>Who We Are</Tag>
              <h2 className="mt-5 font-extrabold tracking-tight leading-tight" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.7rem)', letterSpacing: '-0.5px' }}>
                Transforming Mauritian<br />Businesses Through<br />
                <span className="gradient-text">Artificial Intelligence</span>
              </h2>
              <p className="mt-6 text-sm leading-8" style={{ color: 'rgba(255,255,255,0.56)' }}>
                MAU AI is a Mauritian AI solutions company focused on helping businesses automate
                operations, improve customer experience, increase revenue, and save time through
                intelligent systems.
              </p>
              <p className="mt-4 text-sm leading-8" style={{ color: 'rgba(255,255,255,0.56)' }}>
                Our team combines expertise in software engineering, electronics, operations, and
                business strategy to deliver practical AI solutions that create measurable results.
              </p>
              <p className="mt-3 text-xs font-bold tracking-widest uppercase" style={{ color: '#00d4ff' }}>Leadership Team</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  ['Pydiah Reezvi-Mathiah', 'Founder & Managing Director'],
                  ['Bhavish', 'Director of Technology'],
                  ['Rushal', 'Director of Engineering'],
                  ['Taj', 'Director of Operations'],
                ].map(([name, role]) => (
                  <div key={name} className="glass-card rounded-xl p-4 hover-glow">
                    <p className="font-bold text-sm">{name}</p>
                    <p className="text-xs mt-1" style={{ color: '#00d4ff' }}>{role}</p>
                  </div>
                ))}
              </div>
            </div>
          ); })()}

          {/* Vision card */}
          {(() => { const r = useReveal(); return (
            <div ref={r} className="glass-card rounded-3xl p-10 relative overflow-hidden">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#00d4ff,#00ff88)' }} />
              <div className="rounded-2xl flex items-center justify-center mb-7"
                style={{ width: 68, height: 68, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Globe size={28} color="#00d4ff" />
              </div>
              <h3 className="font-bold text-2xl mb-5 leading-snug">Our Vision</h3>
              <p className="text-sm leading-8 mb-8" style={{ color: 'rgba(255,255,255,0.56)' }}>
                Our mission is to build an AI ecosystem that enables businesses across Mauritius
                to operate more efficiently, serve customers better, and unlock new growth
                opportunities through intelligent technology.
              </p>
              <Link to="/contact" className="btn-gradient inline-flex items-center gap-2 rounded-lg px-7 py-3.5 font-bold text-sm no-underline">
                Book a Consultation <ArrowRight size={15} />
              </Link>
            </div>
          ); })()}
        </div>
      </section>

      {/* ═══ SERVICES PREVIEW ═══ */}
      <section className="relative z-10" style={{ background: '#050508', padding: '100px 64px' }}>
        <div className="max-w-6xl mx-auto">
          {(() => { const r = useReveal(); return (
            <div ref={r}><SectionHeader tag="What We Build" title="Our AI Services" desc="End-to-end AI solutions designed for Mauritian businesses — from chatbots to voice interfaces to full workflow automation." /></div>
          ); })()}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => <ServiceCard key={s.title} {...s} delay={i * 60} />)}
          </div>
          <div className="text-center mt-12">
            {(() => { const r = useReveal(); return (
              <div ref={r}>
                <Link to="/services" className="btn-gradient inline-flex items-center gap-2 rounded-lg px-9 py-4 font-bold text-sm no-underline">
                  View All Services <ArrowRight size={16} />
                </Link>
              </div>
            ); })()}
          </div>
        </div>
      </section>

      {/* ═══ WHY MAU AI ═══ */}
      <section className="relative z-10" style={{ background: '#08080f', padding: '100px 64px' }}>
        <div className="max-w-6xl mx-auto">
          {(() => { const r = useReveal(); return (
            <div ref={r}><SectionHeader tag="Why Choose Us" title="Why MAU AI?" /></div>
          ); })()}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((w, i) => <WhyCard key={w.title} {...w} delay={i * 60} />)}
          </div>
        </div>
      </section>

      {/* ═══ INDUSTRIES ═══ */}
      <section className="relative z-10" style={{ background: '#050508', padding: '100px 64px' }}>
        <div className="max-w-6xl mx-auto">
          {(() => { const r = useReveal(); return (
            <div ref={r}><SectionHeader tag="Industries We Serve" title="Built for Every Sector" desc="Any business with a website and customer inquiries can benefit from intelligent, automated support." /></div>
          ); })()}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {INDUSTRIES.map(ind => <IndustryCard key={ind.label} {...ind} />)}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative z-10 text-center overflow-hidden" style={{ background: '#08080f', padding: '110px 64px' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 700px 300px at 50% 50%, rgba(0,212,255,0.07) 0%, transparent 70%)' }} />
        {(() => { const r = useReveal(); return (
          <div ref={r} className="relative max-w-3xl mx-auto">
            <h2 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.8rem)', letterSpacing: '-1.5px', lineHeight: 1.08 }}>
              Ready to Transform<br /><span className="gradient-text">Your Business?</span>
            </h2>
            <p className="mt-6 text-base leading-8 mx-auto" style={{ color: 'rgba(255,255,255,0.54)', maxWidth: 500 }}>
              Schedule a consultation with MAU AI and discover how intelligent automation
              can elevate your operations.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-10">
              <Link to="/contact" className="btn-gradient inline-flex items-center gap-2 rounded-lg px-10 py-4 font-bold text-sm no-underline">
                Contact MAU AI <ArrowRight size={16} />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-lg px-10 py-4 font-semibold text-sm no-underline transition-all hover:border-opacity-60"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                Learn More <ChevronRight size={16} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 justify-center mt-10">
              {['Automate Operations', 'Improve Customer Experience', 'Increase Revenue', 'Save Time'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <div className="flex items-center justify-center rounded-full text-xs" style={{ width: 20, height: 20, background: 'rgba(0,255,136,0.15)', color: '#00ff88' }}>✓</div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        ); })()}
      </section>
    </>
  );
}
