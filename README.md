# MO Intelligence Website

Marketing site and product docs for [MO Intelligence](https://moi-ai.dev) — Mauritius's AI solutions company. Built with React, Vite, Tailwind CSS, Framer Motion, React Router, and Three.js.

## Features

- **Marketing pages:** `/` (home), `/services`, `/contact`, `/privacy`
- **Product docs:** `/docs` with Call Center guides (`/docs/call-center`, features, how-it-works, billing, get-started)
- **3D robot mascot:** interactive Three.js hero on the home page (lazy-loaded)
- **Unified shell:** shared header, footer, and layout across marketing and docs
- **Contact form:** visitors fill in a form, then choose Gmail, Outlook, Yahoo Mail, or their default email app to send a pre-filled inquiry
- **SEO:** per-page meta tags via `useSEO`, JSON-LD structured data in `index.html`, plus `sitemap.xml`, `robots.txt`, and `llms.txt`
- **Build-time prerendering:** `scripts/prerender.mjs` writes static HTML for every route so crawlers and AI search bots see real page content
- **Privacy:** cookie notice and privacy policy page (no tracking cookies)
- **Security:** CSP, HSTS, and other HTTP headers configured in `vercel.json`
- **Branding:** MO Intelligence logo in navbar/footer and browser tab favicon

## Requirements

- Node.js 18+ (recommended: 20 LTS)
- npm 9+

## Getting started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Build for production:

```bash
npm run build
```

The build runs Vite, then prerenders all routes into `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Environment variables

Copy `.env.example` to `.env.local` to override the contact form recipient:

```
VITE_CONTACT_EMAIL=team.mau.ai@gmail.com
```

## Contact form

The contact form on `/contact` does not use a backend or third-party API. After submitting the form, visitors pick their preferred email provider. A draft message to `team.mau.ai@gmail.com` opens in that service with their details pre-filled. They review and click Send to deliver the inquiry.

## Deploy on Vercel

| Setting | Value |
| --- | --- |
| **Framework Preset** | Vite |
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

`vercel.json` is included for:

- Client-side routing (`/services`, `/contact`, `/docs`, etc.)
- HTTP security headers (CSP, HSTS, X-Frame-Options, and more)

Ensure the GitHub commit author is linked to a Vercel account that is a member of the project's team. Commits from unlinked or unauthorized authors will be blocked on deploy.

## Project structure

```
public/
  favicon.png           # Browser tab icon
  logo-mu.png           # MO Intelligence logo mark
  og-image.png          # Open Graph share image
  apple-touch-icon.png  # iOS home-screen icon
  manifest.json         # PWA manifest
  sitemap.xml           # SEO sitemap
  robots.txt            # Crawler rules
  llms.txt              # LLM discovery file
scripts/
  prerender.mjs         # Build-time static HTML generation for all routes
src/
  components/
    layout/             # SiteHeader, SiteFooter, SiteShell, AppLayout
    marketing/          # PageHero, SectionBlock, FeatureGrid, FaqList, CtaBand
    docs/               # DocsSidebar, DocsArticle, DocsBreadcrumb, etc.
    Robot3D.jsx         # Three.js robot mascot
    Robot3DLazy.jsx     # Lazy-loaded wrapper for the 3D hero
    CookieNotice.jsx    # Privacy cookie banner
    LoadingScreen.jsx   # Initial page load animation
  config/
    brand.js            # Site name, URL, email, and default SEO values
  content/
    marketing.js        # Home/services page copy and data
    docs/callCenter.js  # Call Center documentation content
  hooks/
    useSEO.js           # Per-page meta tags
  pages/
    Home.jsx            # Landing page with 3D robot hero
    Services.jsx
    Contact.jsx
    Privacy.jsx
    docs/               # Docs hub and Call Center doc pages
  App.jsx               # Routes and layout
  main.jsx              # Entry point
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Create production build and prerender all routes into `dist/` |
| `npm run preview` | Serve the production build locally |
