'use client';

import { useEffect, useState } from 'react';
import { getActivityLogs } from '@/lib/supabase/actions';
import { formatDate } from '@/lib/utils/helpers';
import { UserPlus, DollarSign, CalendarCheck, FileText, BookOpen, AlertCircle, Loader2 } from 'lucide-react';

const actionIcons: Record<string, any> = {
  'created_student': UserPlus,
  'created_payment': DollarSign,
  'marked_attendance': CalendarCheck,
  'created_exam': FileText,
  'created_class': BookOpen,
  'default': AlertCircle,
};

const actionColors: Record<string, string> = {
  'created_student': 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
  'created_payment': 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
  'marked_attendance': 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
  'created_exam': 'text-purple-500 bg-purple-50 dark:bg-purple-900/30',
  'created_class': 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30',
  'default': 'text-gray-500 bg-gray-50 dark:bg-gray-800/30',
};

export function RecentActivity({ schoolId }: { schoolId: string }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getActivityLogs(schoolId, 10);
        setLogs(data || []);
      } catch (err) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [schoolId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-600">
          <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm font-medium">No recent activity</p>
          <p className="text-xs mt-1">Actions performed will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {logs.map((log: any) => {
          const Icon = actionIcons[log.action] || actionIcons.default;
          const color = actionColors[log.action] || actionColors.default;

          return (
            <div key={log.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {log.action.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {log.details?.message || `Performed on ${log.entity_type}`}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatDate(log.created_at, 'relative')} by {log.users?.full_name || 'System'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
