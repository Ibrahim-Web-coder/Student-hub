-- =====================================================
-- STUDENTHUB - COMPLETE DATABASE QUERIES REFERENCE
-- =====================================================
-- All queries used across the application organized by module
-- =====================================================

-- =====================================================
-- 1. AUTHENTICATION QUERIES
-- =====================================================

-- Get user profile after login
SELECT u.*, s.* 
FROM users u 
LEFT JOIN schools s ON u.school_id = s.id 
WHERE u.auth_id = $1;

-- Create school during registration
INSERT INTO schools (name, code, email) 
VALUES ($1, $2, $3) 
RETURNING *;

-- Create user during registration
INSERT INTO users (auth_id, email, full_name, role, school_id) 
VALUES ($1, $2, $3, 'school_manager', $4) 
RETURNING *;

-- Update last login
UPDATE users 
SET last_login_at = NOW() 
WHERE auth_id = $1;

-- Check if school code exists
SELECT id FROM schools WHERE code = $1;

-- =====================================================
-- 2. STUDENT QUERIES
-- =====================================================

-- Get all students with pagination and search
SELECT s.*, c.name as class_name, c.code as class_code, 
       sec.name as section_name, sec.code as section_code,
       p.full_name as parent_name, p.email as parent_email
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN sections sec ON s.section_id = sec.id
LEFT JOIN parents p ON s.parent_id = p.id
WHERE s.school_id = $1
  AND (
    $2::text IS NULL OR 
    s.full_name ILIKE '%' || $2 || '%' OR 
    s.student_id ILIKE '%' || $2 || '%' OR 
    s.email ILIKE '%' || $2 || '%'
  )
  AND ($3::uuid IS NULL OR s.class_id = $3)
  AND ($4::uuid IS NULL OR s.section_id = $4)
  AND ($5::academic_status IS NULL OR s.academic_status = $5)
ORDER BY s.created_at DESC
LIMIT $6 OFFSET $7;

-- Get student count for pagination
SELECT COUNT(*) 
FROM students 
WHERE school_id = $1;

-- Get single student by ID
SELECT s.*, c.name as class_name, c.code as class_code,
       sec.name as section_name, sec.code as section_code,
       p.full_name as parent_name, p.email as parent_email, p.phone as parent_phone,
       u.email as user_email, u.phone as user_phone, u.avatar_url as user_avatar
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN sections sec ON s.section_id = sec.id
LEFT JOIN parents p ON s.parent_id = p.id
LEFT JOIN users u ON s.user_id = u.id
WHERE s.id = $1;

-- Create student
INSERT INTO students (
  student_id, school_id, full_name, gender, date_of_birth,
  address, city, state, country, phone, email,
  class_id, section_id, parent_id, admission_date,
  blood_group, emergency_contact, medical_notes, user_id
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
) RETURNING *;

-- Update student
UPDATE students 
SET full_name = $1, gender = $2, date_of_birth = $3,
    address = $4, city = $5, state = $6, country = $7,
    phone = $8, email = $9, class_id = $10, section_id = $11,
    parent_id = $12, blood_group = $13, emergency_contact = $14,
    medical_notes = $15, academic_status = $16
WHERE id = $17 
RETURNING *;

-- Delete student
DELETE FROM students WHERE id = $1;

-- Generate student ID
SELECT generate_student_id($1, $2);

-- Get students by class
SELECT * FROM students WHERE class_id = $1 AND school_id = $2;

-- Get students with attendance stats
SELECT s.*, 
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
  COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_days
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
WHERE s.school_id = $1
GROUP BY s.id;

-- =====================================================
-- 3. TEACHER QUERIES
-- =====================================================

-- Get all teachers with pagination
SELECT t.*, u.email as user_email, u.avatar_url as user_avatar
FROM teachers t
LEFT JOIN users u ON t.user_id = u.id
WHERE t.school_id = $1
  AND (
    $2::text IS NULL OR 
    t.full_name ILIKE '%' || $2 || '%' OR 
    t.email ILIKE '%' || $2 || '%' OR 
    t.teacher_id ILIKE '%' || $2 || '%'
  )
  AND ($3::text IS NULL OR t.department = $3)
  AND ($4::academic_status IS NULL OR t.employment_status = $4)
ORDER BY t.created_at DESC
LIMIT $5 OFFSET $6;

-- Get teacher count
SELECT COUNT(*) FROM teachers WHERE school_id = $1;

-- Get teacher by ID
SELECT t.*, u.email as user_email, u.phone as user_phone, u.avatar_url as user_avatar
FROM teachers t
LEFT JOIN users u ON t.user_id = u.id
WHERE t.id = $1;

-- Create teacher
INSERT INTO teachers (
  teacher_id, school_id, full_name, email, phone,
  qualification, department, subjects, joining_date,
  employment_status, address, emergency_contact, salary_amount, user_id
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
) RETURNING *;

