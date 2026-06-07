-- =====================================================
-- StudentHub - Complete Production Database Schema
-- Supabase PostgreSQL
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('platform_owner', 'school_manager', 'teacher', 'student', 'parent');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE exam_type AS ENUM ('midterm', 'final', 'quiz', 'test', 'practical');
CREATE TYPE assignment_status AS ENUM ('pending', 'submitted', 'graded', 'overdue');
CREATE TYPE fee_status AS ENUM ('pending', 'paid', 'overdue', 'partial', 'waived');
CREATE TYPE notification_type AS ENUM ('announcement', 'attendance', 'academic', 'fee', 'assignment', 'general');
CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
CREATE TYPE academic_status AS ENUM ('active', 'inactive', 'graduated', 'transferred', 'suspended');

CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'US',
    postal_code TEXT,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    primary_color TEXT DEFAULT '#3B82F6',
    secondary_color TEXT DEFAULT '#1E40AF',
    academic_year_start DATE,
    academic_year_end DATE,
    timezone TEXT DEFAULT 'UTC',
    currency TEXT DEFAULT 'USD',
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    notification_in_app BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'student',
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    capacity INTEGER DEFAULT 40,
    teacher_id UUID,
    academic_year TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, code)
);

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    capacity INTEGER DEFAULT 35,
    teacher_id UUID,
    room_number TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, code)
);

CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    teacher_id UUID,
    class_ids UUID[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, code)
);

CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    photo_url TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    qualification TEXT,
    department TEXT,
    subjects TEXT[],
    joining_date DATE DEFAULT NOW(),
    employment_status academic_status DEFAULT 'active',
    address TEXT,
    emergency_contact TEXT,
    salary_amount DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    occupation TEXT,
    relationship_to_student TEXT,
    emergency_contact BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    photo_url TEXT,
    gender gender_type,
    date_of_birth DATE,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    phone TEXT,
    email TEXT,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES parents(id) ON DELETE SET NULL,
    admission_date DATE DEFAULT NOW(),
    academic_status academic_status DEFAULT 'active',
    blood_group TEXT,
    emergency_contact TEXT,
    medical_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    check_in_time TIME,
    check_out_time TIME,
    notes TEXT,
    marked_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    exam_type exam_type NOT NULL,
    total_marks INTEGER NOT NULL,
    passing_marks INTEGER,
    exam_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_minutes INTEGER,
    instructions TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2),
    grade TEXT,
    gpa DECIMAL(3, 2),
    percentage DECIMAL(5, 2),
    remarks TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    attachment_urls TEXT[],
    due_date TIMESTAMPTZ NOT NULL,
    total_points INTEGER DEFAULT 100,
    assignment_type TEXT DEFAULT 'homework',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    submission_text TEXT,
    file_urls TEXT[],
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    status assignment_status DEFAULT 'pending',
    grade DECIMAL(5, 2),
    feedback TEXT,
    graded_by UUID REFERENCES teachers(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

CREATE TABLE fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    due_date DATE,
    recurring BOOLEAN DEFAULT FALSE,
    recurrence_period TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_id UUID NOT NULL REFERENCES fees(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    payment_method TEXT,
    transaction_id TEXT,
    receipt_number TEXT UNIQUE,
    status fee_status DEFAULT 'pending',
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'normal',
    scheduled_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    attachment_urls TEXT[],
    status message_status DEFAULT 'sent',
    is_deleted_by_sender BOOLEAN DEFAULT FALSE,
    is_deleted_by_receiver BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    entity_type TEXT,
    entity_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_teachers_school ON teachers(school_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date DESC);
CREATE INDEX idx_attendance_school_date ON attendance(school_id, date DESC);
CREATE INDEX idx_exams_school ON exams(school_id);
CREATE INDEX idx_exams_class ON exams(class_id);
CREATE INDEX idx_results_exam ON results(exam_id);
CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX idx_assignments_school ON assignments(school_id);
CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_school ON payments(school_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_timetables_class ON timetables(class_id);
CREATE INDEX idx_timetables_teacher ON timetables(teacher_id);
CREATE INDEX idx_activity_logs_user_date ON activity_logs(user_id, created_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fees_updated_at BEFORE UPDATE ON fees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_timetables_updated_at BEFORE UPDATE ON timetables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper functions
CREATE OR REPLACE FUNCTION generate_student_id(school_code TEXT, year INTEGER)
RETURNS TEXT AS $$
DECLARE next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(student_id FROM LENGTH(school_code) + 6) AS INTEGER)), 0) + 1
    INTO next_num FROM students WHERE student_id LIKE school_code || '-STU-' || year || '%';
    RETURN school_code || '-STU-' || year || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_teacher_id(school_code TEXT, year INTEGER)
RETURNS TEXT AS $$
DECLARE next_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(teacher_id FROM LENGTH(school_code) + 6) AS INTEGER)), 0) + 1
    INTO next_num FROM teachers WHERE teacher_id LIKE school_code || '-TCH-' || year || '%';
    RETURN school_code || '-TCH-' || year || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

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

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "School managers can view users in their school" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.role IN ('platform_owner', 'school_manager') AND u.school_id = users.school_id));
CREATE POLICY "Platform owners can view all users" ON users FOR SELECT USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.role = 'platform_owner'));

CREATE POLICY "School staff can view students" ON students FOR SELECT USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = students.school_id AND u.role IN ('platform_owner', 'school_manager', 'teacher', 'parent')));
CREATE POLICY "School managers can manage students" ON students FOR ALL USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = students.school_id AND u.role IN ('platform_owner', 'school_manager')));

CREATE POLICY "School staff can view teachers" ON teachers FOR SELECT USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = teachers.school_id));
CREATE POLICY "School managers can manage teachers" ON teachers FOR ALL USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = teachers.school_id AND u.role IN ('platform_owner', 'school_manager')));

CREATE POLICY "School staff can view attendance" ON attendance FOR SELECT USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = attendance.school_id));
CREATE POLICY "Teachers can manage attendance" ON attendance FOR ALL USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = attendance.school_id AND u.role IN ('platform_owner', 'school_manager', 'teacher')));

CREATE POLICY "School staff can view exams" ON exams FOR SELECT USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = exams.school_id));
CREATE POLICY "Teachers can manage exams" ON exams FOR ALL USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = exams.school_id AND u.role IN ('platform_owner', 'school_manager', 'teacher')));

CREATE POLICY "School staff can view payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = payments.school_id));
CREATE POLICY "School managers can manage payments" ON payments FOR ALL USING (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = payments.school_id AND u.role IN ('platform_owner', 'school_manager')));

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.role IN ('platform_owner', 'school_manager') AND u.school_id = notifications.school_id));
CREATE POLICY "Staff can create notifications" ON notifications FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM users u WHERE u.auth_id = auth.uid() AND u.school_id = notifications.school_id AND u.role IN ('platform_owner', 'school_manager', 'teacher')));

CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (sender_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR receiver_id = (SELECT id FROM users WHERE auth_id = auth.uid()));
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (sender_id = (SELECT id FROM users WHERE auth_id = auth.uid()));
