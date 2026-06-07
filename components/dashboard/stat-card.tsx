import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

const colorClasses: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30',
  purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30',
  emerald: 'from-emerald-500 to-emerald-600 text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30',
  amber: 'from-amber-500 to-amber-600 text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30',
  green: 'from-green-500 to-green-600 text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
  indigo: 'from-indigo-500 to-indigo-600 text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/30',
  red: 'from-red-500 to-red-600 text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
  cyan: 'from-cyan-500 to-cyan-600 text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-900/30',
};

export function StatCard({ title, value, change, icon: Icon, color }: {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-emerald-500 font-medium ml-1">{change}</span>
          </div>
        </div>
        <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', colorClasses[color]?.split(' ').slice(0, 2).join(' '))}>
          <Icon className={cn('w-6 h-6', colorClasses[color]?.split(' ')[2])} />
        </div>
      </div>
    </div>
  );
}
