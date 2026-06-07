import { createServerClient } from '@/lib/supabase/client';
import { cookies } from 'next/headers';
import { Database } from '@/lib/supabase/database.types';
import { revalidatePath } from 'next/cache';

function getSupabase() {
  const cookieStore = cookies();
  return createServerClient({
    get: (name: string) => cookieStore.get(name)?.value,
    set: (name: string, value: string, options: any) => {
      cookieStore.set({ name, value, ...options });
    },
    remove: (name: string, options: any) => {
      cookieStore.set({ name, value: '', ...options });
    },
  });
}

// =====================================================
// STUDENT ACTIONS
// =====================================================

export async function getStudents(schoolId: string, page: number = 1, limit: number = 20, search: string = '', filters: Record<string, any> = {}) {
  const supabase = getSupabase();
  const offset = (page - 1) * limit;

  let query = supabase
    .from('students')
    .select('*, classes(name, code), sections(name, code), parents(full_name, email, phone)', { count: 'exact' })
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,student_id.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (filters.class_id) {
    query = query.eq('class_id', filters.class_id);
  }

  if (filters.section_id) {
    query = query.eq('section_id', filters.section_id);
  }

  if (filters.academic_status) {
    query = query.eq('academic_status', filters.academic_status);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return { data, count: count || 0, page, limit };
}

export async function getStudentById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('students')
    .select('*, classes(name, code), sections(name, code), parents(full_name, email, phone), users(email, phone, avatar_url)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createStudent(input: Database['public']['Tables']['students']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('students')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/students');
  return data;
}

export async function updateStudent(id: string, input: Database['public']['Tables']['students']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('students')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/students');
  revalidatePath(`/dashboard/students/${id}`);
  return data;
}

export async function deleteStudent(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/students');
  return true;
}

// =====================================================
// TEACHER ACTIONS
// =====================================================

