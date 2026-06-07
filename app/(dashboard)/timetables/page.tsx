import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Download, Printer, FileText, FolderOpen } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getTimetable } from '@/lib/supabase/actions';
import { formatTime } from '@/lib/utils/helpers';

export const dynamic = 'force-dynamic';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default async function TimetablesPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  let timetable: any[] = [];
  let error = null;

  try {
    timetable = await getTimetable('');
  } catch (e: any) {
    error = e.message;
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Timetables</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage class and teacher schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm">
            <option value="">Select Class</option>
          </select>
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button variant="primary" size="sm"><Clock className="w-4 h-4 mr-2" /> Add Schedule</Button>
        </div>
      </div>

      {timetable.length === 0 ? (
        <Card title="No timetable entries" description="Create a weekly schedule for your classes">
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <CalendarIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium">No timetable found</p>
            <p className="text-xs mt-1 mb-4">Create a timetable to organize class schedules</p>
            <Button variant="primary"><Clock className="w-4 h-4 mr-2" /> Create First Schedule</Button>
          </div>
        </Card>
      ) : (
        <Card title="Weekly Timetable">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Time</th>
                  {days.slice(0, 5).map((day) => (
                    <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      Period {i + 1}
                    </td>
                    {days.slice(0, 5).map((day) => {
                      const slot = timetable.find((t: any) => t.day_of_week === i + 1 && Math.floor(parseInt(t.start_time) / 1) === i);
                      return (
                        <td key={day} className="px-4 py-3">
                          {slot ? (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{slot.subjects?.name}</p>
                              <p className="text-xs text-gray-500 mt-1">{slot.teachers?.full_name}</p>
                              {slot.room_number && (
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {slot.room_number}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="p-3 bg-gray-50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center text-xs text-gray-400">
                              Free Period
                            </div>
                          )}
                        </td>
                      );
                    })}
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
