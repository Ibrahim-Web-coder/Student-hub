import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SectionsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Sections</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage class sections and room assignments</p>
        </div>
      </div>

      <Card title="No sections yet" description="Create sections for your classes to organize students">
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm font-medium">No sections available</p>
          <p className="text-xs mt-1">Create sections to divide classes into smaller groups</p>
        </div>
      </Card>
    </DashboardLayout>
  );
}
