import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, CheckCircle, Send } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import PageHero from '../components/marketing/PageHero';

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'team.mau.ai@gmail.com';

const SERVICES = [
  'AI Customer Service Chatbot',
  'AI Virtual Receptionist',
  'Custom AI Solutions',
  'AI Website Development',
  'AI Marketing',
  'AI Voice Interfaces',
  'Not sure yet — need advice',
];

const FIELD_LIMITS = { name: 100, company: 100, message: 2000 };

function sanitizeFormValue(value, maxLength) {
  return String(value)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .slice(0, maxLength)
    .trim();
}

function validateForm(form) {
  const name = sanitizeFormValue(form.name, FIELD_LIMITS.name);
  const company = sanitizeFormValue(form.company, FIELD_LIMITS.company);
  const message = sanitizeFormValue(form.message, FIELD_LIMITS.message);
  if (!name || !form.service || !message) return null;
  if (!SERVICES.includes(form.service)) return null;
  return { name, company, service: form.service, message };
}

function buildEmailContent(form) {
  const subject = `MO Intelligence inquiry — ${form.service}`;
  const body = [
    `Name: ${form.name}`,
    `Company: ${form.company || 'Not provided'}`,
    `Service: ${form.service}`,
    '',
    'Message:',
    form.message,
  ].join('\n');
  return { to: CONTACT_EMAIL, subject, body };
}

function buildProviderUrl(providerId, form) {
  const { to, subject, body } = buildEmailContent(form);
  const encodedTo = encodeURIComponent(to);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  switch (providerId) {
    case 'gmail':
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    case 'outlook':
      return `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
    case 'yahoo':
      return `https://compose.mail.yahoo.com/?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
    case 'default':
      return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    default:
      return null;
  }
}

const EMAIL_PROVIDERS = [
  { id: 'gmail', label: 'Gmail', description: 'Open in Gmail' },
  { id: 'outlook', label: 'Outlook', description: 'Open in Outlook' },
  { id: 'yahoo', label: 'Yahoo Mail', description: 'Open in Yahoo Mail' },
  { id: 'default', label: 'Default App', description: 'Use your device email app' },
];

export default function Contact() {
  useSEO({
    title: 'Contact MO Intelligence — Book a Free AI Consultation in Mauritius',
    description: 'Get in touch with MO Intelligence — Mauritius\'s leading AI solutions company. Book a free consultation to discover how AI can transform your business in Mauritius or Africa.',
    keywords: 'contact MO Intelligence, AI consultation Mauritius, book AI demo Africa, AI solutions Mauritius contact, free AI consultation',
    url: 'https://moi-ai.dev/contact',
  });

  const [form, setForm] = useState({ name: '', company: '', service: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [pendingForm, setPendingForm] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validated = validateForm(form);
    if (!validated) return;
    setPendingForm(validated);
    setStatus('choose-provider');
  };

  const handleProviderSelect = (providerId) => {
    if (!pendingForm) return;
    const url = buildProviderUrl(providerId, pendingForm);
    if (!url) return;
    setSelectedProvider(EMAIL_PROVIDERS.find((p) => p.id === providerId)?.label || 'your email app');
    if (providerId === 'default') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setStatus('success');
    setForm({ name: '', company: '', service: '', message: '' });
    setPendingForm(null);
  };

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Let's Build Something Intelligent Together"
        subtitle="Book a free consultation and discover how AI can transform your business operations."
      />

      <div className="site-contact-grid">
        <div className="site-info-card">
          <h3>Talk to the MO Intelligence Team</h3>
          <p>
            We'd love to hear about your business challenges and show you what's possible with AI.
            Fill in the form and we'll get back to you within 24 hours.
          </p>

          <div className="site-info-item">
            <div className="site-info-item__icon"><Mail size={18} /></div>
            <div>
              <p className="site-form-label" style={{ marginBottom: 4 }}>Email</p>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </div>
          </div>

          <div className="site-info-item">
            <div className="site-info-item__icon"><MessageSquare size={18} /></div>
            <div>
              <p className="site-form-label" style={{ marginBottom: 4 }}>WhatsApp</p>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-body)' }}>Message us on WhatsApp</span>
            </div>
          </div>

          <p className="site-form-label" style={{ marginTop: 24 }}>What happens next</p>
          <ul className="site-checklist">
            <li>Free 30-min discovery call</li>
            <li>Tailored solution proposal</li>
            <li>Clear timeline & pricing</li>
            <li>No obligation or pressure</li>
          </ul>
        </div>

        <div className="site-form-card">
          {status === 'success' ? (
            <motion.div className="site-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="site-success__icon"><CheckCircle size={32} /></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>Email Ready!</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', lineHeight: 1.65 }}>
                {selectedProvider} should have opened with a draft message to {CONTACT_EMAIL}.
                Please review the message and click Send to deliver your inquiry.
              </p>
            </motion.div>
          ) : status === 'choose-provider' ? (
            <>
              <h3>Choose Your Email</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', marginBottom: 20 }}>
                Select where you want to compose and send your message to {CONTACT_EMAIL}.
              </p>
              <div className="site-provider-grid">
                {EMAIL_PROVIDERS.map(({ id, label, description }) => (
                  <button key={id} type="button" className="site-provider-btn" onClick={() => handleProviderSelect(id)}>
                    <span className="site-provider-btn__label">{label}</span>
                    <span className="site-provider-btn__desc">{description}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="site-btn site-btn--outline" onClick={() => setStatus('idle')}>
                Back to form
              </button>
            </>
          ) : (
            <>
              <h3>Send Us a Message</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="site-form-group">
                  <label className="site-form-label">Full Name *</label>
                  <input required className="site-form-input" placeholder="Your name" value={form.name} onChange={set('name')} />
                </div>
                <div className="site-form-group">
                  <label className="site-form-label">Company / Business Name</label>
                  <input className="site-form-input" placeholder="Your company" value={form.company} onChange={set('company')} />
                </div>
                <div className="site-form-group">
                  <label className="site-form-label">Service Interested In *</label>
                  <select required className="site-form-input" value={form.service} onChange={set('service')}>
                    <option value="" disabled>Select a service...</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="site-form-group">
                  <label className="site-form-label">Message *</label>
                  <textarea required rows={4} className="site-form-input site-form-input--textarea"
                    placeholder="Tell us about your business and what you're looking to achieve..."
                    value={form.message} onChange={set('message')}
                  />
                </div>
                <button type="submit" className="site-btn site-btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Send Message <Send size={16} />
                </button>
                <p className="site-form-hint">Next, choose Gmail, Outlook, Yahoo Mail, or your default email app</p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