export async function getTeachers(schoolId: string, page: number = 1, limit: number = 20, search: string = '', filters: Record<string, any> = {}) {
  const supabase = getSupabase();
  const offset = (page - 1) * limit;

  let query = supabase
    .from('teachers')
    .select('*', { count: 'exact' })
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,teacher_id.ilike.%${search}%`);
  }

  if (filters.department) {
    query = query.eq('department', filters.department);
  }

  if (filters.employment_status) {
    query = query.eq('employment_status', filters.employment_status);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return { data, count: count || 0, page, limit };
}

export async function getTeacherById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('teachers')
    .select('*, users(email, phone, avatar_url)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createTeacher(input: Database['public']['Tables']['teachers']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('teachers')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/teachers');
  return data;
}

export async function updateTeacher(id: string, input: Database['public']['Tables']['teachers']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('teachers')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/teachers');
  return data;
}

export async function deleteTeacher(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/teachers');
  return true;
}

// =====================================================
// CLASS ACTIONS
// =====================================================

export async function getClasses(schoolId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('classes')
    .select('*, teachers(full_name), sections(id, name, code)')
    .eq('school_id', schoolId)
    .eq('is_active', true)
    .order('name');

  if (error) throw new Error(error.message);
  return data;
}

export async function getClassById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('classes')
    .select('*, teachers(full_name), sections(*)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createClass(input: Database['public']['Tables']['classes']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('classes')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/classes');
  return data;
}

export async function updateClass(id: string, input: Database['public']['Tables']['classes']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('classes')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/classes');
  return data;
}

export async function deleteClass(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/classes');
  return true;
}

// =====================================================
// SECTION ACTIONS
// =====================================================

export async function getSections(schoolId: string, classId?: string) {
  const supabase = getSupabase();
  let query = supabase
    .from('sections')
    .select('*, classes(name, code), teachers(full_name)')
    .eq('school_id', schoolId)
    .eq('is_active', true)
    .order('name');

  if (classId) {
    query = query.eq('class_id', classId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function createSection(input: Database['public']['Tables']['sections']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('sections')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/sections');
  return data;
}

export async function updateSection(id: string, input: Database['public']['Tables']['sections']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('sections')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/sections');
  return data;
}

export async function deleteSection(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/sections');
  return true;
}

// =====================================================
// SUBJECT ACTIONS
// =====================================================

export async function getSubjects(schoolId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('subjects')
    .select('*, teachers(full_name)')
    .eq('school_id', schoolId)
    .eq('is_active', true)
    .order('name');

  if (error) throw new Error(error.message);
  return data;
}

export async function createSubject(input: Database['public']['Tables']['subjects']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('subjects')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/subjects');
  return data;
}

export async function updateSubject(id: string, input: Database['public']['Tables']['subjects']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('subjects')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/subjects');
  return data;
}

export async function deleteSubject(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/subjects');
  return true;
}

// =====================================================
// ATTENDANCE ACTIONS
// =====================================================

export async function getAttendance(schoolId: string, date?: string, classId?: string) {
  const supabase = getSupabase();
  let query = supabase
    .from('attendance')
    .select('*, students(full_name, student_id, photo_url, gender), classes(name, code), sections(name, code), teachers(full_name)')
    .eq('school_id', schoolId);

  if (date) {
    query = query.eq('date', date);
  }

  if (classId) {
    query = query.eq('class_id', classId);
  }

  query = query.order('date', { ascending: false });

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function getAttendanceStats(schoolId: string, startDate?: string, endDate?: string) {
  const supabase = getSupabase();
  let query = supabase
    .from('attendance')
    .select('status')
    .eq('school_id', schoolId);

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const total = data.length;
  const present = data.filter(d => d.status === 'present').length;
  const absent = data.filter(d => d.status === 'absent').length;
  const late = data.filter(d => d.status === 'late').length;
  const excused = data.filter(d => d.status === 'excused').length;

  return {
    total,
    present,
    absent,
    late,
    excused,
    attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
  };
}

export async function markAttendance(input: Database['public']['Tables']['attendance']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('attendance')
    .upsert(input, { onConflict: 'student_id,date' })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/attendance');
  return data;
}

export async function bulkMarkAttendance(records: Database['public']['Tables']['attendance']['Insert'][]) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('attendance')
    .upsert(records, { onConflict: 'student_id,date' })
    .select();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/attendance');
  return data;
}

// =====================================================
// EXAM ACTIONS
// =====================================================

export async function getExams(schoolId: string, classId?: string) {
  const supabase = getSupabase();
  let query = supabase
    .from('exams')
    .select('*, classes(name, code), subjects(name, code)')
    .eq('school_id', schoolId)
    .order('exam_date', { ascending: false });

  if (classId) {
    query = query.eq('class_id', classId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function getExamById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('exams')
    .select('*, classes(name, code), subjects(name, code), results(students(full_name, student_id), marks_obtained, grade, gpa, percentage, remarks)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createExam(input: Database['public']['Tables']['exams']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('exams')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/exams');
  return data;
}

export async function updateExam(id: string, input: Database['public']['Tables']['exams']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('exams')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/exams');
  return data;
}

export async function deleteExam(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('exams')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/exams');
  return true;
}

// =====================================================
// RESULT ACTIONS
// =====================================================

export async function getResults(examId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('results')
    .select('*, students(full_name, student_id), exams(name, total_marks, exam_type)')
    .eq('exam_id', examId);

  if (error) throw new Error(error.message);
  return data;
}

export async function createResult(input: Database['public']['Tables']['results']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('results')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/exams');
  return data;
}

export async function updateResult(id: string, input: Database['public']['Tables']['results']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('results')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/exams');
  return data;
}

// =====================================================
// ASSIGNMENT ACTIONS
// =====================================================

export async function getAssignments(schoolId: string, classId?: string, teacherId?: string) {
  const supabase = getSupabase();
  let query = supabase
    .from('assignments')
    .select('*, classes(name, code), subjects(name, code), teachers(full_name)')
    .eq('school_id', schoolId)
    .order('due_date', { ascending: false });

  if (classId) {
    query = query.eq('class_id', classId);
  }

  if (teacherId) {
    query = query.eq('teacher_id', teacherId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function getAssignmentById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('assignments')
    .select('*, classes(name, code), subjects(name, code), teachers(full_name), submissions(students(full_name, student_id), submission_text, file_urls, submitted_at, status, grade, feedback)')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createAssignment(input: Database['public']['Tables']['assignments']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('assignments')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/assignments');
  return data;
}

export async function updateAssignment(id: string, input: Database['public']['Tables']['assignments']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('assignments')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/assignments');
  return data;
}

export async function deleteAssignment(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/assignments');
  return true;
}

// =====================================================
// SUBMISSION ACTIONS
// =====================================================

export async function getSubmissions(assignmentId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('submissions')
    .select('*, students(full_name, student_id, photo_url)')
    .eq('assignment_id', assignmentId);

  if (error) throw new Error(error.message);
  return data;
}

export async function createSubmission(input: Database['public']['Tables']['submissions']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('submissions')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/assignments');
  return data;
}

export async function updateSubmission(id: string, input: Database['public']['Tables']['submissions']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('submissions')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/assignments');
  return data;
}

// =====================================================
// FEE ACTIONS
// =====================================================

export async function getFees(schoolId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('fees')
    .select('*')
    .eq('school_id', schoolId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createFee(input: Database['public']['Tables']['fees']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('fees')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/fees');
  return data;
}

export async function updateFee(id: string, input: Database['public']['Tables']['fees']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('fees')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/fees');
  return data;
}

export async function deleteFee(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('fees')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/fees');
  return true;
}

// =====================================================
// PAYMENT ACTIONS
// =====================================================

export async function getPayments(schoolId: string, studentId?: string) {
  const supabase = getSupabase();
  let query = supabase
    .from('payments')
    .select('*, fees(name, category, amount), students(full_name, student_id)')
    .eq('school_id', schoolId)
    .order('payment_date', { ascending: false });

  if (studentId) {
    query = query.eq('student_id', studentId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function getPaymentStats(schoolId: string) {
  const supabase = getSupabase();

  const { data: total, error: err1 } = await supabase
    .from('payments')
    .select('amount_paid, amount_due, status')
    .eq('school_id', schoolId);

  if (err1) throw new Error(err1.message);

  const totalCollected = total?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0;
  const totalDue = total?.reduce((sum, p) => sum + Number(p.amount_due), 0) || 0;
  const paid = total?.filter(p => p.status === 'paid').length || 0;
  const pending = total?.filter(p => p.status === 'pending').length || 0;
  const overdue = total?.filter(p => p.status === 'overdue').length || 0;
  const partial = total?.filter(p => p.status === 'partial').length || 0;

  return { totalCollected, totalDue, paid, pending, overdue, partial, totalRecords: total?.length || 0 };
}

export async function createPayment(input: Database['public']['Tables']['payments']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('payments')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/fees');
  return data;
}

export async function updatePayment(id: string, input: Database['public']['Tables']['payments']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('payments')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/fees');
  return data;
}

// =====================================================
// NOTIFICATION ACTIONS
// =====================================================

export async function getNotifications(userId: string, schoolId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return data;
}

export async function createNotification(input: Database['public']['Tables']['notifications']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('notifications')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/notifications');
  return data;
}

export async function markNotificationRead(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/notifications');
  return true;
}

// =====================================================
// MESSAGE ACTIONS
// =====================================================

export async function getMessages(userId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:sender_id(full_name, avatar_url), receiver:receiver_id(full_name, avatar_url)')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function sendMessage(input: Database['public']['Tables']['messages']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('messages')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function markMessageRead(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('messages')
    .update({ status: 'read', read_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}

// =====================================================
// TIMETABLE ACTIONS
// =====================================================

export async function getTimetable(classId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('timetables')
    .select('*, subjects(name, code), teachers(full_name)')
    .eq('class_id', classId)
    .eq('is_active', true)
    .order('day_of_week')
    .order('start_time');

  if (error) throw new Error(error.message);
  return data;
}

export async function createTimetable(input: Database['public']['Tables']['timetables']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('timetables')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/timetables');
  return data;
}

export async function updateTimetable(id: string, input: Database['public']['Tables']['timetables']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('timetables')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/timetables');
  return data;
}

export async function deleteTimetable(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('timetables')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/timetables');
  return true;
}

// =====================================================
// SCHOOL ACTIONS
// =====================================================

export async function getSchoolById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateSchool(id: string, input: Database['public']['Tables']['schools']['Update']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('schools')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/settings');
  return data;
}

export async function createSchool(input: Database['public']['Tables']['schools']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('schools')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// =====================================================
// ANALYTICS ACTIONS
// =====================================================

export async function getDashboardStats(schoolId: string) {
  const supabase = getSupabase();

  const [studentsRes, teachersRes, classesRes, attendanceRes, paymentsRes, assignmentsRes] = await Promise.all([
    supabase.from('students').select('id, academic_status', { count: 'exact', head: false }).eq('school_id', schoolId),
    supabase.from('teachers').select('id, employment_status', { count: 'exact', head: false }).eq('school_id', schoolId),
    supabase.from('classes').select('id, is_active', { count: 'exact', head: false }).eq('school_id', schoolId),
    supabase.from('attendance').select('status, date').eq('school_id', schoolId).gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    supabase.from('payments').select('amount_paid, status').eq('school_id', schoolId),
    supabase.from('assignments').select('id', { count: 'exact', head: false }).eq('school_id', schoolId),
  ]);

  const totalStudents = studentsRes.data?.length || 0;
  const totalTeachers = teachersRes.data?.length || 0;
  const totalClasses = classesRes.data?.length || 0;
  const totalAssignments = assignmentsRes.count || 0;

  const totalCollected = paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount_paid), 0) || 0;
  const totalDue = paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount_due), 0) || 0;
  const attendanceRecords = attendanceRes.data || [];
  const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
  const attendanceRate = attendanceRecords.length > 0 ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;

  return {
    totalStudents,
    totalTeachers,
    totalClasses,
    totalAssignments,
    totalCollected,
    totalDue,
    attendanceRate,
  };
}

export async function getAttendanceTrend(schoolId: string, months: number = 6) {
  const supabase = getSupabase();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data, error } = await supabase
    .from('attendance')
    .select('date, status')
    .eq('school_id', schoolId)
    .gte('date', startDate.toISOString().split('T')[0]);

  if (error) throw new Error(error.message);

  const monthlyData: Record<string, { present: number; total: number }> = {};

  data?.forEach(record => {
    const month = record.date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { present: 0, total: 0 };
    }
    monthlyData[month].total++;
    if (record.status === 'present' || record.status === 'late') {
      monthlyData[month].present++;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, stats]) => ({
      month,
      rate: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0,
      total: stats.total,
      present: stats.present,
    }));
}

export async function getRevenueTrend(schoolId: string, months: number = 6) {
  const supabase = getSupabase();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const { data, error } = await supabase
    .from('payments')
    .select('amount_paid, payment_date, status')
    .eq('school_id', schoolId)
    .gte('payment_date', startDate.toISOString());

  if (error) throw new Error(error.message);

  const monthlyData: Record<string, { collected: number; due: number }> = {};

  data?.forEach(record => {
    const month = new Date(record.payment_date).toISOString().substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { collected: 0, due: 0 };
    }
    monthlyData[month].collected += Number(record.amount_paid);
    monthlyData[month].due += Number(record.amount_due);
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, stats]) => ({
      month,
      collected: stats.collected,
      due: stats.due,
    }));
}

// =====================================================
// SEARCH ACTIONS
// =====================================================

export async function globalSearch(schoolId: string, query: string) {
  const supabase = getSupabase();

  const [students, teachers, classes] = await Promise.all([
    supabase.from('students').select('id, full_name, student_id, class_id').eq('school_id', schoolId).ilike('full_name', `%${query}%`).limit(10),
    supabase.from('teachers').select('id, full_name, email, department').eq('school_id', schoolId).ilike('full_name', `%${query}%`).limit(10),
    supabase.from('classes').select('id, name, code').eq('school_id', schoolId).ilike('name', `%${query}%`).limit(10),
  ]);

  return {
    students: students.data || [],
    teachers: teachers.data || [],
    classes: classes.data || [],
  };
}

// =====================================================
// FILE MANAGEMENT ACTIONS
// =====================================================

export async function getFiles(schoolId: string, entityType?: string, entityId?: string) {
  const supabase = getSupabase();
  let query = supabase
    .from('files')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false });

  if (entityType) {
    query = query.eq('entity_type', entityType);
  }

  if (entityId) {
    query = query.eq('entity_id', entityId);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data;
}

export async function createFileRecord(input: Database['public']['Tables']['files']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('files')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// =====================================================
// ACTIVITY LOG ACTIONS
// =====================================================

export async function logActivity(input: Database['public']['Tables']['activity_logs']['Insert']) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('activity_logs')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getActivityLogs(schoolId: string, limit: number = 50) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*, users(full_name, role)')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}
