import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Edit, Trash2, Eye, Check, Clock, AlertCircle, Download } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getAssignments } from '@/lib/supabase/actions';
import { cn, formatDate } from '@/lib/utils/helpers';

export const dynamic = 'force-dynamic';

export default async function AssignmentsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  let assignments: any[] = [];
  let error = null;

  try {
    assignments = await getAssignments(user.school_id);
  } catch (e: any) {
    error = e.message;
  }

  const getStatusBadge = (dueDate: string, submissions?: any[]) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (now > due) return { label: 'Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
    if (submissions && submissions.length > 0) return { label: 'In Progress', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
    return { label: 'Active', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' };
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Create, manage, and grade student assignments</p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: assignments.length, icon: FileText, color: 'blue' },
          { label: 'Active', value: assignments.filter(a => new Date(a.due_date) > new Date()).length, icon: Clock, color: 'emerald' },
          { label: 'Overdue', value: assignments.filter(a => new Date(a.due_date) < new Date()).length, icon: AlertCircle, color: 'red' },
          { label: 'Published', value: assignments.filter(a => a.is_published).length, icon: Check, color: 'purple' },
        ].map((stat: any) => (
          <Card key={stat.label} title={stat.label}>
            <div className="flex items-center gap-3">
              <stat.icon className={cn('w-5 h-5', stat.color === 'blue' && 'text-blue-500', stat.color === 'emerald' && 'text-emerald-500', stat.color === 'red' && 'text-red-500', stat.color === 'purple' && 'text-purple-500')} />
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {error ? (
        <Card title="Error" description="Failed to load assignments">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : assignments.length === 0 ? (
        <Card title="No assignments created" description="Create your first assignment to get started">
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FileText className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium">No assignments found</p>
            <p className="text-xs mt-1 mb-4">Create your first assignment to start tracking student work</p>
            <Button variant="primary"><Plus className="w-4 h-4 mr-2" /> Create First Assignment</Button>
          </div>
        </Card>
      ) : (
        <Card title="All Assignments" action={<Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {assignments.map((assignment: any) => {
                  const status = getStatusBadge(assignment.due_date, assignment.submissions);
                  return (
                    <tr key={assignment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{assignment.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{assignment.classes?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{assignment.subjects?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(assignment.due_date, 'short')}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{assignment.total_points}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 capitalize">{assignment.assignment_type}</td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', status.color)}>
                          {status.label}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