-- Update teacher
UPDATE teachers 
SET full_name = $1, email = $2, phone = $3, qualification = $4,
    department = $5, subjects = $6, employment_status = $7,
    address = $8, emergency_contact = $9, salary_amount = $10
WHERE id = $11 
RETURNING *;

-- Delete teacher
DELETE FROM teachers WHERE id = $1;

-- Get teachers by department
SELECT * FROM teachers WHERE department = $1 AND school_id = $2;

-- Get teacher schedule
SELECT t.*, 
  json_agg(json_build_object(
    'day', tt.day_of_week,
    'start_time', tt.start_time,
    'end_time', tt.end_time,
    'subject', s.name,
    'class', c.name
  )) as schedule
FROM teachers t
LEFT JOIN timetables tt ON t.id = tt.teacher_id
LEFT JOIN subjects s ON tt.subject_id = s.id
LEFT JOIN classes c ON tt.class_id = c.id
WHERE t.id = $1
GROUP BY t.id;

-- =====================================================
-- 4. CLASS QUERIES
-- =====================================================

-- Get all classes
SELECT c.*, t.full_name as teacher_name
FROM classes c
LEFT JOIN teachers t ON c.teacher_id = t.id
WHERE c.school_id = $1 
  AND c.is_active = true
ORDER BY c.name;

-- Get class by ID
SELECT c.*, t.full_name as teacher_name
FROM classes c
LEFT JOIN teachers t ON c.teacher_id = t.id
WHERE c.id = $1;

-- Create class
INSERT INTO classes (
  school_id, name, code, capacity, teacher_id,
  academic_year, description, is_active
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
) RETURNING *;

-- Update class
UPDATE classes 
SET name = $1, code = $2, capacity = $3, teacher_id = $4,
    academic_year = $5, description = $6, is_active = $7
WHERE id = $8 
RETURNING *;

-- Delete class
DELETE FROM classes WHERE id = $1;

-- Get class with student count
SELECT c.*, COUNT(s.id) as student_count
FROM classes c
LEFT JOIN students s ON c.id = s.class_id
WHERE c.school_id = $1
GROUP BY c.id;

-- =====================================================
-- 5. SECTION QUERIES
-- =====================================================

-- Get all sections
SELECT s.*, c.name as class_name, c.code as class_code, t.full_name as teacher_name
FROM sections s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN teachers t ON s.teacher_id = t.id
WHERE s.school_id = $1 
  AND s.is_active = true
ORDER BY s.name;

-- Get sections by class
SELECT s.*, t.full_name as teacher_name
FROM sections s
LEFT JOIN teachers t ON s.teacher_id = t.id
WHERE s.class_id = $1 AND s.is_active = true;

-- Create section
INSERT INTO sections (
  school_id, class_id, name, code, capacity,
  teacher_id, room_number, is_active
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
) RETURNING *;

-- Update section
UPDATE sections 
SET name = $1, code = $2, capacity = $3, teacher_id = $4,
    room_number = $5, is_active = $6
WHERE id = $7 
RETURNING *;

-- Delete section
DELETE FROM sections WHERE id = $1;

-- =====================================================
-- 6. SUBJECT QUERIES
-- =====================================================

-- Get all subjects
SELECT s.*, t.full_name as teacher_name
FROM subjects s
LEFT JOIN teachers t ON s.teacher_id = t.id
WHERE s.school_id = $1 
  AND s.is_active = true
ORDER BY s.name;

-- Create subject
INSERT INTO subjects (
  school_id, name, code, description, teacher_id,
  class_ids, is_active
) VALUES (
  $1, $2, $3, $4, $5, $6, $7
) RETURNING *;

-- Update subject
UPDATE subjects 
SET name = $1, code = $2, description = $3, teacher_id = $4,
    class_ids = $5, is_active = $6
WHERE id = $7 
RETURNING *;

-- Delete subject
DELETE FROM subjects WHERE id = $1;

-- =====================================================
-- 7. ATTENDANCE QUERIES
-- =====================================================

-- Get attendance records
SELECT a.*, 
  s.full_name as student_name, s.student_id, s.photo_url, s.gender,
  c.name as class_name, c.code as class_code,
  sec.name as section_name, sec.code as section_code,
  t.full_name as marked_by_name
FROM attendance a
LEFT JOIN students s ON a.student_id = s.id
LEFT JOIN classes c ON a.class_id = c.id
LEFT JOIN sections sec ON a.section_id = sec.id
LEFT JOIN teachers t ON a.marked_by = t.id
WHERE a.school_id = $1
  AND ($2::date IS NULL OR a.date = $2)
  AND ($3::uuid IS NULL OR a.class_id = $3)
ORDER BY a.date DESC, s.full_name;

-- Get attendance stats for date range
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'present' THEN 1 END) as present,
  COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent,
  COUNT(CASE WHEN status = 'late' THEN 1 END) as late,
  COUNT(CASE WHEN status = 'excused' THEN 1 END) as excused,
  ROUND(
    COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END)::numeric / 
    NULLIF(COUNT(*), 0) * 100, 2
  ) as attendance_rate
