import { NextResponse } from 'next/server';
import { sendWelcomeEmail, sendFeeReminderEmail, sendAttendanceAlertEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { type, to, ...params } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    switch (type) {
      case 'welcome':
        const welcomeResult = await sendWelcomeEmail(
          to,
          params.fullName || 'User',
          params.schoolName || 'Your School'
        );
        return NextResponse.json(welcomeResult);

      case 'fee_reminder':
        const feeResult = await sendFeeReminderEmail(
          to,
          params.studentName || 'Student',
          params.amount || 0,
          params.dueDate || 'TBD'
        );
        return NextResponse.json(feeResult);

      case 'attendance_alert':
        const attendanceResult = await sendAttendanceAlertEmail(
          to,
          params.studentName || 'Student',
          params.attendanceRate || 0
        );
        return NextResponse.json(attendanceResult);

      default:
        return NextResponse.json(
          { error: 'Invalid email type. Use: welcome, fee_reminder, or attendance_alert' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
