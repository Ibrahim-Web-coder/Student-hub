import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Edit, Trash2, Eye, Download } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getExams } from '@/lib/supabase/actions';

export const dynamic = 'force-dynamic';

export default async function ExamsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  let exams: any[] = [];
  let error = null;

  try {
    exams = await getExams(user.school_id);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Exams</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage examinations and grading</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Exam
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Exams', value: exams.length },
          { label: 'Published', value: exams.filter(e => e.is_published).length },
          { label: 'Upcoming', value: exams.filter(e => new Date(e.exam_date) > new Date()).length },
        ].map((stat: any) => (
          <Card key={stat.label} title={stat.label}>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      {error ? (
        <Card title="Error" description="Failed to load exams">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : exams.length === 0 ? (
        <Card title="No exams created" description="Create your first exam to start grading students">
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium">No exams found</p>
            <p className="text-xs mt-1 mb-4">Create your first exam to get started</p>
            <Button variant="primary"><Plus className="w-4 h-4 mr-2" /> Create First Exam</Button>
          </div>
        </Card>
      ) : (
        <Card title="All Exams" action={<Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {exams.map((exam: any) => (
                  <tr key={exam.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{exam.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">{exam.exam_type}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{exam.classes?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{exam.subjects?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{exam.exam_date}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{exam.total_marks}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${exam.is_published ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {exam.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
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
        </Card>
      )}
    </DashboardLayout>
  );
}