FROM attendance
WHERE school_id = $1
  AND date BETWEEN $2 AND $3;

-- Get student attendance history
SELECT a.*, s.full_name as student_name, s.student_id
FROM attendance a
LEFT JOIN students s ON a.student_id = s.id
WHERE a.student_id = $1
ORDER BY a.date DESC
LIMIT 30;

-- Mark attendance (upsert)
INSERT INTO attendance (
  student_id, school_id, class_id, section_id, date,
  status, check_in_time, check_out_time, notes, marked_by
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
) ON CONFLICT (student_id, date) DO UPDATE SET
  status = EXCLUDED.status,
  check_in_time = EXCLUDED.check_in_time,
  check_out_time = EXCLUDED.check_out_time,
  notes = EXCLUDED.notes,
  marked_by = EXCLUDED.marked_by,
  updated_at = NOW()
RETURNING *;

-- Bulk mark attendance (using unnest for multiple rows)
INSERT INTO attendance (
  student_id, school_id, class_id, section_id, date,
  status, marked_by
)
SELECT 
  unnest($1::uuid[]),   -- student_ids array
  unnest($2::uuid[]),   -- school_ids array  
  unnest($3::uuid[]),   -- class_ids array
  unnest($4::uuid[]),   -- section_ids array
  unnest($5::date[]),   -- dates array
  unnest($6::attendance_status[]), -- statuses array
  unnest($7::uuid[])    -- marked_by array
ON CONFLICT (student_id, date) DO UPDATE SET
  status = EXCLUDED.status,
  marked_by = EXCLUDED.marked_by,
  updated_at = NOW()
RETURNING *;

-- Get attendance trend (monthly)
SELECT 
  DATE_TRUNC('month', date) as month,
  COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END) as present_count,
  COUNT(*) as total_count,
  ROUND(
    COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END)::numeric / 
    NULLIF(COUNT(*), 0) * 100, 2
  ) as attendance_rate
FROM attendance
WHERE school_id = $1
  AND date >= $2
GROUP BY DATE_TRUNC('month', date)
ORDER BY month;

-- Get attendance risk students (below 75%)
SELECT s.id, s.full_name, s.student_id,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
  COUNT(*) as total_days,
  ROUND(
    COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::numeric / 
    NULLIF(COUNT(*), 0) * 100, 2
  ) as attendance_rate
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
WHERE s.school_id = $1
  AND a.date >= NOW() - INTERVAL '30 days'
GROUP BY s.id
HAVING ROUND(
  COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END)::numeric / 
  NULLIF(COUNT(*), 0) * 100, 2
) < 75;

-- =====================================================
-- 8. EXAM QUERIES
-- =====================================================

-- Get all exams
SELECT e.*, c.name as class_name, c.code as class_code, s.name as subject_name, s.code as subject_code
FROM exams e
LEFT JOIN classes c ON e.class_id = c.id
LEFT JOIN subjects s ON e.subject_id = s.id
WHERE e.school_id = $1
ORDER BY e.exam_date DESC;

-- Get exam by ID with results
SELECT e.*, c.name as class_name, s.name as subject_name,
  r.marks_obtained, r.grade, r.gpa, r.percentage, r.remarks,
  st.full_name as student_name, st.student_id
FROM exams e
LEFT JOIN classes c ON e.class_id = c.id
LEFT JOIN subjects s ON e.subject_id = s.id
LEFT JOIN results r ON e.id = r.exam_id
LEFT JOIN students st ON r.student_id = st.id
WHERE e.id = $1;

-- Create exam
INSERT INTO exams (
  school_id, class_id, subject_id, name, exam_type,
  total_marks, passing_marks, exam_date, start_time,
  end_time, duration_minutes, instructions, is_published
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
) RETURNING *;

-- Update exam
UPDATE exams 
SET name = $1, exam_type = $2, total_marks = $3, passing_marks = $4,
    exam_date = $5, start_time = $6, end_time = $7, duration_minutes = $8,
    instructions = $9, is_published = $10
WHERE id = $11 
RETURNING *;

-- Delete exam
DELETE FROM exams WHERE id = $1;

-- Get exam results
SELECT r.*, s.full_name as student_name, s.student_id
FROM results r
LEFT JOIN students s ON r.student_id = s.id
WHERE r.exam_id = $1
ORDER BY r.marks_obtained DESC;

-- Create result
INSERT INTO results (
  exam_id, student_id, marks_obtained, grade, gpa,
  percentage, remarks, is_published
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
) ON CONFLICT (exam_id, student_id) DO UPDATE SET
  marks_obtained = EXCLUDED.marks_obtained,
  grade = EXCLUDED.grade,
  gpa = EXCLUDED.gpa,
  percentage = EXCLUDED.percentage,
  remarks = EXCLUDED.remarks,
  is_published = EXCLUDED.is_published,
  updated_at = NOW()
RETURNING *;

