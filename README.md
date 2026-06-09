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

## Contact form email setup (EmailJS)

The contact form sends client inquiries to `team.mau.ai@gmail.com` via [EmailJS](https://www.emailjs.com). Each email includes the client's details and sets **Reply-To** to their address so you can reply directly from Gmail.

### 1. Create an EmailJS account

1. Sign up at [https://www.emailjs.com](https://www.emailjs.com) (free tier: 200 emails/month)
2. **Email Services** → Add Gmail → connect `team.mau.ai@gmail.com`

### 2. Create an email template

Create a template with these variables (must match the code):

| Variable | Description |
| --- | --- |
| `{{from_name}}` | Client's full name |
| `{{from_email}}` | Client's email |
| `{{company}}` | Company name |
| `{{service}}` | Service selected |
| `{{message}}` | Message body |
| `{{reply_to}}` | Client's email (set as Reply-To) |
| `{{to_email}}` | Inbox address |

**Suggested subject:** `New MAU AI inquiry from {{from_name}}`

**Important:** In the template settings, set **Reply-To** to `{{reply_to}}` so Gmail's Reply button addresses the client.

### 3. Local environment variables

Copy the example file and add your keys:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

Restart the dev server after changing env vars.

### 4. Vercel environment variables

In Vercel → Project → **Settings** → **Environment Variables**, add:

| Variable | Value |
| --- | --- |
| `VITE_EMAILJS_SERVICE_ID` | Your EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | Your EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | Your EmailJS public key |

**Redeploy after adding variables** — Vite bakes env vars in at build time.

### Fallback (FormSubmit)

If EmailJS env vars are not set in production, the form falls back to [FormSubmit](https://formsubmit.co). This requires a one-time activation: submit the form once, then click the activation link sent to `team.mau.ai@gmail.com`.

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
