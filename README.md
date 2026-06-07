# StudentHub - Intelligent School Management SaaS Platform

**Enterprise-grade school management platform built with Next.js 15, TypeScript, Supabase, and Tailwind CSS.**

## Features

- **Student Management** - Complete CRUD with profiles, documents, academic history
- **Teacher Management** - Staff profiles, departments, subject allocations
- **Class & Section Management** - Hierarchical organization
- **Attendance System** - Daily tracking, analytics, risk detection, PDF reports
- **Exam & Results** - Grade calculation, GPA, report cards, analytics
- **Assignment Management** - Creation, submissions, grading, due dates
- **Timetable System** - Weekly scheduling with conflict detection
- **Fee Management** - Categories, payments, receipts, revenue analytics
- **Parent Engagement** - Notifications, performance reports, messaging
- **Messaging System** - Secure teacher-student-parent communication
- **File Management** - Supabase Storage integration
- **Analytics Dashboard** - AI-powered insights
- **Dark Mode** - Full theme support
- **Role-Based Access** - 5 user types with RLS policies

## Tech Stack

- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend:** Next.js Server Actions, API Routes
- **Database:** Supabase PostgreSQL with Row Level Security
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm/pnpm
- Supabase account
- Vercel account

### Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=StudentHub
```

## Database Schema

Tables: users, schools, students, teachers, parents, classes, sections, subjects, attendance, exams, results, assignments, submissions, fees, payments, notifications, messages, timetables, activity_logs, files

Complete schema in `docs/DATABASE_SCHEMA.sql`.

## User Roles

- **Platform Owner** - Full system access
- **School Manager** - School-level administration
- **Teacher** - Class management and grading
- **Student** - Self-service access to records
- **Parent** - Child progress monitoring

## Security

- Row Level Security on all tables
- Zod input validation
- XSS protection via sanitization
- CSRF protection via Supabase sessions
- Rate limiting on API routes
- Secure file upload validation

## Project Structure

```
StudentHub/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Landing pages
│   ├── (auth)/             # Login, register, password reset
│   ├── (dashboard)/        # Protected dashboard routes
│   └── api/                # API routes
├── components/             # UI, dashboard, forms, modals
├── lib/                    # Supabase client, utils, validations, hooks
├── docs/                   # Database schema, deployment guide
├── public/                 # Static assets
└── styles/                 # Global CSS
```

## Deployment

See `docs/DEPLOYMENT.md` for complete step-by-step instructions.

## License

Proprietary - All rights reserved.