-- Get student results
SELECT r.*, e.name as exam_name, e.exam_type, e.total_marks,
  c.name as class_name
FROM results r
LEFT JOIN exams e ON r.exam_id = e.id
LEFT JOIN classes c ON e.class_id = c.id
WHERE r.student_id = $1
ORDER BY e.exam_date DESC;

-- Get class exam statistics
SELECT 
  ROUND(AVG(r.marks_obtained), 2) as average_marks,
  MAX(r.marks_obtained) as highest_marks,
  MIN(r.marks_obtained) as lowest_marks,
  ROUND(AVG(r.percentage), 2) as average_percentage,
  ROUND(AVG(r.gpa), 2) as average_gpa,
  COUNT(*) as total_students
FROM results r
WHERE r.exam_id = $1;

-- =====================================================
-- 9. ASSIGNMENT QUERIES
-- =====================================================

-- Get all assignments
SELECT a.*, c.name as class_name, c.code as class_code,
  s.name as subject_name, s.code as subject_code,
  t.full_name as teacher_name
FROM assignments a
LEFT JOIN classes c ON a.class_id = c.id
LEFT JOIN subjects s ON a.subject_id = s.id
LEFT JOIN teachers t ON a.teacher_id = t.id
WHERE a.school_id = $1
ORDER BY a.due_date DESC;

-- Get assignment by ID with submissions
SELECT a.*, c.name as class_name, s.name as subject_name, t.full_name as teacher_name,
  sub.id as submission_id, sub.student_id, sub.submission_text, sub.file_urls,
  sub.submitted_at, sub.status as submission_status, sub.grade, sub.feedback,
  st.full_name as student_name, st.student_id, st.photo_url
FROM assignments a
LEFT JOIN classes c ON a.class_id = c.id
LEFT JOIN subjects s ON a.subject_id = s.id
LEFT JOIN teachers t ON a.teacher_id = t.id
LEFT JOIN submissions sub ON a.id = sub.assignment_id
LEFT JOIN students st ON sub.student_id = st.id
WHERE a.id = $1;

-- Create assignment
INSERT INTO assignments (
  school_id, class_id, subject_id, teacher_id, title,
  description, attachment_urls, due_date, total_points,
  assignment_type, is_published
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
) RETURNING *;

-- Update assignment
UPDATE assignments 
SET title = $1, description = $2, attachment_urls = $3,
    due_date = $4, total_points = $5, assignment_type = $6,
    is_published = $7
WHERE id = $8 
RETURNING *;

-- Delete assignment
DELETE FROM assignments WHERE id = $1;

-- Create submission
INSERT INTO submissions (
  assignment_id, student_id, submission_text, file_urls, status
) VALUES (
  $1, $2, $3, $4, 'submitted'
) ON CONFLICT (assignment_id, student_id) DO UPDATE SET
  submission_text = EXCLUDED.submission_text,
  file_urls = EXCLUDED.file_urls,
  status = EXCLUDED.status,
  submitted_at = NOW(),
  updated_at = NOW()
RETURNING *;

-- Grade submission
UPDATE submissions 
SET grade = $1, feedback = $2, graded_by = $3, graded_at = NOW(), status = 'graded'
WHERE id = $4 
RETURNING *;

-- Get assignment statistics
SELECT 
  COUNT(*) as total_submissions,
  COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
  COUNT(CASE WHEN status = 'graded' THEN 1 END) as graded,
  COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue,
  ROUND(AVG(grade), 2) as average_grade
FROM submissions
WHERE assignment_id = $1;

-- Get overdue assignments
SELECT a.*, c.name as class_name, t.full_name as teacher_name
FROM assignments a
LEFT JOIN classes c ON a.class_id = c.id
LEFT JOIN teachers t ON a.teacher_id = t.id
WHERE a.due_date < NOW()
  AND a.is_published = true
  AND NOT EXISTS (
    SELECT 1 FROM submissions s 
    WHERE s.assignment_id = a.id AND s.status = 'graded'
  )
ORDER BY a.due_date ASC;

-- =====================================================
-- 10. FEE & PAYMENT QUERIES
-- =====================================================

-- Get all fees
SELECT f.*, s.name as school_name
FROM fees f
WHERE f.school_id = $1 
  AND f.is_active = true
ORDER BY f.created_at DESC;

-- Create fee
INSERT INTO fees (
  school_id, name, category, amount, description,
  due_date, recurring, recurrence_period, is_active
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9
) RETURNING *;

-- Update fee
UPDATE fees 
SET name = $1, category = $2, amount = $3, description = $4,
    due_date = $5, recurring = $6, recurrence_period = $7, is_active = $8
WHERE id = $9 
RETURNING *;

-- Delete fee
DELETE FROM fees WHERE id = $1;

-- Get all payments
SELECT p.*, f.name as fee_name, f.category as fee_category, f.amount as fee_amount,
  s.full_name as student_name, s.student_id
FROM payments p
LEFT JOIN fees f ON p.fee_id = f.id
LEFT JOIN students s ON p.student_id = s.id
WHERE p.school_id = $1
  AND ($2::uuid IS NULL OR p.student_id = $2)
