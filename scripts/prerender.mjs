/**
 * Build-time prerendering for MO Intelligence.
 *
 * The site is a client-rendered React SPA, which means the HTML shipped to
 * crawlers contains only an empty <div id="root">. Search engines that render
 * JavaScript can eventually see the content, but most AI search crawlers
 * (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, etc.) do NOT execute
 * JavaScript and would otherwise index a blank page.
 *
 * This script runs after `vite build`. It takes the built dist/index.html as a
 * template and, for every route, writes a static HTML file whose <head> carries
 * the correct per-page title/description/canonical and whose hidden
 * #static-seo-content sibling contains real, human-readable content with
 * internal links. #root stays empty for React to mount into.
 *
 * When the React app boots in a real browser, createRoot().render() fills
 * #root with the interactive UI. Crawlers read #static-seo-content without
 * executing JavaScript. This is progressive enhancement, not cloaking.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE = 'https://moi-ai.dev';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ── shared chrome ───────────────────────────────────────────────── */
const header = `
  <header>
    <a href="/" rel="home"><strong>MO Intelligence</strong> — Intelligence That Works</a>
    <nav aria-label="Primary">
      <a href="/">Home</a>
      <a href="/services">AI Services</a>
      <a href="/docs">Documentation</a>
      <a href="/contact">Contact</a>
    </nav>
  </header>`;

const footer = `
  <footer>
    <p><strong>MO Intelligence</strong> — Mauritius's leading AI solutions company, serving
    businesses across Mauritius, the Indian Ocean and Africa.</p>
    <p>Email: <a href="mailto:team.mau.ai@gmail.com">team.mau.ai@gmail.com</a> ·
    <a href="https://moi-ai.dev">https://moi-ai.dev</a></p>
    <p>AI Chatbots · AI Virtual Receptionists · Custom AI Automation ·
    AI Website Development · AI Marketing · AI Voice Interfaces ·
    SEO · AI SEO · Research and Development</p>
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
    <h1>MO Intelligence — Mauritius's #1 AI Solutions Company for Mauritius &amp; Africa</h1>
    <p>MO Intelligence is Mauritius's leading artificial intelligence company. We design and
    build custom AI systems — AI chatbots, AI virtual receptionists, workflow
    automation, AI websites, AI marketing, AI voice interfaces, SEO, AI SEO, and
    Research and Development — for businesses across Mauritius, the Indian Ocean
    islands and the wider African continent.</p>
    <p>
      <a href="/contact">Get started — book a free consultation</a> ·
      <a href="/services">Explore our AI services</a>
    </p>

    <h2>Our AI Services</h2>
    ${serviceList}

    <h2>SEO, AI SEO, and Research and Development</h2>
    <p><strong>SEO.</strong> Search engine optimization for Mauritius and Africa — technical SEO,
    on-page optimization, and local search visibility.</p>
    <p><strong>AI SEO.</strong> AI Engine Optimization (AIEO) for LLM and AI search visibility —
    llms.txt, structured data, and AI crawler discoverability.</p>
    <p><strong>Research and Development.</strong> AI R&amp;D — custom solution prototyping,
    emerging technology evaluation, and innovation partnerships.</p>

    <h2>Mauritius's Leading AI Company, Built for Africa</h2>
    <p>MO Intelligence helps businesses in Mauritius and across Africa automate operations,
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
    <h3>What is MO Intelligence?</h3>
    <p>MO Intelligence is Mauritius's leading artificial intelligence company. We build custom
    AI chatbots, AI virtual receptionists, workflow automation, AI websites, AI
    marketing systems, AI voice interfaces, SEO, AI SEO, and Research and Development
    for businesses across Mauritius and Africa.</p>
    <h3>Does MO Intelligence offer SEO services?</h3>
    <p>Yes. MO Intelligence provides SEO services for businesses in Mauritius and Africa,
    including technical SEO, on-page optimization, and local search visibility.</p>
    <h3>What is AI SEO?</h3>
    <p>AI SEO (AI Engine Optimization) optimizes your business for AI search engines and LLM
    crawlers. MO Intelligence offers llms.txt setup, structured data, and prerendered
    content for AI discoverability.</p>
    <h3>Which AI company is based in Mauritius?</h3>
    <p>MO Intelligence is Mauritius's top AI solutions company, headquartered in Mauritius and
    serving businesses throughout Mauritius, the Indian Ocean islands and the African continent.</p>
    <h3>Does MO Intelligence serve businesses in Africa?</h3>
    <p>Yes. Based in Mauritius — Africa's technology and business gateway — MO Intelligence
    serves businesses across Africa with multilingual AI in English, French and Creole.</p>
    <h3>How do I get started with AI for my business?</h3>
    <p>Book a free discovery call with MO Intelligence at <a href="/contact">moi-ai.dev/contact</a>.
    We assess your needs, design a tailored AI solution, build and integrate it, then
    launch and optimise for results.</p>
  </article>`;

