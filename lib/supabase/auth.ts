import { createServerClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient({
    get: (name: string) => cookieStore.get(name)?.value,
    set: (name: string, value: string, options: any) => {
      cookieStore.set({ name, value, ...options });
    },
    remove: (name: string, options: any) => {
      cookieStore.set({ name, value: '', ...options });
    },
  });

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null;
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*, schools(*)')
    .eq('auth_id', session.user.id)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireAuth(redirectTo: string = '/login') {
  const user = await getUser();
  
  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireRole(allowedRoles: string[], redirectTo: string = '/login') {
  const user = await requireAuth(redirectTo);

  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }

  return user;
}

export async function requireSchoolAccess(redirectTo: string = '/login') {
  const user = await requireAuth(redirectTo);

  if (!user.school_id) {
    redirect('/onboarding');
  }

  return user;
}