ORDER BY p.payment_date DESC;

-- Create payment
INSERT INTO payments (
  fee_id, student_id, school_id, amount_paid, amount_due,
  payment_method, transaction_id, receipt_number, status, notes
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
) RETURNING *;

-- Update payment status
UPDATE payments 
SET status = $1, amount_paid = $2, amount_due = $3, notes = $4
WHERE id = $5 
RETURNING *;

-- Get payment statistics
SELECT 
  COUNT(*) as total_payments,
  SUM(amount_paid) as total_collected,
  SUM(amount_due) as total_due,
  COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
  COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
  COUNT(CASE WHEN status = 'partial' THEN 1 END) as partial_count
FROM payments
WHERE school_id = $1;

-- Get revenue trend (monthly)
SELECT 
  DATE_TRUNC('month', payment_date) as month,
  SUM(amount_paid) as total_collected,
  SUM(amount_due) as total_due,
  COUNT(*) as payment_count
FROM payments
WHERE school_id = $1
  AND payment_date >= $2
GROUP BY DATE_TRUNC('month', payment_date)
ORDER BY month;

-- Get student fee history
SELECT p.*, f.name as fee_name, f.category, f.amount as fee_amount
FROM payments p
LEFT JOIN fees f ON p.fee_id = f.id
WHERE p.student_id = $1
ORDER BY p.payment_date DESC;

-- Get overdue fees
SELECT p.*, f.name as fee_name, f.amount as fee_amount,
  s.full_name as student_name, s.student_id
FROM payments p
LEFT JOIN fees f ON p.fee_id = f.id
LEFT JOIN students s ON p.student_id = s.id
WHERE p.school_id = $1
  AND p.status IN ('pending', 'overdue')
  AND f.due_date < NOW()
ORDER BY f.due_date ASC;

-- Generate receipt number
SELECT generate_receipt_number($1, EXTRACT(YEAR FROM NOW())::integer);

-- =====================================================
-- 11. NOTIFICATION QUERIES
-- =====================================================

-- Get user notifications
SELECT n.*, u.full_name as created_by_name
FROM notifications n
LEFT JOIN users u ON n.created_by = u.id
WHERE (n.user_id = $1 OR n.user_id IS NULL)
  AND n.school_id = $2
ORDER BY n.created_at DESC
LIMIT 50;

-- Create notification
INSERT INTO notifications (
  school_id, user_id, title, message, type,
  is_read, priority, scheduled_at, expires_at, created_by
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
) RETURNING *;

-- Mark notification as read
UPDATE notifications 
SET is_read = true 
WHERE id = $1 
RETURNING *;

-- Mark all notifications as read
UPDATE notifications 
SET is_read = true 
WHERE user_id = $1 AND school_id = $2
RETURNING *;

-- Get unread count
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = $1 AND is_read = false;

-- Delete expired notifications
DELETE FROM notifications 
WHERE expires_at < NOW() 
  AND expires_at IS NOT NULL;

-- =====================================================
-- 12. MESSAGE QUERIES
-- =====================================================

-- Get user messages
SELECT m.*, 
  sender.full_name as sender_name, sender.avatar_url as sender_avatar,
  receiver.full_name as receiver_name, receiver.avatar_url as receiver_avatar
FROM messages m
LEFT JOIN users sender ON m.sender_id = sender.id
LEFT JOIN users receiver ON m.receiver_id = receiver.id
WHERE (m.sender_id = $1 OR m.receiver_id = $1)
  AND m.school_id = $2
  AND m.is_deleted_by_sender = false
  AND m.is_deleted_by_receiver = false
ORDER BY m.created_at DESC
LIMIT 50;

-- Send message
INSERT INTO messages (
  sender_id, receiver_id, school_id, content,
  attachment_urls, status
) VALUES (
  $1, $2, $3, $4, $5, 'sent'
) RETURNING *;

-- Mark message as read
UPDATE messages 
SET status = 'read', read_at = NOW()
WHERE id = $1 
RETURNING *;

-- Get conversation between two users
SELECT m.*, 
  sender.full_name as sender_name,
  receiver.full_name as receiver_name
FROM messages m
LEFT JOIN users sender ON m.sender_id = sender.id
LEFT JOIN users receiver ON m.receiver_id = receiver.id
WHERE (
  (m.sender_id = $1 AND m.receiver_id = $2) OR
  (m.sender_id = $2 AND m.receiver_id = $1)
)
AND m.school_id = $3
ORDER BY m.created_at ASC
LIMIT 50;

-- Delete message (soft delete)
UPDATE messages 
SET is_deleted_by_sender = true 
WHERE id = $1 AND sender_id = $2;

UPDATE messages 
SET is_deleted_by_receiver = true 
WHERE id = $1 AND receiver_id = $2;

-- Get unread message count
SELECT COUNT(*) as unread_count
FROM messages
WHERE receiver_id = $1 AND status != 'read' AND is_deleted_by_receiver = false;

