import useSEO from '../hooks/useSEO';
import PageHero from '../components/marketing/PageHero';

const sections = [
  {
    title: 'Cookies & Tracking',
    body: 'MO Intelligence does not use tracking, analytics, or advertising cookies. We do not collect personal data through cookies on this website.',
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
  useSEO({
    title: 'Privacy Policy — MO Intelligence',
    description: 'How MO Intelligence handles your data when you visit our website.',
    url: 'https://moi-ai.dev/privacy',
  });

  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        subtitle="How MO Intelligence handles your data when you visit our website."
      />

      <article className="site-prose docs-prose">
        {sections.map(({ title, body }) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
        <p className="site-prose__meta">Last updated: June 2026</p>
      </article>
    </>
  );
}
