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
    const studentId = searchParams.get('student_id');

    if (!schoolId) return NextResponse.json({ error: 'School ID required' }, { status: 400 });

    let query = supabase
      .from('payments')
      .select('*, fees(name, category, amount), students(full_name, student_id)')
      .eq('school_id', schoolId)
      .order('payment_date', { ascending: false });

    if (studentId) query = query.eq('student_id', studentId);

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
    const { school_id } = body;

    const { data: countData } = await supabase
      .from('payments')
      .select('receipt_number', { count: 'exact' })
      .eq('school_id', school_id);

    const receiptNum = `${countData?.length || 0 + 1}`.padStart(6, '0');
    body.receipt_number = `RC-${receiptNum}`;

    const { data, error } = await supabase.from('payments').insert(body).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
