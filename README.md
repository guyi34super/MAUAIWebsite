# MAU AI Website

Marketing site for MAU AI — React + Vite, Tailwind CSS, Framer Motion, and React Router.

## Requirements

- Node.js 18+ (recommended: 20 LTS)
- npm 9+

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build    # output → dist/
npm run preview  # preview production build
```

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

`vercel.json` is included for client-side routing (`/services`, `/contact`, etc.).

## Project structure

```
src/
  components/   # Navbar, Footer, Robot, LoadingScreen, ParticleCanvas
  pages/        # Home, Services, Contact
  App.jsx       # Routes and layout
  main.jsx      # Entry point
```