const servicesPage = `
  <article>
    <p>What we build</p>
    <h1>AI Services in Mauritius &amp; Africa</h1>
    <p>End-to-end AI solutions custom-built for businesses in Mauritius and across
    Africa. Each MO Intelligence service is designed to create measurable, lasting results.</p>

    <h2>Our Six AI Service Categories</h2>
    ${serviceList}

    <h2>SEO, AI SEO, and Research and Development</h2>
    <p>MO Intelligence also provides <strong>SEO</strong> (search engine optimization),
    <strong>AI SEO</strong> (AI Engine Optimization for LLM and AI search visibility), and
    <strong>Research and Development</strong> (AI innovation, prototyping, and R&amp;D partnerships)
    for businesses in Mauritius and Africa.</p>

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
    <h1>Contact MO Intelligence — Book a Free AI Consultation</h1>
    <p>Ready to bring AI to your business in Mauritius or Africa? Book a free
    discovery call with MO Intelligence. We'll assess your needs and design a custom AI
    solution — AI chatbot, AI receptionist, automation, AI website, AI marketing,
    AI voice, SEO, AI SEO, or Research and Development — tailored to your business.</p>
    <p>Email: <a href="mailto:team.mau.ai@gmail.com">team.mau.ai@gmail.com</a></p>
    <p>MO Intelligence serves businesses across Mauritius, the Indian Ocean and Africa, with
    AI support in English, French and Mauritian Creole.</p>
    <p><a href="/services">View all AI services</a> · <a href="/">Back to home</a></p>
  </article>`;

const privacyPage = `
  <article>
    <h1>Privacy Policy — MO Intelligence</h1>
    <p>This page describes how MO Intelligence handles information. For questions, contact
    <a href="mailto:team.mau.ai@gmail.com">team.mau.ai@gmail.com</a>.</p>
    <p><a href="/">Back to home</a></p>
  </article>`;

const docsHubPage = `
  <article>
    <h1>Documentation — MO Intelligence</h1>
    <p>Product guides, R&amp;D documentation, and overviews for MO Intelligence solutions.</p>
    <h2>Call Center</h2>
    <p>Web-Based Contact Management Platform. A browser-based platform that gives teams
    a single, organized place to manage inbound and outbound customer conversations.</p>
    <p><a href="/docs/call-center">View Call Center documentation</a></p>
    <h2>Research &amp; Development — MOI AI</h2>
    <p>Mauritius Own LLM. MO Intelligence's from-scratch decoder-only transformer,
    currently under development at the 100M-parameter scale.</p>
    <p><a href="/docs/moi">View MOI AI documentation</a></p>
  </article>`;

const callCenterOverviewPage = `
  <article>
    <h1>Call Center Overview — MO Intelligence Docs</h1>
    <p>Call Center is a browser-based platform that gives teams a single, organized place
    to manage inbound and outbound customer conversations.</p>
    <p><a href="/docs/call-center/features">Features</a> ·
    <a href="/docs/call-center/how-it-works">How It Works</a> ·
    <a href="/docs/call-center/billing">Billing</a> ·
    <a href="/docs/call-center/get-started">Get Started</a></p>
  </article>`;

const callCenterFeaturesPage = `
  <article>
    <h1>Call Center Features — MO Intelligence Docs</h1>
    <p>Contact handling, agent workspace, live status, records, billing, and reporting.</p>
    <p><a href="/docs/call-center">Back to overview</a></p>
  </article>`;

