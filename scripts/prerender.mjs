/**
 * Build-time prerendering for MAU AI.
 *
 * The site is a client-rendered React SPA, which means the HTML shipped to
 * crawlers contains only an empty <div id="root">. Search engines that render
 * JavaScript can eventually see the content, but most AI search crawlers
 * (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, etc.) do NOT execute
 * JavaScript and would otherwise index a blank page.
 *
 * This script runs after `vite build`. It takes the built dist/index.html as a
 * template and, for every route, writes a static HTML file whose <head> carries
 * the correct per-page title/description/canonical and whose <div id="root">
 * contains real, human-readable content with internal links.
 *
 * When the React app boots in a real browser, createRoot().render() replaces
 * the contents of #root, so users get the full interactive experience while
 * crawlers get fully indexable HTML. Everyone receives identical HTML, so this
 * is progressive enhancement, not cloaking.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE = 'https://mauai.co';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── shared chrome ───────────────────────────────────────────────── */
const header = `
  <header>
    <a href="/" rel="home"><strong>MAU AI</strong> — Intelligence That Works</a>
    <nav aria-label="Primary">
      <a href="/">Home</a>
      <a href="/services">AI Services</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>`;

const footer = `
  <footer>
    <p><strong>MAU AI</strong> — Mauritius's leading AI solutions company, serving
    businesses across Mauritius, the Indian Ocean and Africa.</p>
    <p>Email: <a href="mailto:team.mau.ai@gmail.com">team.mau.ai@gmail.com</a> ·
    <a href="https://mauai.co">https://mauai.co</a></p>
    <p>AI Chatbots · AI Virtual Receptionists · Custom AI Automation ·
    AI Website Development · AI Marketing · AI Voice Interfaces</p>
  </footer>`;

const services = [
  ['AI Customer Service Chatbot', 'A conversational AI agent trained on your business, products, services, FAQs and policies. Deployable across websites, WhatsApp and email, available 24/7 with zero wait time and seamless handoff to human agents.'],
  ['AI Virtual Receptionist', 'A multilingual AI receptionist (English, French and Mauritian Creole) that answers questions, qualifies leads, books appointments, captures customer information and escalates high-value opportunities.'],
  ['Custom AI Solutions', 'Purpose-built AI systems for your operations: workflow automation, document processing, internal knowledge bases, API integrations and AI-powered dashboards.'],
  ['AI Website Development', 'Modern, high-performance websites enhanced with AI for lead generation, customer engagement, personalised content and intelligent automation.'],
  ['AI Marketing', 'AI-powered marketing for lead generation, content creation, audience segmentation, automated campaign management and ROI optimisation.'],
  ['AI Voice Interfaces', 'Voice-enabled AI assistants for phone and IVR integration, handling inquiries, bookings and customer interactions in multiple languages.'],
];

const serviceList = `<ul>${services
  .map(([t, d]) => `<li><strong>${esc(t)}.</strong> ${esc(d)}</li>`)
  .join('')}</ul>`;

/* ── per-route content ───────────────────────────────────────────── */
const home = `
  <article>
    <p>Mauritius-based AI solutions · Intelligence That Works</p>
    <h1>MAU AI — Mauritius's #1 AI Solutions Company for Mauritius &amp; Africa</h1>
    <p>MAU AI is Mauritius's leading artificial intelligence company. We design and
    build custom AI systems — AI chatbots, AI virtual receptionists, workflow
    automation, AI websites, AI marketing and AI voice interfaces — for businesses
    across Mauritius, the Indian Ocean islands and the wider African continent.</p>
    <p>
      <a href="/contact">Get started — book a free consultation</a> ·
      <a href="/services">Explore our AI services</a>
    </p>

    <h2>Our AI Services</h2>
    ${serviceList}

    <h2>Mauritius's Leading AI Company, Built for Africa</h2>
    <p>MAU AI helps businesses in Mauritius and across Africa automate operations,
    improve customer experience, increase revenue and save time through custom-built
    intelligent systems. Mauritius is Africa's technology gateway, and our
    multilingual AI (English, French and Creole) is designed for both Anglophone and
    Francophone African markets — from East Africa to Southern Africa and the Indian
    Ocean region.</p>

    <h2>Leadership Team</h2>
    <ul>
      <li>Reezvi Pydiah — Founder &amp; Managing Director</li>
      <li>Bhavish Nobeen — Director of Technology</li>
      <li>Rushal Seeruthun — Director of Engineering</li>
      <li>Taj Aundoo — Director of Operations</li>
    </ul>

    <h2>Industries We Serve</h2>
    <p>Healthcare, hospitality, real estate, professional services, education,
    e-commerce and finance across Mauritius and Africa.</p>

    <h2>Frequently Asked Questions</h2>
    <h3>What is MAU AI?</h3>
    <p>MAU AI is Mauritius's leading artificial intelligence company. We build custom
    AI chatbots, AI virtual receptionists, workflow automation, AI websites, AI
    marketing systems and AI voice interfaces for businesses across Mauritius and Africa.</p>
    <h3>Which AI company is based in Mauritius?</h3>
    <p>MAU AI is Mauritius's top AI solutions company, headquartered in Mauritius and
    serving businesses throughout Mauritius, the Indian Ocean islands and the African continent.</p>
    <h3>Does MAU AI serve businesses in Africa?</h3>
    <p>Yes. Based in Mauritius — Africa's technology and business gateway — MAU AI
    serves businesses across Africa with multilingual AI in English, French and Creole.</p>
    <h3>How do I get started with AI for my business?</h3>
    <p>Book a free discovery call with MAU AI at <a href="/contact">mauai.co/contact</a>.
    We assess your needs, design a tailored AI solution, build and integrate it, then
    launch and optimise for results.</p>
  </article>`;

