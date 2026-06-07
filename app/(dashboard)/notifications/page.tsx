import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/dashboard/card';
import { Button } from '@/components/ui/button';
import { Bell, CalendarDays, DollarSign, FileText, BookOpen, AlertTriangle, Check, Eye, Loader2 } from 'lucide-react';
import { getUser } from '@/lib/supabase/auth';
import { redirect } from 'next/navigation';
import { getNotifications } from '@/lib/supabase/actions';
import { formatDate, cn } from '@/lib/utils/helpers';

export const dynamic = 'force-dynamic';

const notificationIcons: Record<string, any> = {
  announcement: Bell,
  attendance: CalendarDays,
  academic: BookOpen,
  fee: DollarSign,
  assignment: FileText,
  general: AlertTriangle,
};

const notificationColors: Record<string, string> = {
  announcement: 'bg-blue-50 dark:bg-blue-900/30 text-blue-500',
  attendance: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500',
  academic: 'bg-purple-50 dark:bg-purple-900/30 text-purple-500',
  fee: 'bg-amber-50 dark:bg-amber-900/30 text-amber-500',
  assignment: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-500',
  general: 'bg-gray-50 dark:bg-gray-800/30 text-gray-500',
};

export default async function NotificationsPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.school_id) redirect('/onboarding');

  let notifications: any[] = [];

  try {
    notifications = await getNotifications(user.id, user.school_id);
  } catch {}

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated with important announcements and alerts</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card title="No notifications" description="All caught up! No new notifications">
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Bell className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs mt-1">School notifications will appear here</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any) => {
            const Icon = notificationIcons[notification.type] || Bell;
            const color = notificationColors[notification.type] || notificationColors.general;

            return (
              <Card key={notification.id} title="">
                <div className="flex items-start gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatDate(notification.created_at, 'relative')}</span>
                        {notification.priority === 'high' && (
                          <span className="badge badge-danger">High</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {!notification.is_read && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-emerald-500">
                          <Check className="w-3 h-3 mr-1" />
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
