import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { formatDate, getInitials, cn } from '@/lib/utils/helpers';
import { CalendarCheck, CheckCircle, XCircle, Clock, HelpCircle, Download, Printer } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getAttendance, getAttendanceStats } from '@/lib/supabase/actions';

export const dynamic = 'force-dynamic';

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  present: { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30', label: 'Present' },
  absent: { icon: XCircle, color: 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/30', label: 'Absent' },
  late: { icon: Clock, color: 'text-amber-500 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30', label: 'Late' },
  excused: { icon: HelpCircle, color: 'text-blue-500 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30', label: 'Excused' },
};

export default async function AttendancePage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  let attendance: any[] = [];
  let stats: any = null;
  let error = null;

  try {
    attendance = await getAttendance(user.school_id);
    stats = await getAttendanceStats(user.school_id);
  } catch (e: any) {
    error = e.message;
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Attendance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage daily attendance records</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm" />
          <select className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
            <option value="">All Classes</option>
          </select>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Attendance Rate', value: `${stats.attendanceRate}%`, icon: CalendarCheck, color: 'blue' },
            { label: 'Present', value: stats.present, icon: CheckCircle, color: 'emerald' },
            { label: 'Absent', value: stats.absent, icon: XCircle, color: 'red' },
            { label: 'Late', value: stats.late, icon: Clock, color: 'amber' },
            { label: 'Excused', value: stats.excused, icon: HelpCircle, color: 'gray' },
          ].map((item: any) => (
            <Card key={item.label} title={item.label}>
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', item.color === 'blue' && 'bg-blue-50 dark:bg-blue-900/30', item.color === 'emerald' && 'bg-emerald-50 dark:bg-emerald-900/30', item.color === 'red' && 'bg-red-50 dark:bg-red-900/30', item.color === 'amber' && 'bg-amber-50 dark:bg-amber-900/30', item.color === 'gray' && 'bg-gray-50 dark:bg-gray-800/30')}>
                  <item.icon className={cn('w-5 h-5', item.color === 'blue' && 'text-blue-500', item.color === 'emerald' && 'text-emerald-500', item.color === 'red' && 'text-red-500', item.color === 'amber' && 'text-amber-500', item.color === 'gray' && 'text-gray-500')} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {error ? (
        <Card title="Error" description="Failed to load attendance data">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : attendance.length === 0 ? (
        <Card title="No attendance records" description="Start marking daily attendance to see records here">
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <CalendarCheck className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium">No attendance records found</p>
            <p className="text-xs mt-1 mb-4">Mark attendance for today to get started</p>
          </div>
        </Card>
      ) : (
        <Card title="Attendance Records">
          <div className="space-y-2">
            {attendance.map((record: any) => {
              const config = statusConfig[record.status] || statusConfig.present;
              const Icon = config.icon;
              return (
                <div key={record.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', config.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{record.students?.full_name}</p>
                      <p className="text-xs text-gray-500">{record.students?.student_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{record.check_in_time || '-'}</span>
                    {record.notes && <span className="text-xs text-gray-400">{record.notes}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
}