-- =====================================================
-- 13. TIMETABLE QUERIES
-- =====================================================

-- Get class timetable
SELECT t.*, 
  s.name as subject_name, s.code as subject_code,
  teacher.full_name as teacher_name
FROM timetables t
LEFT JOIN subjects s ON t.subject_id = s.id
LEFT JOIN teachers teacher ON t.teacher_id = teacher.id
WHERE t.class_id = $1 
  AND t.is_active = true
ORDER BY t.day_of_week, t.start_time;

-- Get teacher timetable
SELECT t.*, 
  s.name as subject_name,
  c.name as class_name, c.code as class_code
FROM timetables t
LEFT JOIN subjects s ON t.subject_id = s.id
LEFT JOIN classes c ON t.class_id = c.id
WHERE t.teacher_id = $1 
  AND t.is_active = true
ORDER BY t.day_of_week, t.start_time;

-- Create timetable entry
INSERT INTO timetables (
  school_id, class_id, section_id, subject_id, teacher_id,
  day_of_week, start_time, end_time, room_number, is_active
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
) RETURNING *;

-- Update timetable entry
UPDATE timetables 
SET subject_id = $1, teacher_id = $2, day_of_week = $3,
    start_time = $4, end_time = $5, room_number = $6, is_active = $7
WHERE id = $8 
RETURNING *;

-- Delete timetable entry
UPDATE timetables SET is_active = false WHERE id = $1;

-- Check for timetable conflicts
SELECT COUNT(*) as conflict_count
FROM timetables
WHERE teacher_id = $1
  AND day_of_week = $2
  AND (
    (start_time <= $3 AND end_time > $3) OR
    (start_time < $4 AND end_time >= $4) OR
    (start_time >= $3 AND end_time <= $4)
  )
  AND is_active = true;

-- Get all timetables for a class
SELECT t.*, 
  s.name as subject_name,
  teacher.full_name as teacher_name,
  sec.name as section_name
FROM timetables t
LEFT JOIN subjects s ON t.subject_id = s.id
LEFT JOIN teachers teacher ON t.teacher_id = teacher.id
LEFT JOIN sections sec ON t.section_id = sec.id
WHERE t.class_id = $1 AND t.is_active = true
ORDER BY t.day_of_week, t.start_time;

-- =====================================================
-- 14. FILE MANAGEMENT QUERIES
-- =====================================================

-- Get files for school
SELECT f.*, u.full_name as uploaded_by_name
FROM files f
LEFT JOIN users u ON f.user_id = u.id
WHERE f.school_id = $1
  AND ($2::text IS NULL OR f.entity_type = $2)
  AND ($3::uuid IS NULL OR f.entity_id = $3)
ORDER BY f.created_at DESC;

-- Create file record
INSERT INTO files (
  school_id, user_id, name, original_name, file_type,
  file_size, storage_path, public_url, entity_type, entity_id
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
) RETURNING *;

-- Update file record
UPDATE files 
SET name = $1, public_url = $2
WHERE id = $3 
RETURNING *;

-- Delete file record
DELETE FROM files WHERE id = $1;

-- Get file by ID
SELECT f.*, u.full_name as uploaded_by_name
FROM files f
LEFT JOIN users u ON f.user_id = u.id
WHERE f.id = $1;

-- Get files by entity
SELECT * FROM files 
WHERE entity_type = $1 AND entity_id = $2
ORDER BY created_at DESC;

-- =====================================================
-- 15. ACTIVITY LOG QUERIES
-- =====================================================

-- Get recent activity logs
SELECT al.*, u.full_name as user_name, u.role as user_role
FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.school_id = $1
ORDER BY al.created_at DESC
LIMIT 50;

-- Create activity log
INSERT INTO activity_logs (
  user_id, school_id, action, entity_type, entity_id,
  details, ip_address, user_agent
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
) RETURNING *;

-- Get activity by user
SELECT al.*, u.full_name as user_name
FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.user_id = $1
ORDER BY al.created_at DESC
LIMIT 30;

-- Get activity by entity type
SELECT al.*, u.full_name as user_name
FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.entity_type = $1 AND al.entity_id = $2
ORDER BY al.created_at DESC
LIMIT 30;

-- Get activity statistics
SELECT 
  action,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as day
FROM activity_logs
WHERE school_id = $1
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY action, DATE_TRUNC('day', created_at)
ORDER BY day DESC, count DESC;

-- Clean old activity logs (keep last 90 days)
DELETE FROM activity_logs 
WHERE created_at < NOW() - INTERVAL '90 days';

-- =====================================================
-- 16. SCHOOL QUERIES
-- =====================================================

-- Get school by ID
SELECT * FROM schools WHERE id = $1;

