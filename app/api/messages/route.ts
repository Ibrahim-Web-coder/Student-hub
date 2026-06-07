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

    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    let query = supabase
      .from('messages')
      .select(`
        *,
        sender:users!sender_id(full_name, avatar_url),
        receiver:users!receiver_id(full_name, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (schoolId) query = query.eq('school_id', schoolId);

    const { data, error } = await query;
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
      .from('messages')
      .insert(body)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Send in-app notification to receiver
    await supabase.from('notifications').insert({
      user_id: body.receiver_id,
      school_id: body.school_id,
      title: 'New Message',
      message: `You have a new message from ${body.sender_name || 'someone'}`,
      type: 'general',
      priority: 'normal',
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
