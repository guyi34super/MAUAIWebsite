import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, CheckCircle, Send } from 'lucide-react';

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'team.mau.ai@gmail.com';
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`;

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
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || 'Not provided',
          service: form.service,
          message: form.message,
          _subject: `MAU AI inquiry — ${form.service}`,
          _template: 'table',
          _replyto: form.email,
        }),
      });

      const data = await response.json();
      if (!response.ok || data.success !== 'true') {
        throw new Error(data.message || 'Failed to send message');
      }

      setStatus('success');
      setForm({ name: '', email: '', company: '', service: '', message: '' });
    } catch (err) {
      console.error(err);
      setErrMsg(
        err.message === 'Failed to fetch'
          ? 'Network error. Check your connection or email us at team.mau.ai@gmail.com'
          : 'Something went wrong. Please email us directly at team.mau.ai@gmail.com',
      );
      setStatus('error');
    }
  };

  const inputStyle = {
    background: '#fff',
    border: '1px solid #e0e0e8',
    borderRadius: 10,
    padding: '14px 17px',
    color: '#0d0d12',
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
    color: '#6b7280',
    marginBottom: 9,
  };

  const leftRef = useReveal();
  const rightRef = useReveal();

  return (
    <>
      {/* Hero */}
      <section className="relative z-10 text-center overflow-hidden" style={{ padding: '160px 64px 72px', background: '#fafafa' }}>
        <motion.div
          className="relative max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="tag-pill inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-5">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d0d12', display: 'inline-block' }} />
            Get In Touch
          </span>
          <h1 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', letterSpacing: '-1.5px', lineHeight: 1.08, color: '#0d0d12' }}>
            Let's Build Something<br />Intelligent Together
          </h1>
          <div className="section-line" style={{ margin: '18px auto' }} />
          <p className="text-base leading-8" style={{ color: '#6b7280' }}>
            Book a free consultation and discover how AI can transform your business operations.
          </p>
        </motion.div>
      </section>

      {/* Contact grid */}
      <section className="relative z-10" style={{ background: '#f2f3f5', padding: '60px 64px 110px' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-14">

          {/* Left info */}
          <div ref={leftRef} className="lg:col-span-2">
            <h3 className="font-bold text-xl mb-3 leading-snug" style={{ color: '#0d0d12' }}>Talk to the MAU AI Team</h3>
            <p className="text-sm leading-8 mb-10" style={{ color: '#6b7280' }}>
              We'd love to hear about your business challenges and show you what's possible with AI.
              Fill in the form and we'll get back to you within 24 hours.
            </p>

            {[
              { Icon: Mail, label: 'Email', value: 'team.mau.ai@gmail.com', href: 'mailto:team.mau.ai@gmail.com' },
              { Icon: MessageSquare, label: 'WhatsApp', value: 'Message us on WhatsApp', href: '#' },
            ].map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 mb-7">
                <div className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: 46, height: 46, background: '#f0f0f4', border: '1px solid #e0e0e8' }}>
                  <Icon size={18} color="#0d0d12" />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1" style={{ color: '#0d0d12' }}>{label}</p>
                  <a href={href} className="text-sm no-underline transition-colors" style={{ color: '#6b7280' }}
                    onMouseEnter={e => e.target.style.color = '#0d0d12'}
                    onMouseLeave={e => e.target.style.color = '#6b7280'}>
                    {value}
                  </a>
                </div>
              </div>
            ))}

            <div className="glass-card rounded-2xl p-6 mt-8">
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#0d0d12' }}>What Happens Next</p>
              {[
                'Free 30-min discovery call',
                'Tailored solution proposal',
                'Clear timeline & pricing',
                'No obligation or pressure',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 mb-3">
                  <CheckCircle size={15} color="#0d0d12" />
                  <span className="text-sm" style={{ color: '#4b5563' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div ref={rightRef} className="lg:col-span-3 glass-card rounded-3xl p-10 relative overflow-hidden">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: '#0d0d12' }} />

            {status === 'success' ? (
              <motion.div
                className="flex flex-col items-center justify-center text-center py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                <div className="flex items-center justify-center rounded-full mb-7"
                  style={{ width: 84, height: 84, background: '#f0f0f4', border: '2px solid #0d0d12' }}>
                  <CheckCircle size={38} color="#0d0d12" />
                </div>
                <h3 className="font-bold text-2xl mb-3" style={{ color: '#0d0d12' }}>Message Sent!</h3>
                <p className="text-sm leading-8" style={{ color: '#6b7280', maxWidth: 320 }}>
                  Thanks for reaching out. The MAU AI team will get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <>
                <h3 className="font-bold text-xl mb-7" style={{ color: '#0d0d12' }}>Send Us a Message</h3>
                <form onSubmit={handleSubmit} noValidate>
                  <input type="text" name="_honey" value="" readOnly tabIndex={-1} autoComplete="off"
                    style={{ display: 'none' }} aria-hidden="true" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input required placeholder="Your name" value={form.name} onChange={set('name')}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#0d0d12'; e.target.style.boxShadow = '0 0 0 3px rgba(13,13,18,0.08)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e0e0e8'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address *</label>
                      <input required type="email" placeholder="you@company.com" value={form.email} onChange={set('email')}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = '#0d0d12'; e.target.style.boxShadow = '0 0 0 3px rgba(13,13,18,0.08)'; }}
                        onBlur={e => { e.target.style.borderColor = '#e0e0e8'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label style={labelStyle}>Company / Business Name</label>
                    <input placeholder="Your company" value={form.company} onChange={set('company')}
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#0d0d12'; e.target.style.boxShadow = '0 0 0 3px rgba(13,13,18,0.08)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e0e0e8'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div className="mb-5">
                    <label style={labelStyle}>Service Interested In *</label>
                    <select required value={form.service} onChange={set('service')}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={e => { e.target.style.borderColor = '#0d0d12'; e.target.style.boxShadow = '0 0 0 3px rgba(13,13,18,0.08)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e0e0e8'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="" disabled>Select a service...</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="mb-7">
                    <label style={labelStyle}>Message *</label>
                    <textarea required rows={4} placeholder="Tell us about your business and what you're looking to achieve..."
                      value={form.message} onChange={set('message')}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                      onFocus={e => { e.target.style.borderColor = '#0d0d12'; e.target.style.boxShadow = '0 0 0 3px rgba(13,13,18,0.08)'; }}
                      onBlur={e => { e.target.style.borderColor = '#e0e0e8'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm mb-5 rounded-lg p-4"
                      style={{ color: '#dc2626', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                      {errMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full btn-primary rounded-xl py-4 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ letterSpacing: '1.5px' }}
                  >
                    {status === 'loading' ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }}
                        />
                        Sending...
                      </>
                    ) : (
                      <> Send Message <Send size={16} /> </>
                    )}
                  </button>

                  <p className="text-xs text-center mt-4" style={{ color: '#9ca3af' }}>
                    Sends directly to team.mau.ai@gmail.com · We reply within 24 hours
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
