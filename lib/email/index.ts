import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'StudentHub <onboarding@resend.dev>';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Email send failed:', error.message);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(to: string, fullName: string, schoolName: string) {
  return sendEmail({
    to,
    subject: 'Welcome to StudentHub!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #3B82F6, #6366F1); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px;">
          <div style="background: white; width: 48px; height: 48px; border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #3B82F6; font-size: 24px; font-weight: 800;">S</span>
          </div>
          <h1 style="color: white; font-size: 28px; margin: 0 0 8px;">Welcome to StudentHub</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0;">Your intelligent school management platform</p>
        </div>

        <h2 style="color: #1f2937; font-size: 20px; margin: 0 0 16px;">Hello ${fullName}!</h2>
        
        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Your school <strong style="color: #1f2937;">${schoolName}</strong> has been successfully set up on StudentHub.
          You can now start managing your entire school from one intelligent platform.
        </p>

        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
          <h3 style="color: #1f2937; font-size: 16px; margin: 0 0 16px;">Quick Start Checklist:</h3>
          <ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px; line-height: 2;">
            <li>Add your first student</li>
            <li>Set up classes and sections</li>
            <li>Configure your school settings</li>
            <li>Invite teachers to the platform</li>
            <li>Set up fee categories</li>
          </ul>
        </div>

        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/control-center" 
             style="display: inline-block; background: #3B82F6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;">
            Go to Control Center →
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
          This email was sent by StudentHub. If you did not create an account, please ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendFeeReminderEmail(to: string, studentName: string, amount: number, dueDate: string) {
  return sendEmail({
    to,
    subject: `Fee Reminder: ${studentName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #f59e0b; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <h1 style="color: white; font-size: 24px; margin: 0;">Fee Payment Reminder</h1>
        </div>

        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Dear Parent,
        </p>

        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          This is a friendly reminder that the fee payment for <strong style="color: #1f2937;">${studentName}</strong> 
          is due on <strong style="color: #1f2937;">${dueDate}</strong>.
        </p>

        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Amount Due</p>
          <p style="color: #1f2937; font-size: 32px; font-weight: 700; margin: 0;">$${amount.toFixed(2)}</p>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/fees" 
             style="display: inline-block; background: #3B82F6; color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 600;">
            Make Payment →
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
          StudentHub - Intelligent School Management Platform
        </p>
      </div>
    `,
  });
}

export async function sendAttendanceAlertEmail(to: string, studentName: string, attendanceRate: number) {
  return sendEmail({
    to,
    subject: `Attendance Alert: ${studentName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #ef4444; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <h1 style="color: white; font-size: 24px; margin: 0;">Attendance Alert</h1>
        </div>

        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
          Dear Parent,
        </p>

        <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          We wanted to inform you that <strong style="color: #1f2937;">${studentName}</strong>'s 
          current attendance rate has dropped to <strong style="color: #ef4444;">${attendanceRate}%</strong>.
          This is below the recommended threshold of 80%.
        </p>

        <div style="background: #fef2f2; border-radius: 12px; padding: 24px; margin-bottom: 32px; border-left: 4px solid #ef4444;">
          <p style="color: #991b1b; font-size: 14px; margin: 0; font-weight: 500;">
            ⚠️ Regular attendance is crucial for academic success. Please contact the school if there are any concerns.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
          StudentHub - Intelligent School Management Platform
        </p>
      </div>
    `,
  });
}
