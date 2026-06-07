'use client';

import { cn } from '@/lib/utils/helpers';

export function Card({ title, description, children, className, action }: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn('bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50', className)}>
      <div className="flex items-center justify-between p-6 pb-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
