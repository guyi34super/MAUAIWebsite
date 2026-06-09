# MAU AI Website

Marketing site for MAU AI — React + Vite, Tailwind CSS, Framer Motion, and React Router.

## Requirements

- Node.js 18+ (recommended: 20 LTS)
- npm 9+

## Local development

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

## Contact form

The contact form on `/contact` opens the visitor's email app with a pre-filled message to `team.mau.ai@gmail.com`. The visitor reviews the draft and clicks Send in their mail app to deliver the inquiry.

No API keys or third-party services are required.

Optionally override the recipient in `.env.local`:

```
VITE_CONTACT_EMAIL=team.mau.ai@gmail.com
```

## Deploy on Vercel

| Setting | Value |
| --- | --- |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

`vercel.json` is included for client-side routing (`/services`, `/contact`, `/privacy`, etc.) and HTTP security headers.

## Project structure

```
src/
  components/   # Navbar, Footer, Robot, LoadingScreen, ParticleCanvas, CookieNotice
  pages/        # Home, Services, Contact, Privacy
  App.jsx       # Routes and layout
  main.jsx      # Entry point
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Serve the production build locally |