-- Update school
UPDATE schools 
SET name = $1, email = $2, phone = $3, address = $4,
    city = $5, state = $6, country = $7, postal_code = $8,
    website = $9, logo_url = $10, banner_url = $11,
    primary_color = $12, secondary_color = $13,
    academic_year_start = $14, academic_year_end = $15,
    timezone = $16, currency = $17,
    notification_email = $18, notification_sms = $19,
    notification_in_app = $20
WHERE id = $21 
RETURNING *;

-- Get school statistics
SELECT 
  (SELECT COUNT(*) FROM students WHERE school_id = $1) as total_students,
  (SELECT COUNT(*) FROM teachers WHERE school_id = $1) as total_teachers,
  (SELECT COUNT(*) FROM classes WHERE school_id = $1) as total_classes,
  (SELECT COUNT(*) FROM parents WHERE school_id = $1) as total_parents,
  (SELECT COUNT(*) FROM subjects WHERE school_id = $1) as total_subjects,
  (SELECT COALESCE(SUM(amount_paid), 0) FROM payments WHERE school_id = $1) as total_revenue;

-- =====================================================
-- 17. ANALYTICS QUERIES
-- =====================================================

-- Dashboard stats
SELECT 
  (SELECT COUNT(*) FROM students WHERE school_id = $1) as total_students,
  (SELECT COUNT(*) FROM teachers WHERE school_id = $1) as total_teachers,
  (SELECT COUNT(*) FROM classes WHERE school_id = $1 AND is_active = true) as total_classes,
  (SELECT COUNT(*) FROM assignments WHERE school_id = $1) as total_assignments,
  (SELECT COALESCE(SUM(amount_paid), 0) FROM payments WHERE school_id = $1) as total_collected,
  (SELECT COALESCE(SUM(amount_due), 0) FROM payments WHERE school_id = $1) as total_due,
  (SELECT 
    ROUND(
      COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END)::numeric / 
      NULLIF(COUNT(*), 0) * 100, 2
    )
   FROM attendance 
   WHERE school_id = $1 
     AND date >= NOW() - INTERVAL '30 days'
  ) as attendance_rate;

-- Student growth over time
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_students
FROM students
WHERE school_id = $1
  AND created_at >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Grade distribution
SELECT 
  grade,
  COUNT(*) as student_count
FROM results
WHERE exam_id = $1
GROUP BY grade
ORDER BY grade;

-- Subject performance
SELECT 
  s.name as subject_name,
  ROUND(AVG(r.percentage), 2) as average_percentage,
  ROUND(AVG(r.gpa), 2) as average_gpa,
  COUNT(*) as total_students
FROM subjects s
LEFT JOIN exams e ON s.id = e.subject_id
LEFT JOIN results r ON e.id = r.exam_id
WHERE s.school_id = $1
GROUP BY s.id, s.name
ORDER BY average_percentage DESC;

-- Teacher workload
SELECT 
  t.full_name as teacher_name,
  t.department,
  COUNT(DISTINCT tt.class_id) as classes_assigned,
  COUNT(DISTINCT tt.subject_id) as subjects_assigned,
  COUNT(a.id) as assignments_created
FROM teachers t
LEFT JOIN timetables tt ON t.id = tt.teacher_id
LEFT JOIN assignments a ON t.id = a.teacher_id
WHERE t.school_id = $1
GROUP BY t.id, t.full_name, t.department
ORDER BY classes_assigned DESC;

-- Fee collection by month
SELECT 
  DATE_TRUNC('month', payment_date) as month,
  SUM(amount_paid) as collected,
  SUM(amount_due) as due,
  COUNT(*) as transactions,
  COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count
FROM payments
WHERE school_id = $1
  AND payment_date >= NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', payment_date)
ORDER BY month;

-- =====================================================
-- 18. GLOBAL SEARCH QUERIES
-- =====================================================

-- Search students
SELECT id, full_name, student_id, email, class_id
FROM students
WHERE school_id = $1
  AND (
    full_name ILIKE '%' || $2 || '%' OR
    student_id ILIKE '%' || $2 || '%' OR
    email ILIKE '%' || $2 || '%'
  )
LIMIT 10;

-- Search teachers
SELECT id, full_name, email, teacher_id, department
FROM teachers
WHERE school_id = $1
  AND (
    full_name ILIKE '%' || $2 || '%' OR
    email ILIKE '%' || $2 || '%' OR
    teacher_id ILIKE '%' || $2 || '%'
  )
LIMIT 10;

-- Search classes
SELECT id, name, code
FROM classes
WHERE school_id = $1
  AND (
    name ILIKE '%' || $2 || '%' OR
    code ILIKE '%' || $2 || '%'
  )
LIMIT 10;

-- Search subjects
SELECT id, name, code
FROM subjects
WHERE school_id = $1
  AND (
    name ILIKE '%' || $2 || '%' OR
    code ILIKE '%' || $2 || '%'
  )
LIMIT 10;

-- =====================================================
-- 19. HELPER FUNCTIONS
-- =====================================================

