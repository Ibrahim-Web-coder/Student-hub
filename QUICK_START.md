# STUDENTHUB - QUICK START GUIDE

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Supabase (Database)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"**
3. Enter project name (e.g., "studenthub"), set a database password, choose your region
4. Click **"Create new project"** and wait ~2 minutes
5. Go to **Settings > API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`
6. Go to **SQL Editor**, paste the contents of `docs/DATABASE_SCHEMA.sql`, and click **Run**
7. Go to **Storage** and create these buckets (all Public):
   - `student-photos`
   - `teacher-photos`
   - `school-logos`
   - `assignment-files`
   - `submission-files`
   - `documents`
   - `id-cards`

### Step 3: Set Up Email (Resend - FREE)
1. Go to [resend.com](https://resend.com) and sign up (free: 3,000 emails/month)
2. Go to **API Keys** → **Create API Key** → Name it "StudentHub" → Copy the key (starts with `re_`)
3. That's it! No domain verification needed for testing.

### Step 4: Configure Environment Variables
Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

Then edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=StudentHub

RESEND_API_KEY=re_xxxxxxxxxx
EMAIL_FROM=StudentHub <onboarding@resend.dev>
```

### Step 5: Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure
```
StudentHub/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # Landing page (public)
│   ├── (auth)/               # Login, Register, Forgot Password
│   ├── (dashboard)/          # Protected dashboard pages
│   └── api/                  # REST API routes
├── components/               # Reusable UI components
│   ├── ui/                   # Basic UI (buttons, inputs)
│   ├── dashboard/            # Charts, cards, stats
│   ├── layout/               # Sidebar, navbar
│   ├── marketing/            # Landing page sections
│   ├── forms/                # Student/Teacher forms
│   └── modals/               # Dialog components
├── lib/
│   ├── supabase/             # DB client, actions, auth
│   ├── utils/                # Helpers, formatting
│   ├── validations/          # Zod schemas
│   ├── hooks/                # React hooks
│   └── email/                # Email sending (Resend)
├── docs/
│   ├── DATABASE_SCHEMA.sql   # Complete DB schema
│   ├── ALL_DATABASE_QUERIES.sql  # All SQL queries reference
│   └── DEPLOYMENT.md         # Production deployment guide
└── .env.example              # Environment variable template
```

---

## 🧪 Testing Your Setup

1. **Register a new school**: Go to `/register`, fill in your details
2. **Verify email**: Check your inbox (or use the test email from Resend)
3. **Login**: Go to `/login` with your credentials
4. **Dashboard**: You'll land on `/dashboard/control-center`
5. **Add Students**: Go to Students page, add your first student
6. **Send Emails**: The system automatically sends welcome emails on registration

---

## 🌐 Deploy to Production (Vercel - FREE)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com), sign up, import your repo
3. Add all environment variables from `.env.local` in Vercel settings
4. Click **Deploy**
5. Your app is live! Vercel gives you a free `.vercel.app` domain

---

## 📧 Email Integration (Already Set Up!)

StudentHub includes pre-built email templates for:

| Email Type | Trigger | Template |
|-----------|---------|----------|
| **Welcome Email** | New school registration | Branded HTML with getting started guide |
| **Fee Reminder** | Payment due date approaching | Amount, due date, payment link |
| **Attendance Alert** | Student attendance drops below 75% | Warning with attendance rate |
| **Custom Emails** | Any notification | Pass subject + HTML body |

Usage example:
```typescript
import { sendWelcomeEmail } from '@/lib/email';

// After user registers
await sendWelcomeEmail(
  user.email,
  user.full_name,
  school.name
);
```

---

## 🔧 Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check for code issues
npm run type-check   # TypeScript validation
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| Database connection failed | Check Supabase URL and keys in .env.local |
| Tables don't exist | Run `docs/DATABASE_SCHEMA.sql` in Supabase SQL Editor |
| Email not sending | Check RESEND_API_KEY is set correctly |
| Page shows empty states | Add data through the dashboard or API |
| Build fails | Run `npm run type-check` to see errors |

---

**Need help?** Check `docs/DEPLOYMENT.md` for complete deployment instructions.
