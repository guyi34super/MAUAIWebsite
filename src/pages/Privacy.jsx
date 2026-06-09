import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Cookies & Tracking',
    body: 'MAU AI does not use tracking, analytics, or advertising cookies. We do not collect personal data through cookies on this website.',
  },
  {
    title: 'Local Storage',
    body: 'If you dismiss the cookie notice, we store a single preference in your browser\'s local storage (key: mauai-cookie-notice-dismissed) so the banner does not reappear. This data never leaves your device.',
  },
  {
    title: 'Third-Party Services',
    body: 'We load fonts from Google Fonts (fonts.googleapis.com and fonts.gstatic.com). When you visit our site, your browser may make requests to Google\'s servers. Refer to Google\'s privacy policy for details on how they handle those requests.',
  },
  {
    title: 'Contact Form',
    body: 'The contact form on /contact opens your email app with a pre-filled message via a mailto: link. No form data is sent to our servers or stored by this website. You review and send the email from your own mail client.',
  },
  {
    title: 'Questions',
    body: 'For privacy-related questions, contact us at team.mau.ai@gmail.com.',
  },
];

export default function Privacy() {
  return (
    <>
      <section className="relative z-10 text-center overflow-hidden" style={{ padding: '160px 64px 72px', background: '#fafafa' }}>
        <motion.div
          className="relative max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="tag-pill inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-5">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0d0d12', display: 'inline-block' }} />
            Privacy
          </span>
          <h1 className="font-extrabold tracking-tight" style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', letterSpacing: '-1.5px', lineHeight: 1.08, color: '#0d0d12' }}>
            Privacy Policy
          </h1>
          <div className="section-line" style={{ margin: '18px auto' }} />
          <p className="text-base leading-8" style={{ color: '#6b7280' }}>
            How MAU AI handles your data when you visit our website.
          </p>
        </motion.div>
      </section>

      <section className="relative z-10" style={{ background: '#f2f3f5', padding: '60px 64px 110px' }}>
        <div className="max-w-3xl mx-auto">
          {sections.map(({ title, body }) => (
            <div key={title} className="glass-card rounded-2xl p-8 mb-5" style={{ border: '1px solid #e8e8ec' }}>
              <h2 className="font-bold text-lg mb-3" style={{ color: '#0d0d12' }}>{title}</h2>
              <p className="text-sm leading-8" style={{ color: '#6b7280' }}>{body}</p>
            </div>
          ))}
          <p className="text-xs text-center mt-8" style={{ color: '#9ca3af' }}>
            Last updated: June 2026
          </p>
        </div>
      </section>
    </>
  );
}
