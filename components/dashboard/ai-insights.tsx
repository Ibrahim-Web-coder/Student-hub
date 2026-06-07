'use client';

import { Brain, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

export function AIInsights({ attendanceRate, totalStudents, revenueDue }: {
  attendanceRate: number;
  totalStudents: number;
  revenueDue: number;
}) {
  const insights = [];

  if (attendanceRate > 90) {
    insights.push({
      icon: TrendingUp,
      title: 'Attendance Excellence',
      description: `Your attendance rate of ${attendanceRate}% is excellent. Keep maintaining this momentum.`,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
      priority: 'success',
    });
  } else if (attendanceRate < 80) {
    insights.push({
      icon: AlertTriangle,
      title: 'Attendance Alert',
      description: `Your attendance rate of ${attendanceRate}% is below the 80% threshold. Consider reaching out to absent students.`,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
      priority: 'warning',
    });
  }

  if (revenueDue > 0) {
    insights.push({
      icon: DollarSign,
      title: 'Revenue Follow-up',
      description: `$${revenueDue.toLocaleString()} in fees are currently outstanding. Consider sending reminders to parents.`,
      color: 'text-red-500 bg-red-50 dark:bg-red-900/30',
      priority: 'danger',
    });
  }

  if (insights.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Start tracking data to receive personalized AI insights about attendance patterns, student performance trends, and revenue optimization.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insights</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Powered by StudentHub AI</p>
        </div>
      </div>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800/50 rounded-xl">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${insight.color}`}>
              <insight.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{insight.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
