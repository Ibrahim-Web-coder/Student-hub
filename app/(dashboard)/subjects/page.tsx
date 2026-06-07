import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SubjectsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Subjects</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage academic subjects and assignments</p>
        </div>
      </div>
      <Card title="No subjects yet" description="Create subjects for your curriculum">
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-sm font-medium">No subjects found</p>
          <p className="text-xs mt-1">Create subjects to organize the curriculum for each class</p>
        </div>
      </Card>
    </DashboardLayout>
  );
}
