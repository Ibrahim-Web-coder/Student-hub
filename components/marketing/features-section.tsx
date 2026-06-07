'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, DollarSign, MessageSquare, FileText, BarChart3, Bell, CheckCircle, Award, Brain, Shield } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Student Management',
    description: 'Complete student lifecycle management from admission to graduation with detailed profiles, documents, and academic history.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    icon: BookOpen,
    title: 'Academic Performance',
    description: 'Monitor grades, exams, and student progress in real time with comprehensive report cards and analytics.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/30',
  },
  {
    icon: Calendar,
    title: 'Attendance Tracking',
    description: 'Track student attendance with detailed analytics, automated reports, and early risk detection alerts.',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
  },
  {
    icon: DollarSign,
    title: 'Fee Management',
    description: 'Manage fee categories, monthly collections, due payments, receipts, and comprehensive revenue reports.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
  },
  {
    icon: MessageSquare,
    title: 'Parent Engagement',
    description: 'Keep parents informed through real-time notifications, performance reports, and direct messaging.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/30',
  },
  {
    icon: FileText,
    title: 'Assignment System',
    description: 'Create assignments, manage submissions, set due dates, attach files, and grade student work efficiently.',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/30',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'AI-powered insights on attendance trends, student growth, academic performance, and revenue collection.',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Automated alerts for attendance issues, upcoming deadlines, fee reminders, and important announcements.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/30',
  },
  {
    icon: CheckCircle,
    title: 'School Operations',
    description: 'Manage classes, schedules, teacher assignments, timetables with conflict detection, and resource allocation.',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
  },
  {
    icon: Award,
    title: 'Exam & Results',
    description: 'Complete exam management with GPA calculation, report card generation, and performance analytics.',
    color: 'text-violet-500',
    bgColor: 'bg-violet-50 dark:bg-violet-900/30',
  },
  {
    icon: Brain,
    title: 'AI Insights',
    description: 'AI-powered performance insights, attendance risk detection, progress summaries, and automated report generation.',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-900/30',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Row-level security, data encryption, role-based access control, and comprehensive activity logging.',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50 dark:bg-slate-900/30',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Run Your School
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed for modern educational institutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
