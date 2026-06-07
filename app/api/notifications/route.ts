import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const schoolId = searchParams.get('school_id');

    if (!userId || !schoolId) {
      return NextResponse.json({ error: 'User ID and School ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*, users(full_name)')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('notifications')
      .insert(body)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Send email notification if user has email notifications enabled
    if (body.user_id && body.type !== 'general') {
      const { data: user } = await supabase
        .from('users')
        .select('email, notification_email')
        .eq('id', body.user_id)
        .single();

      if (user?.email && user?.notification_email !== false) {
        const { sendEmail } = await import('@/lib/email');
        await sendEmail({
          to: user.email,
          subject: body.title,
          html: `<p>${body.message}</p>`,
        });
      }
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Notification marked as read' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Notification deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
