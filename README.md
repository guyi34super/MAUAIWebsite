# MO Intelligence Website

Marketing site and product documentation for [MO Intelligence](https://moi-ai.dev) — Mauritius's AI solutions company.

**Live site:** [moi-ai.dev](https://moi-ai.dev)  
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
- `/docs/call-center/features`
- `/docs/call-center/how-it-works`
- `/docs/call-center/billing`
- `/docs/call-center/get-started`

### Platform
- **Unified shell** — shared header, footer, and layout across marketing and docs
- **SEO** — per-page meta tags (`useSEO`), JSON-LD in `index.html`, geo tags, Open Graph, `sitemap.xml`, `robots.txt`, and `llms.txt`
- **Prerendering** — `scripts/prerender.mjs` writes static HTML for every route at build time so search engines and AI crawlers index real content
- **Security** — CSP, HSTS, X-Frame-Options, and other headers in `vercel.json`
- **Branding** — MO Intelligence logo, favicon, PWA manifest, and OG image

## Requirements

- Node.js 18+ (recommended: 20 LTS)
- npm 9+

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Build and preview:

```bash
npm run build    # Vite build + prerender all routes into dist/
npm run preview  # Serve the production build locally
```

## Environment variables

Copy `.env.example` to `.env.local`:

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
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build + prerender all routes |
| `npm run preview` | Serve `dist/` locally |

## Team

- Reezvi Pydiah — Founder & Managing Director
- Bhavish Nobeen — Director of Technology
- Rushal Seeruthun — Director of Engineering
- Taj Aundoo — Director of Operations
