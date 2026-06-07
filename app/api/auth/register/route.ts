import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  school_name: z.string().min(2, 'School name is required'),
  school_code: z.string().min(2, 'School code is required').max(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { full_name, email, password, school_name, school_code } = validation.data;

    const { data: existingSchool } = await supabase
      .from('schools')
      .select('id')
      .eq('code', school_code.toUpperCase())
      .single();

    if (existingSchool) {
      return NextResponse.json(
        { error: 'School code already exists' },
        { status: 409 }
      );
    }

    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert({
        name: school_name,
        code: school_code.toUpperCase(),
        email: email,
      })
      .select()
      .single();

    if (schoolError) {
      return NextResponse.json(
        { error: schoolError.message },
        { status: 500 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      },
    });

    if (authError) {
      await supabase.from('schools').delete().eq('id', school.id);
      return NextResponse.json(
        { error: authError.message },
        { status: 500 }
      );
    }

    const { error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user?.id,
        email,
        full_name,
        role: 'school_manager',
        school_id: school.id,
      });

    if (userError) {
      await supabase.from('schools').delete().eq('id', school.id);
      await supabase.auth.admin.deleteUser(authData.user?.id || '');
      return NextResponse.json(
        { error: userError.message },
        { status: 500 }
      );
    }

    // Send welcome email asynchronously (non-blocking)
    if (process.env.RESEND_API_KEY) {
      import('@/lib/email').then(({ sendWelcomeEmail }) => {
        sendWelcomeEmail(email, full_name, school_name).catch((err) => {
          console.error('Welcome email failed:', err);
        });
      });
    }

    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      school_id: school.id,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
