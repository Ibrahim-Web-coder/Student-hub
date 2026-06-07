import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('school_id');
    const classId = searchParams.get('class_id');
    const teacherId = searchParams.get('teacher_id');

    if (!schoolId) return NextResponse.json({ error: 'School ID required' }, { status: 400 });

    let query = supabase
      .from('assignments')
      .select('*, classes(name, code), subjects(name, code), teachers(full_name)')
      .eq('school_id', schoolId)
      .order('due_date', { ascending: false });

    if (classId) query = query.eq('class_id', classId);
    if (teacherId) query = query.eq('teacher_id', teacherId);

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
    const { data, error } = await supabase.from('assignments').insert(body).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
