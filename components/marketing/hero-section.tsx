'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, BarChart3, Shield, Globe, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:via-gray-950 dark:to-gray-950" />
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>The Future of School Management</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              Manage Your Entire School From{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                One Intelligent Platform
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Attendance, Results, Communication, Fees, Timetables, Assignments, Analytics, and Parent Engagement—all in one secure platform.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Book Demo
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-500" />
                Enterprise Security
              </span>
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                99.9% Uptime
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                10K+ Schools
              </span>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 lg:mt-20 relative"
          >
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/5 p-2">
              <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-gray-400">app.studenthub.io/control-center</span>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div className="col-span-3 h-64 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-gray-100 dark:border-gray-800 flex items-center justify-center">
                    <BarChart3 className="w-16 h-16 text-blue-500/20" />
                  </div>
                  <div className="col-span-1 space-y-3">
                    <div className="h-20 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="h-20 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
