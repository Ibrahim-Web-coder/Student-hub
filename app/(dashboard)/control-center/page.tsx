import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { getUser } from '@/lib/supabase/auth';
import { getDashboardStats } from '@/lib/supabase/actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/dashboard/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { UpcomingEvents } from '@/components/dashboard/upcoming-events';
import { AIInsights } from '@/components/dashboard/ai-insights';
import {
  Users,
  UserCheck,
  GraduationCap,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ControlCenterPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  if (!user.school_id) {
    redirect('/onboarding');
  }

  const stats = await getDashboardStats(user.school_id);
  const attendanceTrend = await (async () => {
    try {
      const { getAttendanceTrend } = await import('@/lib/supabase/actions');
      return await getAttendanceTrend(user.school_id);
    } catch {
      return [];
    }
  })();
  const revenueTrend = await (async () => {
    try {
      const { getRevenueTrend } = await import('@/lib/supabase/actions');
      return await getRevenueTrend(user.school_id);
    } catch {
      return [];
    }
  })();

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toString(),
      change: 'Active enrollments',
      icon: Users,
      color: 'blue',
      href: '/dashboard/students',
    },
    {
      title: 'Teachers',
      value: stats.totalTeachers.toString(),
      change: 'Active staff',
      icon: UserCheck,
      color: 'purple',
      href: '/dashboard/teachers',
    },
    {
      title: 'Classes',
      value: stats.totalClasses.toString(),
      change: 'Active classes',
      icon: GraduationCap,
      color: 'emerald',
      href: '/dashboard/classes',
    },
    {
      title: 'Attendance Rate',
      value: `${stats.attendanceRate}%`,
      change: 'Last 30 days',
      icon: CalendarCheck,
      color: 'amber',
      href: '/dashboard/attendance',
    },
    {
      title: 'Revenue Collected',
      value: `$${stats.totalCollected.toLocaleString()}`,
      change: 'This academic year',
      icon: DollarSign,
      color: 'green',
      href: '/dashboard/fees',
    },
    {
      title: 'Assignments',
      value: stats.totalAssignments.toString(),
      change: 'Total created',
      icon: Award,
      color: 'indigo',
      href: '/dashboard/assignments',
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Control Center
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Welcome back, {user.full_name}. Here is what is happening at your school today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href} className="block">
            <StatCard
              title={card.title}
              value={card.value}
              change={card.change}
              icon={card.icon}
              color={card.color}
            />
          </Link>
        ))}
      </div>

      <div className="mb-8">
        <AIInsights
          attendanceRate={stats.attendanceRate}
          totalStudents={stats.totalStudents}
          revenueDue={stats.totalDue}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Attendance Trends" description="Monthly attendance rate over the past 6 months">
          <AttendanceChart data={attendanceTrend} />
        </Card>
        <Card title="Revenue Collection" description="Monthly fee collection trends">
          <RevenueChart data={revenueTrend} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity schoolId={user.school_id} />
        </div>
        <div>
          <UpcomingEvents schoolId={user.school_id} />
        </div>
      </div>
    </DashboardLayout>
  );
}
