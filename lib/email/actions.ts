'use server';

import { createClient } from '@supabase/supabase-js';
import { sendFeeReminderEmail, sendAttendanceAlertEmail } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Send fee reminder emails to parents of students with overdue payments
 * Call this from a scheduled job or manually trigger it
 */
export async function sendFeeReminders(schoolId: string) {
  // Get all overdue payments
  const { data: overduePayments, error: paymentsError } = await supabase
    .from('payments')
    .select(`
      *,
      students!inner (
        full_name,
        parent_id,
        email
      ),
      fees!inner (
        name,
        amount,
        due_date
      )
    `)
    .eq('school_id', schoolId)
    .in('status', ['pending', 'overdue'])
    .lte('fees.due_date', new Date().toISOString());

  if (paymentsError) {
    console.error('Error fetching overdue payments:', paymentsError);
    return { success: false, error: paymentsError.message };
  }

  // Get parent emails for overdue payments
  const { data: parents, error: parentsError } = await supabase
    .from('parents')
    .select('id, full_name, email')
    .eq('school_id', schoolId)
    .in(
      'id',
      overduePayments.map((p: any) => p.students.parent_id)
    );

  if (parentsError) {
    console.error('Error fetching parents:', parentsError);
    return { success: false, error: parentsError.message };
  }

  const parentEmails = new Map<string, string>();
  parents.forEach((parent: any) => {
    parentEmails.set(parent.id, parent.email);
  });

  let sent = 0;
  let failed = 0;

  // Send reminder emails
  for (const payment of overduePayments) {
    const parentEmail = parentEmails.get(payment.students.parent_id);
    if (!parentEmail) continue;

    const result = await sendFeeReminderEmail(
      parentEmail,
      payment.students.full_name,
      parseFloat(payment.fees.amount),
      new Date(payment.fees.due_date).toLocaleDateString()
    );

    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { success: true, sent, failed };
}

/**
 * Send attendance alert emails for students below 75% attendance
 * Call this from a scheduled job or manually trigger it
 */
export async function sendAttendanceAlerts(schoolId: string) {
  // Get students with low attendance in the last 30 days
  const { data: lowAttendanceStudents, error } = await supabase
    .from('students')
    .select(`
      id,
      full_name,
      email,
      parent_id,
      attendance!inner (
        status,
        date
      )
    `)
    .eq('school_id', schoolId)
    .gte('attendance.date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  if (error) {
    console.error('Error fetching attendance data:', error);
    return { success: false, error: error.message };
  }

  // Calculate attendance rates
  const attendanceRates = new Map<string, { rate: number; present: number; total: number }>();

  lowAttendanceStudents.forEach((student: any) => {
    const total = student.attendance.length;
    const present = student.attendance.filter(
      (a: any) => a.status === 'present' || a.status === 'late'
    ).length;
    const rate = total > 0 ? (present / total) * 100 : 100;

    attendanceRates.set(student.id, { rate, present, total });
  });

  // Get parent emails for low attendance students
  const { data: parents, error: parentsError } = await supabase
    .from('parents')
    .select('id, full_name, email')
    .eq('school_id', schoolId)
    .in(
      'id',
      lowAttendanceStudents
        .filter((s: any) => {
          const rate = attendanceRates.get(s.id)?.rate || 100;
          return rate < 75;
        })
        .map((s: any) => s.parent_id)
    );

  if (parentsError) {
    console.error('Error fetching parents:', parentsError);
    return { success: false, error: parentsError.message };
  }

  const parentEmails = new Map<string, string>();
  parents.forEach((parent: any) => {
    parentEmails.set(parent.id, parent.email);
  });

  let sent = 0;
  let failed = 0;

  // Send alert emails for students below 75%
  for (const student of lowAttendanceStudents) {
    const rate = attendanceRates.get(student.id);
    if (!rate || rate.rate >= 75) continue;

    const parentEmail = parentEmails.get(student.parent_id);
    if (!parentEmail) continue;

    const result = await sendAttendanceAlertEmail(
      parentEmail,
      student.full_name,
      Math.round(rate.rate)
    );

    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { success: true, sent, failed };
}

/**
 * Send a custom notification to all users in a school
 */
export async function sendSchoolAnnouncement(
  schoolId: string,
  title: string,
  message: string,
  type: 'announcement' | 'attendance' | 'academic' | 'fee' | 'assignment' | 'general' = 'announcement'
) {
  // Get all users in the school
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, full_name, email')
    .eq('school_id', schoolId);

  if (usersError) {
    console.error('Error fetching users:', usersError);
    return { success: false, error: usersError.message };
  }

  // Create in-app notifications
  const notifications = users.map((user: any) => ({
    school_id: schoolId,
    user_id: user.id,
    title,
    message,
    type,
    priority: type === 'announcement' ? 'high' : 'normal',
  }));

  const { error: notifError } = await supabase
    .from('notifications')
    .insert(notifications);

  if (notifError) {
    console.error('Error creating notifications:', notifError);
    return { success: false, error: notifError.message };
  }

  // Send email notifications
  let sent = 0;
  let failed = 0;

  for (const user of users) {
    if (!user.email) continue;

    const { sendEmail } = await import('@/lib/email');
    const result = await sendEmail({
      to: user.email,
      subject: `[StudentHub] ${title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">${title}</h2>
          <p>${message}</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/notifications" 
             style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
            View in Dashboard
          </a>
        </div>
      `,
    });

    if (result.success) sent++;
    else failed++;
  }

  return { success: true, sent, failed, usersCount: users.length };
}