const callCenterHowItWorksPage = `
  <article>
    <h1>How Call Center Works — MO Intelligence Docs</h1>
    <p>Sign in, receive, handle, bill, and track every customer interaction.</p>
    <p><a href="/docs/call-center">Back to overview</a></p>
  </article>`;

const callCenterBillingPage = `
  <article>
    <h1>Call Center Billing — MO Intelligence Docs</h1>
    <p>Integrated billing and invoicing with automatic capture, itemized invoices, and payment tracking.</p>
    <p><a href="/docs/call-center">Back to overview</a></p>
  </article>`;

const callCenterGetStartedPage = `
  <article>
    <h1>Get Started with Call Center — MO Intelligence Docs</h1>
    <p>Book a guided walkthrough and get a tailored quotation for your team.</p>
    <p>Email: <a href="mailto:team.mau.ai@gmail.com">team.mau.ai@gmail.com</a> ·
    <a href="/contact">Book a consultation</a></p>
  </article>`;

const moiOverviewPage = `
  <article>
    <h1>MOI AI Overview — MO Intelligence R&amp;D Docs</h1>
    <p>MOI AI is Mauritius's own large language model — a from-scratch decoder-only
    transformer built by MO Intelligence. Currently under active development at the
    100M-parameter scale (R0).</p>
    <p><a href="/docs/moi/architecture">Architecture</a> ·
    <a href="/docs/moi/training">Training</a> ·
    <a href="/docs/moi/scaling">Scaling</a> ·
    <a href="/docs/moi/roadmap">Roadmap</a></p>
  </article>`;

const moiArchitecturePage = `
  <article>
    <h1>MOI AI Architecture — MO Intelligence R&amp;D Docs</h1>
    <p>Dense decoder-only transformer with RMSNorm, RoPE, GQA attention, SwiGLU
    feed-forward, and tied embeddings. R0: 100M params, d_model=768, 12 layers.</p>
    <p><a href="/docs/moi">Back to overview</a></p>
  </article>`;

const moiTrainingPage = `
  <article>
    <h1>MOI AI Training — MO Intelligence R&amp;D Docs</h1>
    <p>Install, smoke test, train R0 on TinyStories, CPU mini verification, and supervised fine-tuning.</p>
    <p><a href="/docs/moi">Back to overview</a></p>
  </article>`;

const moiScalingPage = `
  <article>
    <h1>MOI AI Scaling — MO Intelligence R&amp;D Docs</h1>
    <p>Scaling ladder from R0 (100M) to R4 (50B). Shape rules, locked-in decisions, and training safety.</p>
    <p><a href="/docs/moi">Back to overview</a></p>
  </article>`;

const moiRoadmapPage = `
  <article>
    <h1>MOI AI Roadmap — MO Intelligence R&amp;D Docs</h1>
    <p>Development stages from R0 research on Apple Silicon through R4 production-scale deployment.</p>
    <p><a href="/docs/moi">Back to overview</a></p>
  </article>`;

