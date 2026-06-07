import { z } from 'zod';

// Student validation
export const studentSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  gender: z.enum(['male', 'female', 'other']),
  date_of_birth: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  class_id: z.string().optional(),
  section_id: z.string().optional(),
  parent_id: z.string().optional(),
  blood_group: z.string().optional(),
  emergency_contact: z.string().optional(),
  medical_notes: z.string().optional(),
});

// Teacher validation
export const teacherSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  qualification: z.string().optional(),
  department: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  joining_date: z.string(),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  salary_amount: z.number().optional(),
});

// Class validation
export const classSchema = z.object({
  name: z.string().min(2, 'Class name is required'),
  code: z.string().min(2, 'Class code is required'),
  capacity: z.number().min(1).max(100),
  teacher_id: z.string().optional(),
  academic_year: z.string().optional(),
  description: z.string().optional(),
});

// Section validation
export const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  code: z.string().min(1, 'Section code is required'),
  class_id: z.string(),
  capacity: z.number().min(1).max(50),
  teacher_id: z.string().optional(),
  room_number: z.string().optional(),
});

// Subject validation
export const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name is required'),
  code: z.string().min(2, 'Subject code is required'),
  description: z.string().optional(),
  teacher_id: z.string().optional(),
  class_ids: z.array(z.string()).optional(),
});

// Attendance validation
export const attendanceSchema = z.object({
  student_id: z.string(),
  date: z.string(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  check_in_time: z.string().optional(),
  check_out_time: z.string().optional(),
  notes: z.string().optional(),
});

// Exam validation
export const examSchema = z.object({
  name: z.string().min(2, 'Exam name is required'),
  exam_type: z.enum(['midterm', 'final', 'quiz', 'test', 'practical']),
  class_id: z.string(),
  subject_id: z.string().optional(),
  total_marks: z.number().min(1),
  passing_marks: z.number().optional(),
  exam_date: z.string(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  duration_minutes: z.number().optional(),
  instructions: z.string().optional(),
});

// Assignment validation
export const assignmentSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  class_id: z.string(),
  subject_id: z.string().optional(),
  teacher_id: z.string(),
  due_date: z.string(),
  total_points: z.number().min(0).max(100).default(100),
  assignment_type: z.string().default('homework'),
  attachment_urls: z.array(z.string()).optional(),
});

// Fee validation
export const feeSchema = z.object({
  name: z.string().min(2, 'Fee name is required'),
  category: z.string().min(2, 'Category is required'),
  amount: z.number().min(0),
  description: z.string().optional(),
  due_date: z.string().optional(),
  recurring: z.boolean().default(false),
  recurrence_period: z.string().optional(),
});

// Payment validation
export const paymentSchema = z.object({
  fee_id: z.string(),
  student_id: z.string(),
  amount_paid: z.number().min(0),
  amount_due: z.number().min(0),
  payment_method: z.string().optional(),
  transaction_id: z.string().optional(),
  notes: z.string().optional(),
});

// Notification validation
export const notificationSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['announcement', 'attendance', 'academic', 'fee', 'assignment', 'general']),
  user_id: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  scheduled_at: z.string().optional(),
  expires_at: z.string().optional(),
});

// Message validation
export const messageSchema = z.object({
  receiver_id: z.string(),
  content: z.string().min(1, 'Message content is required'),
  attachment_urls: z.array(z.string()).optional(),
});

// Timetable validation
export const timetableSchema = z.object({
  class_id: z.string(),
  section_id: z.string().optional(),
  subject_id: z.string(),
  teacher_id: z.string(),
  day_of_week: z.number().min(1).max(7),
  start_time: z.string(),
  end_time: z.string(),
  room_number: z.string().optional(),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.start_time}`);
  const end = new Date(`1970-01-01T${data.end_time}`);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

// School validation
export const schoolSchema = z.object({
  name: z.string().min(2, 'School name is required'),
  code: z.string().min(2, 'School code is required').regex(/^[A-Z0-9]{2,10}$/, 'Code must be 2-10 uppercase letters or numbers'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  academic_year_start: z.string().optional(),
  academic_year_end: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
});

// User validation
export const userSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  role: z.enum(['platform_owner', 'school_manager', 'teacher', 'student', 'parent']),
  school_id: z.string().optional(),
});
