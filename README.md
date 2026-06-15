# ProcureHub — Deployment Guide
# Zero-cost procurement portal · Next.js + Supabase + Vercel

---

## 1. Set up Supabase (Free)

1. Go to https://supabase.com and create a free account
2. Click **New project** → give it a name (e.g. `procurehub`) → set a DB password → **Create project**
3. Once ready, go to **SQL Editor** → paste the entire contents of `supabase/migrations/001_initial_schema.sql` → click **Run**
4. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon` public key

---

## 2. Configure environment variables

Create a `.env.local` file in the root of this project:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 3. Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to /login.

---

## 4. Deploy to Vercel (Free)

1. Push this project to a GitHub repo
2. Go to https://vercel.com → **Add New Project** → import your repo
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

Your app is live at `https://your-project.vercel.app` — **$0/month**.

---

## 5. Set up your first admin user

1. Visit `https://your-app.vercel.app/login`
2. Click **Create account** and register with your email
3. In Supabase → **Table Editor → profiles** → find your row → change `role` to `admin`
4. Sign in — you'll have full admin access

---

## 6. Share the supplier portal

Go to **Supplier portal** in the sidebar and copy the link to share with external suppliers.  
The public URL is: `https://your-app.vercel.app/supplier/portal?token=abc123xyz`

---

## Architecture overview

```
procurehub/
├── app/
│   ├── (app)/              ← Protected pages (require login)
│   │   ├── dashboard/
│   │   ├── purchase-orders/
│   │   │   ├── new/
│   │   │   └── [id]/
│   │   ├── vendors/
│   │   ├── inventory/
│   │   ├── budget/
│   │   ├── supplier-portal/
│   │   └── settings/
│   ├── login/              ← Public auth page
│   └── supplier/portal/    ← Public supplier upload page
├── components/
│   └── layout/Sidebar.tsx
├── lib/supabase.ts
├── types/database.ts
├── middleware.ts            ← Auth guard
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql
```

## Free tier limits (what to watch)

| Service  | Free limit            | Notes                                    |
|----------|-----------------------|------------------------------------------|
| Supabase | 500MB DB, 1GB storage | Pauses after 7 days inactive — fix with a cron ping |
| Vercel   | 100GB bandwidth/month | More than enough for internal tools      |
| Users    | Unlimited             | Supabase Auth supports unlimited users   |

## When you're ready to scale

| Service  | Paid plan | Monthly cost |
|----------|-----------|--------------|
| Supabase | Pro       | $25/mo       |
| Vercel   | Pro       | $20/mo       |
| **Total**|           | **$45/mo**   |

That's $45/month for 50+ users — no per-seat licensing.

---

## Tech stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Row Level Security + Auth + Storage)
- **Hosting**: Vercel
- **Auth**: Supabase Auth (email + password)
- **File uploads**: Supabase Storage
