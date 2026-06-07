import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, TrendingDown, PieChart, CalendarDays, DollarSign, Users, FileText } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getDashboardStats, getAttendanceTrend, getRevenueTrend } from '@/lib/supabase/actions';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  let stats = null;
  let attendanceTrend: any[] = [];
  let revenueTrend: any[] = [];

  try {
    stats = await getDashboardStats(user.school_id);
    attendanceTrend = await getAttendanceTrend(user.school_id);
    revenueTrend = await getRevenueTrend(user.school_id);
  } catch {}

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="180">Last 6 months</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card title="Attendance Rate">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.attendanceRate}%</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Healthy
                  </p>
                </div>
              </div>
            </Card>
            <Card title="Total Students">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                  <p className="text-xs text-gray-500">Enrolled</p>
                </div>
              </div>
            </Card>
            <Card title="Total Revenue">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalCollected.toLocaleString()}</p>
                  <p className="text-xs text-red-500">${stats.totalDue.toLocaleString()} due</p>
                </div>
              </div>
            </Card>
            <Card title="Assignments">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAssignments}</p>
                  <p className="text-xs text-gray-500">Created</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Attendance Trends" description="Monthly attendance rate">
              {attendanceTrend.length > 0 ? (
                <div className="space-y-4">
                  {attendanceTrend.map((item: any) => (
                    <div key={item.month} className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-500">{item.month}</div>
                      <div className="flex-1">
                        <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{ width: `${item.rate}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-right text-sm font-medium text-gray-900 dark:text-white">{item.rate}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No attendance data available</p>
                </div>
              )}
            </Card>

            <Card title="Revenue Collection" description="Monthly fee collection">
              {revenueTrend.length > 0 ? (
                <div className="space-y-4">
                  {revenueTrend.map((item: any) => (
                    <div key={item.month} className="flex items-center gap-4">
                      <div className="w-16 text-sm text-gray-500">{item.month}</div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            style={{ width: `${item.collected > 0 ? Math.min((item.collected / (item.collected + item.due)) * 100, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm font-medium text-gray-900 dark:text-white">${item.collected.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-400">
                  <PieChart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No revenue data available</p>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
