# MAU AI Website

Marketing site for [MAU AI](https://mauai.co) — Mauritius's AI solutions company. Built with React, Vite, Tailwind CSS, Framer Motion, and React Router.

## Features

- **Pages:** `/` (home), `/services`, `/contact`, `/privacy`
- **Contact form:** visitors fill in a form, then choose Gmail, Outlook, Yahoo Mail, or their default email app to send a pre-filled inquiry
- **SEO:** per-page meta tags via `useSEO`, JSON-LD structured data in `index.html`, plus `sitemap.xml`, `robots.txt`, and `llms.txt`
- **Privacy:** cookie notice and privacy policy page (no tracking cookies)
- **Security:** CSP, HSTS, and other HTTP headers configured in `vercel.json`
- **Branding:** MU logo in navbar/footer and browser tab favicon

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

Preview the production build locally:

```bash
npm run preview
```

The build output is written to `dist/`.

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

- Client-side routing (`/services`, `/contact`, `/privacy`, etc.)
- HTTP security headers (CSP, HSTS, X-Frame-Options, and more)

## Project structure

```
public/
  favicon.png           # Browser tab icon
  logo-mu.png           # MU logo mark
  apple-touch-icon.png  # iOS home-screen icon
  manifest.json         # PWA manifest
  sitemap.xml           # SEO sitemap
  robots.txt            # Crawler rules
  llms.txt              # LLM discovery file
src/
  components/           # Navbar, Footer, Robot, LoadingScreen, ParticleCanvas, CookieNotice
  hooks/                # useSEO (per-page meta tags)
  pages/                # Home, Services, Contact, Privacy
  App.jsx               # Routes and layout
  main.jsx              # Entry point
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Serve the production build locally |
