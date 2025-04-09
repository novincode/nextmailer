# NextMailer 📧

<div align="center">
  <img src="public/logo-dark.png" alt="NextMailer Logo" width="200" />
  <p><strong>The modern, edge-compatible email system for Next.js 15.2+.</strong></p>
  
  <br />

  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15.2-black" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-blue" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6" /></a>
  <a href="https://vercel.com/features/edge-functions"><img src="https://img.shields.io/badge/Edge-Compatible-green" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" /></a>
</div>

---

## ✨ What is NextMailer?

**NextMailer** is your ultimate stack for building and sending beautiful, responsive emails at the **edge**—powered by React, Next.js, and Resend. Whether you're launching a newsletter, delivering lead magnets, or collecting subscribers, NextMailer gets you production-ready fast, with zero compromise on developer experience.

---

## 🚀 Features

- ⚡️ **Edge-Compatible Rendering** – Fast, serverless delivery ready for Cloudflare & Vercel
- 🎨 **React Email Templates** – Responsive, customizable email UIs with theme support
- 📬 **Subscriber System** – Plug-and-play signup, unsubscribe & lead magnet delivery
- 🔌 **Resend Integration** – Seamless transactional email API
- 💅 **Dark/Light Themes** – Personalize the look of emails and forms
- 🧠 **TypeScript First** – End-to-end type safety
- 🧱 **Drizzle ORM + Neon DB** – Lightweight, serverless database combo
- 📦 **Ready-to-Deploy** – Scripts and configs included for smooth Edge deployment

---

## 🛠️ Getting Started

### 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) — install via `npm install -g pnpm`
- PostgreSQL (e.g., [Neon](https://neon.tech/))

### 🔧 Installation

```bash
git clone https://github.com/novincode/nextmailer.git
cd nextmailer
pnpm install

cp .env.example .env.local
# Edit .env.local with your values
```

### 🧱 Set Up the Database

```bash
pnpm db         # Run migrations
pnpm db:reset   # Optional: reset everything
```

### 🧪 Start Development

```bash
pnpm dev
```

Visit `http://localhost:3000` to preview your app.

---

## ⚙️ Environment Configuration

```bash
# Database
DATABASE_URL="your_postgresql_url"

# Resend Email API
RESEND_API_KEY="re_your_api_key"
RESEND_DOMAIN="yourdomain.com"
DEFAULT_FROM_EMAIL="hello@yourdomain.com"

# App Info
NEXT_PUBLIC_APP_NAME="Your Newsletter"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Theme & Runtime
DEFAULT_MAIL_THEME="light"
NEXT_PUBLIC_RUNTIME="edge"
```

More in `.env.example`.

---

## 💌 Email Templates

NextMailer uses `react-email` components for rich, responsive designs:

- `Layout.tsx` – Base wrapper
- `LeadMagnetEmail.tsx` – Deliver PDFs or bonuses
- `generated/*.html` – Pre-rendered for edge runtime

### 🛠 Customization

```bash
pnpm generate-templates
```

✅ Automatically runs before deploy

Modify styles in:
- `components/templates/colors.ts`
- `components/templates/*.tsx`

---

## 🧾 Forms & Pages

- `/subscribe` – Newsletter signup
- `/unsubscribe` – One-click opt-out
- `/example-lead-magnet` – Deliver your lead magnet

Forms:
- `DefaultForm`
- `UnsubscribeForm`
- `LeadMagnetForm`

Customize them in `components/forms/` and pages in `app/(main)/`.

---

## 🔌 Server Actions

No messy APIs — NextMailer uses **Next.js Server Actions**:

```ts
import { subscribeToNewsletter } from "@/lib/actions/subscribe";

const result = await subscribeToNewsletter(formData);

if (result.success) {
  // ✅ Yay!
} else {
  // 😬 Handle error
}
```

Other actions:
- `unsubscribe.ts`
- `sendEmail.ts`

---

## 🌐 Deployment

### 🟢 Edge Deployment (Recommended)

```bash
pnpm deploy
```

- Auto-generates email HTMLs
- Works with Cloudflare Pages, Vercel Edge, etc.

### 🟡 Standard Deployment

Just remove `NEXT_PUBLIC_RUNTIME="edge"` if you're not targeting edge.

---

## 🗂 Project Structure

```
nextmailer/
├── app/
│   ├── (main)/         # Public pages
│   └── api/            # API routes
├── components/
│   ├── forms/          # Signup/unsubscribe UIs
│   ├── templates/      # Email components
│   │   └── generated/  # Static HTML for edge
│   └── ui/             # UI building blocks
├── lib/
│   ├── actions/        # Server actions
│   ├── db/             # Drizzle config
│   ├── email/          # Email logic
│   └── scripts/        # Dev/deploy scripts
└── public/             # Logo, assets
```

---

## 🤝 Contributing

Got a bug, idea, or enhancement?

1. Fork the repo
2. Create a branch: `git checkout -b feature/awesome`
3. Push changes: `git commit -m 'feat: add awesome'`
4. Open a PR 🧃

Let's make open source cooler—together.

---

## 📝 License

Licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for full details.

---

## 🙌 Acknowledgments

Built with love & tech:

- [Next.js](https://nextjs.org/)
- [React Email](https://react.email/)
- [Resend](https://resend.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon](https://neon.tech/)

---

<div align="center">
  <strong>Made with 💛 by <a href="https://github.com/novincode">novincode</a></strong><br/>
  Questions? Suggestions? <a href="https://github.com/novincode/nextmailer/issues">Open an issue</a> or star the repo 🌟
</div>
