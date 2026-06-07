'use client';

import { useEffect, useState } from 'react';
import { getNotifications } from '@/lib/supabase/actions';
import { formatDate } from '@/lib/utils/helpers';
import { Bell, CalendarDays, BookOpen, DollarSign, FileText, AlertTriangle, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const notificationIcons: Record<string, any> = {
  announcement: Bell,
  attendance: CalendarDays,
  academic: BookOpen,
  fee: DollarSign,
  assignment: FileText,
  general: AlertTriangle,
};

export function UpcomingEvents({ schoolId }: { schoolId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications('', schoolId);
        setNotifications(data || []);
      } catch (err) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [schoolId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Announcements</h3>
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Announcements</h3>
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-600">
          <Bell className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm font-medium">No announcements yet</p>
          <p className="text-xs mt-1">School announcements will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Announcements</h3>
      <div className="space-y-3">
        {notifications.slice(0, 5).map((notification: any) => {
          const Icon = notificationIcons[notification.type] || Bell;
          return (
            <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${notification.is_read ? 'bg-gray-50 dark:bg-gray-800/30' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30'}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.is_read ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-500'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notification.message}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(notification.created_at, 'relative')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