const servicesPage = `
  <article>
    <p>What we build</p>
    <h1>AI Services in Mauritius &amp; Africa</h1>
    <p>End-to-end AI solutions custom-built for businesses in Mauritius and across
    Africa. Each MAU AI service is designed to create measurable, lasting results.</p>

    <h2>Our Six AI Service Categories</h2>
    ${serviceList}

    <h2>How We Work</h2>
    <ol>
      <li><strong>Discovery Call.</strong> We learn about your business, goals, pain points and the opportunities AI can unlock.</li>
      <li><strong>Solution Design.</strong> We design a tailored AI solution that fits your workflows, systems and customers.</li>
      <li><strong>Build &amp; Integrate.</strong> Our team builds and integrates the AI system into your existing tools and platforms.</li>
      <li><strong>Launch &amp; Optimise.</strong> We launch, monitor and continuously optimise for performance and business outcomes.</li>
    </ol>

    <p><a href="/contact">Book a free consultation</a> to find out which AI solutions
    will make the biggest impact on your business in Mauritius or Africa.</p>
  </article>`;

const contactPage = `
  <article>
    <p>Get in touch</p>
    <h1>Contact MAU AI — Book a Free AI Consultation</h1>
    <p>Ready to bring AI to your business in Mauritius or Africa? Book a free
    discovery call with MAU AI. We'll assess your needs and design a custom AI
    solution — AI chatbot, AI receptionist, automation, AI website, AI marketing or
    AI voice — tailored to your business.</p>
    <p>Email: <a href="mailto:team.mau.ai@gmail.com">team.mau.ai@gmail.com</a></p>
    <p>MAU AI serves businesses across Mauritius, the Indian Ocean and Africa, with
    AI support in English, French and Mauritian Creole.</p>
    <p><a href="/services">View all AI services</a> · <a href="/">Back to home</a></p>
  </article>`;

const privacyPage = `
  <article>
    <h1>Privacy Policy — MAU AI</h1>
    <p>This page describes how MAU AI handles information. For questions, contact
    <a href="mailto:team.mau.ai@gmail.com">team.mau.ai@gmail.com</a>.</p>
    <p><a href="/">Back to home</a></p>
  </article>`;

/* ── routes ──────────────────────────────────────────────────────── */
const routes = [
  {
    out: 'index.html',
    path: '/',
    title: 'MAU AI — #1 AI Solutions Company in Mauritius & Africa',
    description:
      "MAU AI is Mauritius's leading AI solutions company. We build AI chatbots, AI receptionists, custom AI automation, AI websites and AI voice systems for businesses across Mauritius and Africa. Book a free consultation today.",
    body: home,
  },
  {
    out: 'services/index.html',
    path: '/services',
    title: 'AI Services in Mauritius & Africa — MAU AI',
    description:
      "Explore MAU AI's full range of AI services: AI chatbots, AI virtual receptionists, custom AI automation, AI website development, AI marketing and AI voice interfaces for businesses in Mauritius and Africa.",
    body: servicesPage,
  },
  {
    out: 'contact/index.html',
    path: '/contact',
    title: 'Contact MAU AI — Book a Free AI Consultation in Mauritius',
    description:
      "Contact MAU AI to book a free AI consultation. Mauritius's leading AI company builds AI chatbots, receptionists, automation, websites and voice AI for businesses in Mauritius and Africa.",
    body: contactPage,
  },
  {
    out: 'privacy/index.html',
    path: '/privacy',
    title: 'Privacy Policy — MAU AI',
    description: 'Privacy policy for MAU AI, Mauritius AI solutions company.',
    body: privacyPage,
  },
];

/* ── render ──────────────────────────────────────────────────────── */
const template = readFileSync(join(DIST, 'index.html'), 'utf8');

function replaceMeta(html, attr, value) {
  const re = new RegExp(`(<meta\\s+${attr}\\s+content=")[^"]*(")`, 'i');
  return re.test(html) ? html.replace(re, `$1${value}$2`) : html;
}

for (const route of routes) {
  const url = route.path === '/' ? `${SITE}/` : `${SITE}${route.path}`;
  const t = esc(route.title);
  const d = esc(route.description);

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  html = replaceMeta(html, 'name="description"', d);
  html = replaceMeta(html, 'property="og:title"', t);
  html = replaceMeta(html, 'property="og:description"', d);
  html = replaceMeta(html, 'property="og:url"', url);
  html = replaceMeta(html, 'name="twitter:title"', t);
  html = replaceMeta(html, 'name="twitter:description"', d);
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${url}" />`
  );

  // Inject crawlable content into the (otherwise empty) React root.
  const content = `${header}${route.body}${footer}`;
  html = html.replace(
    /<div id="root">\s*<\/div>/i,
    `<div id="root">${content}</div>`
  );

  const outPath = join(DIST, route.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`prerendered ${route.path} -> dist/${route.out}`);
}