-- Generate Student ID
CREATE OR REPLACE FUNCTION generate_student_id(school_code TEXT, year INTEGER)
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(student_id FROM LENGTH(school_code) + 6) AS INTEGER)), 0) + 1
  INTO next_num
  FROM students
  WHERE student_id LIKE school_code || '-STU-' || year || '%';
  
  RETURN school_code || '-STU-' || year || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Generate Teacher ID
CREATE OR REPLACE FUNCTION generate_teacher_id(school_code TEXT, year INTEGER)
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(teacher_id FROM LENGTH(school_code) + 6) AS INTEGER)), 0) + 1
  INTO next_num
  FROM teachers
  WHERE teacher_id LIKE school_code || '-TCH-' || year || '%';
  
  RETURN school_code || '-TCH-' || year || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Generate Receipt Number
CREATE OR REPLACE FUNCTION generate_receipt_number(school_code TEXT, year INTEGER)
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(receipt_number FROM LENGTH(school_code) + 5) AS INTEGER)), 0) + 1
  INTO next_num
  FROM payments
  WHERE receipt_number LIKE school_code || '-RC-' || year || '%';
  
  RETURN school_code || '-RC-' || year || '-' || LPAD(next_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Calculate GPA
CREATE OR REPLACE FUNCTION calculate_gpa(percentage DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  IF percentage >= 90 THEN RETURN 4.0;
  ELSIF percentage >= 80 THEN RETURN 3.7;
  ELSIF percentage >= 70 THEN RETURN 3.3;
  ELSIF percentage >= 60 THEN RETURN 3.0;
  ELSIF percentage >= 50 THEN RETURN 2.7;
  ELSIF percentage >= 40 THEN RETURN 2.0;
  ELSE RETURN 0.0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Calculate Letter Grade
CREATE OR REPLACE FUNCTION calculate_letter_grade(percentage DECIMAL)
RETURNS TEXT AS $$
BEGIN
  IF percentage >= 90 THEN RETURN 'A+';
  ELSIF percentage >= 80 THEN RETURN 'A';
  ELSIF percentage >= 70 THEN RETURN 'B+';
  ELSIF percentage >= 60 THEN RETURN 'B';
  ELSIF percentage >= 50 THEN RETURN 'C+';
  ELSIF percentage >= 40 THEN RETURN 'C';
  ELSIF percentage >= 30 THEN RETURN 'D';
  ELSE RETURN 'F';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 20. INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_auth ON users(auth_id);
CREATE INDEX idx_schools_code ON schools(code);
CREATE INDEX idx_schools_active ON schools(is_active);
CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_section ON students(section_id);
CREATE INDEX idx_students_status ON students(academic_status);
CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_school_status ON students(school_id, academic_status);
CREATE INDEX idx_teachers_school ON teachers(school_id);
CREATE INDEX idx_teachers_department ON teachers(department);
CREATE INDEX idx_teachers_status ON teachers(employment_status);
CREATE INDEX idx_teachers_user ON teachers(user_id);
CREATE INDEX idx_parents_school ON parents(school_id);
CREATE INDEX idx_parents_user ON parents(user_id);
CREATE INDEX idx_classes_school ON classes(school_id);
CREATE INDEX idx_classes_active ON classes(is_active);
CREATE INDEX idx_sections_class ON sections(class_id);
CREATE INDEX idx_sections_school ON sections(school_id);
CREATE INDEX idx_subjects_school ON subjects(school_id);
CREATE INDEX idx_subjects_teacher ON subjects(teacher_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_school ON attendance(school_id);
CREATE INDEX idx_attendance_class ON attendance(class_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date DESC);
CREATE INDEX idx_attendance_school_date ON attendance(school_id, date DESC);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date DESC);
CREATE INDEX idx_exams_school ON exams(school_id);
CREATE INDEX idx_exams_class ON exams(class_id);
CREATE INDEX idx_exams_date ON exams(exam_date);
CREATE INDEX idx_exams_type ON exams(exam_type);
CREATE INDEX idx_results_exam ON results(exam_id);
CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX idx_results_exam_student ON results(exam_id, student_id);
CREATE INDEX idx_assignments_school ON assignments(school_id);
CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_due ON assignments(due_date);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_assignment_student ON submissions(assignment_id, student_id);
CREATE INDEX idx_fees_school ON fees(school_id);
CREATE INDEX idx_fees_category ON fees(category);
CREATE INDEX idx_fees_active ON fees(is_active);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_school ON payments(school_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_school ON notifications(school_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_school ON messages(school_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_timetables_class ON timetables(class_id);
CREATE INDEX idx_timetables_teacher ON timetables(teacher_id);
CREATE INDEX idx_timetables_day ON timetables(day_of_week);
CREATE INDEX idx_timetables_class_day ON timetables(class_id, day_of_week);
CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_school ON activity_logs(school_id);
CREATE INDEX idx_action ON activity_logs(action);
CREATE INDEX idx_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user_date ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_files_school ON files(school_id);
CREATE INDEX idx_files_user ON files(user_id);
CREATE INDEX idx_files_entity ON files(entity_type, entity_id);
