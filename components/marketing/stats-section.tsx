'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

export function StatsSection() {
  const stats = [
    { icon: Users, label: 'Active Students', value: '150K+', description: 'Across all platforms' },
    { icon: BookOpen, label: 'Schools', value: '2,500+', description: 'Trusted institutions' },
    { icon: TrendingUp, label: 'Attendance Rate', value: '96.5%', description: 'Average improvement' },
    { icon: Award, label: 'Satisfaction', value: '4.9/5', description: 'User rating' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 mb-4">
                <stat.icon className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
