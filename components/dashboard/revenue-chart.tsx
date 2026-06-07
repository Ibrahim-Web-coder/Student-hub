'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function RevenueChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-600">
        <p className="text-sm">No revenue data available yet</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(229 231 235)" />
        <XAxis dataKey="month" stroke="rgb(156 163 175)" fontSize={12} />
        <YAxis stroke="rgb(156 163 175)" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgb(255 255 255)',
            border: '1px solid rgb(229 231 235)',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          }}
        />
        <Legend />
        <Bar dataKey="collected" fill="rgb(59 130 246)" radius={[4, 4, 0, 0]} name="Collected" />
        <Bar dataKey="due" fill="rgb(245 158 11)" radius={[4, 4, 0, 0]} name="Due" />
      </BarChart>
    </ResponsiveContainer>
  );
}
