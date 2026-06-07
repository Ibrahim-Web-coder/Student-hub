# StudentHub Deployment Guide

## PART 1: SUPABASE SETUP

1. Create project at supabase.com
2. Copy Project URL, anon key, and service role key
3. Run docs/DATABASE_SCHEMA.sql in SQL editor
4. Create storage buckets: student-photos, teacher-photos, school-logos, assignment-files, submission-files, documents, id-cards
5. Configure auth: Email provider enabled, site URL set, email templates customized
6. Verify RLS policies are active

## PART 2: LOCAL DEVELOPMENT

```bash
npm install
cp .env.example .env.local
# Fill in Supabase credentials
npm run dev
```

## PART 3: VERCEL DEPLOYMENT

1. Push to GitHub
2. Import to Vercel
3. Set environment variables
4. Deploy

## PART 4: MAINTENANCE

- Daily backups via Supabase
- Monitor via Vercel Analytics
- Scale with connection pooling
