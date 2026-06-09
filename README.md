# MAU AI Website

Marketing site for MAU AI — a React + Vite app with Tailwind CSS, Framer Motion, and React Router.

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

## Deploy on Vercel

Import this repository in Vercel. Vercel usually detects Vite automatically. If you set values manually, use:

| Setting | Value |
| --- | --- |
| **Framework Preset** | Vite |
| **Install Command** | `npm install` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Development Command** | `npm run dev` |

You do not need a custom start command. Vercel serves the static files from `dist/` after the build.

### Client-side routing

This app uses React Router (`/`, `/services`, `/contact`). Add a `vercel.json` at the project root so direct links and refreshes work:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Contact form (EmailJS)

The contact page uses [EmailJS](https://www.emailjs.com/). Before production use, replace the placeholders in `src/pages/Contact.jsx`:

- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`

## Project structure

```
src/
  components/   # Navbar, Footer, Robot, ParticleCanvas
  pages/        # Home, Services, Contact
  App.jsx       # Routes and layout
  main.jsx      # App entry point
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Create production build in `dist/` |
| `npm run preview` | Serve the production build locally |
