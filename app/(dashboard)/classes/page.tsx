import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/dashboard/card';
import { Plus, GraduationCap, Users, Edit, Trash2, Eye } from 'lucide-react';
import { getClasses } from '@/lib/supabase/actions';
import { getUser, requireSchoolAccess } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils/helpers';

export const dynamic = 'force-dynamic';

export default async function ClassesPage() {
  const user = await requireSchoolAccess('/login');
  let classes: any[] = [];
  let error = null;

  try {
    classes = await getClasses(user.school_id);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Classes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage classes and their configurations</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {error ? (
        <Card title="Error" description="Failed to load classes">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : classes.length === 0 ? (
        <Card title="No classes found" description="Get started by adding your first class">
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
            <GraduationCap className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium">No classes available</p>
            <p className="text-xs mt-1 mb-4">Create your first class to start organizing students</p>
            <Button variant="primary"><Plus className="w-4 h-4 mr-2" /> Add First Class</Button>
          </div>
        </Card>
      ) : (
        <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sections</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {classes.map((cls: any) => (
                  <tr key={cls.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{cls.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{cls.description || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">{cls.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{cls.capacity} students</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{cls.teachers?.full_name || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{cls.academic_year || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{cls.sections?.length || 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