/* ── routes ──────────────────────────────────────────────────────── */
const routes = [
  {
    out: 'index.html',
    path: '/',
    title: 'MO Intelligence — #1 AI Solutions Company in Mauritius & Africa',
    description:
      "MO Intelligence is Mauritius's leading AI solutions company. We build AI chatbots, AI receptionists, custom AI automation, AI websites, AI voice systems, SEO, AI SEO, and Research and Development for businesses across Mauritius and Africa. Book a free consultation today.",
    body: home,
  },
  {
    out: 'services/index.html',
    path: '/services',
    title: 'AI Services in Mauritius & Africa — MO Intelligence',
    description:
      "Explore MO Intelligence's full range of AI services: AI chatbots, AI virtual receptionists, custom AI automation, AI website development, AI marketing, AI voice interfaces, SEO, AI SEO, and Research and Development for businesses in Mauritius and Africa.",
    body: servicesPage,
  },
  {
    out: 'contact/index.html',
    path: '/contact',
    title: 'Contact MO Intelligence — Book a Free AI Consultation in Mauritius',
    description:
      "Contact MO Intelligence to book a free consultation for AI, SEO, AI SEO, or Research and Development. Mauritius's leading AI company builds chatbots, receptionists, automation, websites, and voice AI for businesses in Mauritius and Africa.",
    body: contactPage,
  },
  {
    out: 'privacy/index.html',
    path: '/privacy',
    title: 'Privacy Policy — MO Intelligence',
    description: 'Privacy policy for MO Intelligence, MO Intelligence solutions company.',
    body: privacyPage,
  },
  {
    out: 'docs/index.html',
    path: '/docs',
    title: 'Documentation — MO Intelligence',
    description: 'Product documentation for MO Intelligence solutions. Explore Call Center and MOI AI research & development.',
    body: docsHubPage,
  },
  {
    out: 'docs/call-center/index.html',
    path: '/docs/call-center',
    title: 'Call Center Overview — MO Intelligence Docs',
    description: 'Overview of Call Center, a browser-based platform for managing inbound and outbound customer conversations.',
    body: callCenterOverviewPage,
  },
  {
    out: 'docs/call-center/features/index.html',
    path: '/docs/call-center/features',
    title: 'Call Center Features — MO Intelligence Docs',
    description: 'Explore Call Center capabilities: contact handling, agent workspace, live status, records, billing, and reporting.',
    body: callCenterFeaturesPage,
  },
  {
    out: 'docs/call-center/how-it-works/index.html',
    path: '/docs/call-center/how-it-works',
    title: 'How Call Center Works — MO Intelligence Docs',
    description: 'Learn the Call Center workflow: sign in, receive, handle, bill, and track every customer interaction.',
    body: callCenterHowItWorksPage,
  },
  {
    out: 'docs/call-center/billing/index.html',
    path: '/docs/call-center/billing',
    title: 'Call Center Billing — MO Intelligence Docs',
    description: 'Integrated billing and invoicing for Call Center: automatic capture, itemized invoices, payment tracking, and exports.',
    body: callCenterBillingPage,
  },
  {
    out: 'docs/call-center/get-started/index.html',
    path: '/docs/call-center/get-started',
    title: 'Get Started with Call Center — MO Intelligence Docs',
    description: 'Book a guided walkthrough and get a tailored quotation for Call Center based on your team size.',
    body: callCenterGetStartedPage,
  },
  {
    out: 'docs/moi/index.html',
    path: '/docs/moi',
    title: 'MOI AI Overview — MO Intelligence R&D Docs',
    description: 'MOI AI is Mauritius Own LLM — a from-scratch decoder-only transformer built by MO Intelligence, currently under development at 100M parameters.',
    body: moiOverviewPage,
  },
  {
    out: 'docs/moi/architecture/index.html',
    path: '/docs/moi/architecture',
    title: 'MOI AI Architecture — MO Intelligence R&D Docs',
    description: 'MOI AI architecture: RMSNorm, RoPE, GQA, SwiGLU, tied embeddings. R0 100M config with d_model=768, 12 layers, 12/4 heads.',
    body: moiArchitecturePage,
  },
  {
    out: 'docs/moi/training/index.html',
    path: '/docs/moi/training',
    title: 'MOI AI Training — MO Intelligence R&D Docs',
    description: 'Train MOI AI R0: install, smoke test, TinyStories pretraining on Apple Silicon, CPU verification, and supervised fine-tuning.',
    body: moiTrainingPage,
  },
  {
    out: 'docs/moi/scaling/index.html',
    path: '/docs/moi/scaling',
    title: 'MOI AI Scaling — MO Intelligence R&D Docs',
    description: 'MOI AI scaling ladder from R0 (100M) to R4 (50B). Shape rules, locked-in decisions, repo layout, and training safety.',
    body: moiScalingPage,
  },
  {
    out: 'docs/moi/roadmap/index.html',
    path: '/docs/moi/roadmap',
    title: 'MOI AI Roadmap — MO Intelligence R&D Docs',
    description: 'MOI AI development roadmap from R0 research on Apple Silicon to R4 production-scale deployment.',
    body: moiRoadmapPage,
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

  // Inject crawlable content into a hidden sibling so #root stays empty for React.
  const content = `${header}${route.body}${footer}`;
  html = html.replace(
    /<div id="root">\s*<\/div>/i,
    `<div id="root"></div>\n<div id="static-seo-content" hidden>${content}</div>`
  );

  const outPath = join(DIST, route.out);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
  console.log(`prerendered ${route.path} -> dist/${route.out}`);
}
