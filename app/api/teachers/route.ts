import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const schoolId = searchParams.get('school_id');
    const department = searchParams.get('department');
    const status = searchParams.get('status');

    if (!schoolId) return NextResponse.json({ error: 'School ID is required' }, { status: 400 });

    const offset = (page - 1) * limit;
    let query = supabase
      .from('teachers')
      .select('*', { count: 'exact' })
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    if (department) query = query.eq('department', department);
    if (status) query = query.eq('employment_status', status);

    const { data, error, count } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, count: count || 0, page, limit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { school_id, full_name, email, phone, qualification, department, subjects, joining_date, address, emergency_contact, salary_amount } = body;

    if (!school_id || !full_name || !email) {
      return NextResponse.json({ error: 'School ID, full name, and email are required' }, { status: 400 });
    }

    const { data: school } = await supabase.from('schools').select('code').eq('id', school_id).single();
    const year = new Date().getFullYear();
    const teacherId = `${school?.code || 'TCH'}-TCH-${year}-${String(Date.now()).slice(-6)}`;

    const { data, error } = await supabase
      .from('teachers')
      .insert({ teacher_id: teacherId, school_id, full_name, email, phone, qualification, department, subjects, joining_date: joining_date || new Date().toISOString().split('T')[0], address, emergency_contact, salary_amount })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    const body = await request.json();
    const { error } = await supabase.from('teachers').update(body).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Teacher updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    const { error } = await supabase.from('teachers').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
