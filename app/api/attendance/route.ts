import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const attendanceSchema = z.object({
  student_id: z.string(),
  date: z.string(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  school_id: z.string(),
  class_id: z.string().optional(),
  notes: z.string().optional(),
  marked_by: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('school_id');
    const date = searchParams.get('date');
    const classId = searchParams.get('class_id');

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    let query = supabase
      .from('attendance')
      .select('*, students(full_name, student_id, photo_url, gender), classes(name, code), sections(name, code)')
      .eq('school_id', schoolId)
      .order('date', { ascending: false });

    if (date) query = query.eq('date', date);
    if (classId) query = query.eq('class_id', classId);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = attendanceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('attendance')
      .upsert(validation.data, { onConflict: 'student_id,date' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
