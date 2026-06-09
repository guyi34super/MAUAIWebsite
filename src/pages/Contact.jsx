import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, CheckCircle, Send, ArrowRight } from 'lucide-react';
import emailjs from '@emailjs/browser';

/*
  EmailJS Setup (one-time):
  1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
  2. Add Gmail service → connect team.mau.ai@gmail.com
  3. Create an Email Template with these variables:
       {{from_name}}, {{from_email}}, {{company}}, {{service}}, {{message}}
  4. Replace the three placeholders below with your actual IDs:
*/
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

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
  'AI Customer Service Chatbot',
  'AI Virtual Receptionist',
  'Custom AI Solutions',
  'AI Website Development',
  'AI Marketing',
  'AI Voice Interfaces',
  'Not sure yet — need advice',
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errMsg, setErrMsg] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          company:    form.company,
          service:    form.service,
          message:    form.message,
          to_email:   'team.mau.ai@gmail.com',
          reply_to:   form.email,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus('success');
    } catch (err) {
      console.error(err);
      setErrMsg('Something went wrong. Please email us directly at team.mau.ai@gmail.com');
      setStatus('error');
    }
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 10,
    padding: '14px 17px',
    color: '#fff',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.93rem',
    outline: 'none',
    width: '100%',
    transition: 'border-color .3s, box-shadow .3s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.38)',
    marginBottom: 9,
  };

  return (
    <>
      {/* Hero */}
      <section className="relative z-10 text-center overflow-hidden" style={{ padding: '160px 64px 72px', background: '#050508' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 550px 280px at 50% 40%, rgba(0,212,255,0.07) 0%, transparent 70%)' }} />
        <motion.div
          className="relative max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ background: 'rgba(0,212,255,0.09)', border: '1px solid rgba(0,212,255,0.28)', color: '#00d4ff', padding: '6px 16px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff' }} />
            Get In Touch
          </span>
          <h1 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', letterSpacing: '-1.5px', lineHeight: 1.08 }}>
            Let's Build Something<br /><span className="gradient-text">Intelligent Together</span>
          </h1>
          <div style={{ width: 54, height: 2, background: 'linear-gradient(90deg,#00d4ff,#00ff88)', margin: '18px auto' }} />
          <p className="text-base leading-8" style={{ color: 'rgba(255,255,255,0.54)' }}>
            Book a free consultation and discover how AI can transform your business operations.
          </p>
        </motion.div>
      </section>

      {/* Contact grid */}
      <section className="relative z-10" style={{ background: '#08080f', padding: '60px 64px 110px' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-14">

          {/* Left info */}
          {(() => { const r = useReveal(); return (
            <div ref={r} className="lg:col-span-2">
              <h3 className="font-bold text-xl mb-3 leading-snug">Talk to the MAU AI Team</h3>
              <p className="text-sm leading-8 mb-10" style={{ color: 'rgba(255,255,255,0.52)' }}>
                We'd love to hear about your business challenges and show you what's possible with AI.
                Fill in the form and we'll get back to you within 24 hours.
              </p>

              {/* Contact items */}
              {[
                { Icon: Mail, label: 'Email', value: 'team.mau.ai@gmail.com', href: 'mailto:team.mau.ai@gmail.com' },
                { Icon: MessageSquare, label: 'WhatsApp', value: 'Message us on WhatsApp', href: '#' },
              ].map(({ Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4 mb-7">
                  <div className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ width: 46, height: 46, background: 'rgba(0,212,255,0.09)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <Icon size={18} color="#00d4ff" />
                  </div>
                  <div>
                    <p className="font-bold text-sm mb-1">{label}</p>
                    <a href={href} className="text-sm no-underline transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {value}
                    </a>
                  </div>
                </div>
              ))}

              {/* Why us mini list */}
              <div className="glass-card rounded-2xl p-6 mt-8">
                <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#00d4ff' }}>What Happens Next</p>
                {[
                  'Free 30-min discovery call',
                  'Tailored solution proposal',
                  'Clear timeline & pricing',
                  'No obligation or pressure',
                ].map((item, i) => (
                  <div key={item} className="flex items-center gap-3 mb-3">
                    <CheckCircle size={15} color="#00ff88" />
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ); })()}

          {/* Right form */}
          {(() => { const r = useReveal(); return (
            <div ref={r} className="lg:col-span-3 glass-card rounded-3xl p-10 relative overflow-hidden">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#00d4ff,#00ff88)' }} />

              {status === 'success' ? (
                <motion.div
                  className="flex flex-col items-center justify-center text-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                >
                  <div className="flex items-center justify-center rounded-full mb-7"
                    style={{ width: 84, height: 84, background: 'rgba(0,255,136,0.1)', border: '2px solid #00ff88' }}>
                    <CheckCircle size={38} color="#00ff88" />
                  </div>
                  <h3 className="font-bold text-2xl mb-3">Message Sent!</h3>
                  <p className="text-sm leading-8" style={{ color: 'rgba(255,255,255,0.54)', maxWidth: 320 }}>
                    Thanks for reaching out. The MAU AI team will get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-bold text-xl mb-7">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} noValidate>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label style={labelStyle}>Full Name *</label>
                        <input required placeholder="Your name" value={form.name} onChange={set('name')}
                          className="form-input" style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = '#00d4ff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; }}
                          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Email Address *</label>
                        <input required type="email" placeholder="you@company.com" value={form.email} onChange={set('email')}
                          className="form-input" style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = '#00d4ff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; }}
                          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    <div className="mb-5">
                      <label style={labelStyle}>Company / Business Name</label>
                      <input placeholder="Your company" value={form.company} onChange={set('company')}
                        className="form-input" style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#00d4ff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>

                    <div className="mb-5">
                      <label style={labelStyle}>Service Interested In *</label>
                      <select required value={form.service} onChange={set('service')}
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        onFocus={e => { e.target.style.borderColor = '#00d4ff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                      >
                        <option value="" disabled style={{ color: 'rgba(255,255,255,0.3)' }}>Select a service...</option>
                        {SERVICES.map(s => <option key={s} value={s} style={{ background: '#0a0a15' }}>{s}</option>)}
                      </select>
                    </div>

                    <div className="mb-7">
                      <label style={labelStyle}>Message *</label>
                      <textarea required rows={4} placeholder="Tell us about your business and what you're looking to achieve..."
                        value={form.message} onChange={set('message')}
                        style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                        onFocus={e => { e.target.style.borderColor = '#00d4ff'; e.target.style.boxShadow = '0 0 0 3px rgba(0,212,255,0.1)'; }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>

                    {status === 'error' && (
                      <p className="text-sm mb-5 rounded-lg p-4"
                        style={{ color: '#ff6b6b', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.2)' }}>
                        {errMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full btn-gradient rounded-xl py-4 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ letterSpacing: '1.5px' }}
                    >
                      {status === 'loading' ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ width: 16, height: 16, border: '2px solid rgba(5,5,8,0.4)', borderTopColor: 'rgba(5,5,8,0.9)', borderRadius: '50%', display: 'inline-block' }}
                          />
                          Sending...
                        </>
                      ) : (
                        <> Send Message <Send size={16} /> </>
                      )}
                    </button>

                    <p className="text-xs text-center mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Sends directly to team.mau.ai@gmail.com · We reply within 24 hours
                    </p>
                  </form>
                </>
              )}
            </div>
          ); })()}
        </div>
      </section>
    </>
  );
}
