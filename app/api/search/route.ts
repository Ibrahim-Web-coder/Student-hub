import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const schoolId = searchParams.get('school_id');

    if (!query || !schoolId) {
      return NextResponse.json({ error: 'Query and school_id required' }, { status: 400 });
    }

    const [students, teachers, classes, subjects, fees] = await Promise.all([
      supabase
        .from('students')
        .select('id, full_name, student_id, class_id, photo_url')
        .eq('school_id', schoolId)
        .ilike('full_name', `%${query}%`)
        .limit(10),
      supabase
        .from('teachers')
        .select('id, full_name, email, department, photo_url')
        .eq('school_id', schoolId)
        .ilike('full_name', `%${query}%`)
        .limit(10),
      supabase
        .from('classes')
        .select('id, name, code')
        .eq('school_id', schoolId)
        .ilike('name', `%${query}%`)
        .limit(10),
      supabase
        .from('subjects')
        .select('id, name, code')
        .eq('school_id', schoolId)
        .ilike('name', `%${query}%`)
        .limit(10),
      supabase
        .from('fees')
        .select('id, name, category, amount')
        .eq('school_id', schoolId)
        .ilike('name', `%${query}%`)
        .limit(10),
    ]);

    return NextResponse.json({
      students: students.data || [],
      teachers: teachers.data || [],
      classes: classes.data || [],
      subjects: subjects.data || [],
      fees: fees.data || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
