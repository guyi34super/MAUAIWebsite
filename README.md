# MO Intelligence Website

Marketing site and product documentation for [MO Intelligence](https://moi-ai.dev) — Mauritius's AI solutions company.

**Live site:** [moi-ai.dev](https://moi-ai.dev)  
**Contact:** [team.mau.ai@gmail.com](mailto:team.mau.ai@gmail.com)  
**Stack:** React 18 · Vite 5 · Tailwind CSS · Framer Motion · React Router · Three.js

## Features

### Marketing site
- `/` — home page with interactive 3D robot mascot (lazy-loaded via Three.js)
- `/services` — six AI service categories with detailed feature lists
- `/contact` — inquiry form that opens a pre-filled draft in the visitor's email app
- `/privacy` — privacy policy and cookie notice (no tracking cookies)

### Product docs
- `/docs` — documentation hub
- `/docs/call-center` — Call Center overview
- `/docs/call-center/features` — contact handling, agent workspace, reporting
- `/docs/call-center/how-it-works` — end-to-end workflow
- `/docs/call-center/billing` — integrated billing and invoicing
- `/docs/call-center/get-started` — onboarding and consultation

### Platform
- **Unified shell** — shared header, footer, and layout across marketing and docs
- **SEO** — per-page meta tags (`useSEO`), JSON-LD in `index.html`, geo tags, Open Graph, `sitemap.xml`, `robots.txt`, and `llms.txt`
- **AI discoverability** — `llms.txt` and `robots.txt` explicitly allow major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, and others)
- **Prerendering** — `scripts/prerender.mjs` writes static HTML for every route at build time so search engines and AI crawlers index real content
- **Security** — CSP, HSTS, X-Frame-Options, and other headers in `vercel.json`
- **Branding** — MO Intelligence logo, favicon, PWA manifest, and OG image

## AI services

MO Intelligence offers six core service categories, all detailed on `/services`:

| Service | Summary |
| --- | --- |
| AI Customer Service Chatbot | 24/7 conversational AI across web, WhatsApp, and email |
| AI Virtual Receptionist | Multilingual receptionist for leads, bookings, and escalations |
| Custom AI Solutions | Workflow automation, document processing, and integrations |
| AI Website Development | High-performance sites with built-in AI engagement |
| AI Marketing | Content, segmentation, campaigns, and ROI optimisation |
| AI Voice Interfaces | Phone and IVR voice assistants in multiple languages |

**Additional capability areas** (indexed in SEO metadata, structured data, and `llms.txt` — not shown as service cards on `/services`):

| Capability | Summary |
| --- | --- |
| SEO | Search engine optimization — technical SEO, on-page optimization, local search visibility |
| AI SEO | AI Engine Optimization (AIEO) — LLM and AI search crawler discoverability |
| Research and Development | AI R&D — solution prototyping, emerging tech evaluation, innovation partnerships |

## SEO and AI discoverability

The site is optimized for both traditional search engines and AI crawlers:

- **SEO** keywords and meta descriptions across `index.html`, per-page `useSEO`, and prerendered HTML
- **AI SEO** via `llms.txt`, build-time prerendering, JSON-LD structured data, and explicit AI crawler permissions in `robots.txt`
- **Research and Development** referenced in schema.org `hasOfferCatalog`, FAQs, and `llms.txt`
- Submit `https://moi-ai.dev/sitemap.xml` in Google Search Console (property must match `moi-ai.dev`, not `mau-ai.com`)
 healthcare, hospitality, real estate, professional services, education, e-commerce, and finance — across Mauritius, the Indian Ocean, and Africa.

## Call Center product

Call Center is MO Intelligence's browser-based contact management platform. Docs live under `/docs/call-center` and cover:

- Unified inbox for inbound and outbound conversations
- Agent workspace with live status and customer records
- Integrated billing, invoicing, and payment tracking
- Reporting and team onboarding

Content is driven by [`src/content/docs/callCenter.js`](src/content/docs/callCenter.js).

## Requirements

- Node.js 18+ (recommended: 20 LTS)
- npm 9+

## Getting started

```bash
npm install
npm run dev
```

| Environment | URL |
| --- | --- |
| Dev server | [http://localhost:5173](http://localhost:5173) |
| Preview server | [http://localhost:4173](http://localhost:4173) |

Build and preview:

```bash
npm run build    # Vite build + prerender all routes into dist/
npm run preview  # Serve the production build locally
```

## Editing content

Most site copy is centralised so pages stay consistent:

| File | What it controls |
| --- | --- |
| [`src/config/brand.js`](src/config/brand.js) | Site name, URL, email, default SEO title/description |
| [`src/content/marketing.js`](src/content/marketing.js) | Services, team, FAQs, industries, Africa positioning |
| [`src/content/docs/callCenter.js`](src/content/docs/callCenter.js) | Call Center docs navigation and page content |
| [`public/sitemap.xml`](public/sitemap.xml) | Crawlable URL list |
| [`public/llms.txt`](public/llms.txt) | LLM-friendly company and services summary |
| [`index.html`](index.html) | Global meta tags, JSON-LD, and Search Console verification |

After changing routes or page titles, update `scripts/prerender.mjs` so the build-time HTML stays in sync.

## Environment variables

Copy [`.env.example`](.env.example) to `.env.local`:

```
VITE_CONTACT_EMAIL=team.mau.ai@gmail.com
```

## Contact form

No backend or third-party API. After submitting the form on `/contact`, visitors choose Gmail, Outlook, Yahoo Mail, or their default email client. A draft to `team.mau.ai@gmail.com` opens with their details pre-filled.

## Deploy on Vercel

| Setting | Value |
| --- | --- |
| Framework Preset | Vite |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

[`vercel.json`](vercel.json) configures:

- `trailingSlash: false` — routes like `/services` resolve consistently
- SPA rewrites for client-side routing
- Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- Cache and content-type headers for `sitemap.xml`, `robots.txt`, `llms.txt`, and `manifest.json`

### Deployment access

Vercel checks the **Git commit author** against linked team members. If a deploy is blocked with *"commit author does not have contributing access"*:

1. Link GitHub (`guyi34super`) in [Vercel Account Settings → Authentication](https://vercel.com/account/settings/authentication)
2. Ensure the commit author email matches the linked GitHub account:
   ```bash
   git config user.name "Bhavish11"
   git config user.email "67825986+guyi34super@users.noreply.github.com"
   ```
3. Push a new commit or redeploy from the Vercel dashboard

## Project structure

```
public/
  favicon.png, logo-mu.png, og-image.png, apple-touch-icon.png
  manifest.json, sitemap.xml, robots.txt, llms.txt
scripts/
  prerender.mjs              # Static HTML for all routes at build time
src/
  components/
    layout/                  # SiteHeader, SiteFooter, SiteShell, AppLayout
    marketing/               # PageHero, SectionBlock, FeatureGrid, FaqList, CtaBand
    docs/                    # DocsSidebar, DocsArticle, DocsBreadcrumb, etc.
    Robot3D.jsx              # Three.js robot mascot
    Robot3DLazy.jsx          # Lazy-loaded 3D hero wrapper
    CookieNotice.jsx, LoadingScreen.jsx, ErrorBoundary.jsx
  config/brand.js            # Site name, URL, email, default SEO
  content/
    marketing.js             # Services, team, FAQs, industries
    docs/callCenter.js       # Call Center documentation content
  hooks/useSEO.js            # Per-page title, description, canonical URL
  pages/                     # Home, Services, Contact, Privacy, docs/*
  App.jsx                    # Routes and loading screen
  main.jsx                   # Entry point
vercel.json                  # Routing, security headers, cache rules
vite.config.js               # Dev server (5173) and preview (4173)
```

## Key dependencies

| Package | Purpose |
| --- | --- |
| `react` / `react-router-dom` | UI and client-side routing |
| `framer-motion` | Page and section animations |
| `three` / `@react-three/fiber` / `@react-three/drei` | 3D robot mascot on home page |
| `lucide-react` | Icons across marketing and docs |
| `tailwindcss` | Utility-first styling |
| `vite` | Dev server and production bundler |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Production build + prerender all routes |
| `npm run preview` | Serve `dist/` locally on port 4173 |

## Team

- Reezvi Pydiah — Founder & Managing Director
- Bhavish Nobeen — Director of Technology
- Rushal Seeruthun — Director of Engineering
- Taj Aundoo — Director of Operations
