/**
 * StudentHub Seed Script
 * Run this after setting up the database to create initial configuration.
 * 
 * Usage: npx tsx scripts/seed.ts
 */

import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log('Seeding database...');

  // Verify connection
  const { data, error } = await supabase.from('schools').select('count');
  if (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }

  console.log('Database connection successful');
  console.log('Current schools count:', data);
  console.log('Ready for use. Add schools through the registration flow.');
}

seed().catch(console.error);
