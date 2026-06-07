export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_id: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          role: 'platform_owner' | 'school_manager' | 'teacher' | 'student' | 'parent'
          school_id: string | null
          is_email_verified: boolean
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          role?: 'platform_owner' | 'school_manager' | 'teacher' | 'student' | 'parent'
          school_id?: string | null
          is_email_verified?: boolean
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          role?: 'platform_owner' | 'school_manager' | 'teacher' | 'student' | 'parent'
          school_id?: string | null
          is_email_verified?: boolean
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      schools: {
        Row: {
          id: string
          name: string
          code: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string
          postal_code: string | null
          website: string | null
          logo_url: string | null
          banner_url: string | null
          primary_color: string
          secondary_color: string
          academic_year_start: string | null
          academic_year_end: string | null
          timezone: string
          currency: string
          notification_email: boolean
          notification_sms: boolean
          notification_in_app: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string
          postal_code?: string | null
          website?: string | null
          logo_url?: string | null
          banner_url?: string | null
          primary_color?: string
          secondary_color?: string
          academic_year_start?: string | null
          academic_year_end?: string | null
          timezone?: string
          currency?: string
          notification_email?: boolean
          notification_sms?: boolean
          notification_in_app?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string
          postal_code?: string | null
          website?: string | null
          logo_url?: string | null
          banner_url?: string | null
          primary_color?: string
          secondary_color?: string
          academic_year_start?: string | null
          academic_year_end?: string | null
          timezone?: string
          currency?: string
          notification_email?: boolean
          notification_sms?: boolean
          notification_in_app?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          student_id: string
          user_id: string
          school_id: string
          full_name: string
          photo_url: string | null
          gender: 'male' | 'female' | 'other' | null
          date_of_birth: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          phone: string | null
          email: string | null
          class_id: string | null
          section_id: string | null
          parent_id: string | null
          admission_date: string
          academic_status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'
          blood_group: string | null
          emergency_contact: string | null
          medical_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          user_id: string
          school_id: string
          full_name: string
          photo_url?: string | null
          gender?: 'male' | 'female' | 'other' | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          phone?: string | null
          email?: string | null
          class_id?: string | null
          section_id?: string | null
          parent_id?: string | null
          admission_date?: string
          academic_status?: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'
          blood_group?: string | null
          emergency_contact?: string | null
          medical_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          user_id?: string
          school_id?: string
          full_name?: string
          photo_url?: string | null
          gender?: 'male' | 'female' | 'other' | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          phone?: string | null
          email?: string | null
          class_id?: string | null
          section_id?: string | null
          parent_id?: string | null
          admission_date?: string
          academic_status?: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'
          blood_group?: string | null
          emergency_contact?: string | null
          medical_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          teacher_id: string
          user_id: string
          school_id: string
          full_name: string
          photo_url: string | null
          email: string
          phone: string | null
          qualification: string | null
          department: string | null
          subjects: string[] | null
          joining_date: string
          employment_status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'
          address: string | null
          emergency_contact: string | null
          salary_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          user_id: string
          school_id: string
          full_name: string
          photo_url?: string | null
          email: string
          phone?: string | null
          qualification?: string | null
          department?: string | null
          subjects?: string[] | null
          joining_date?: string
          employment_status?: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'
          address?: string | null
          emergency_contact?: string | null
          salary_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          user_id?: string
          school_id?: string
          full_name?: string
          photo_url?: string | null
          email?: string
          phone?: string | null
          qualification?: string | null
          department?: string | null
          subjects?: string[] | null
          joining_date?: string
          employment_status?: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'
          address?: string | null
          emergency_contact?: string | null
          salary_amount?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      parents: {
        Row: {
          id: string
          parent_id: string
          user_id: string
          school_id: string
          full_name: string
          email: string | null
          phone: string | null
          address: string | null
          occupation: string | null
          relationship_to_student: string | null
          emergency_contact: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          user_id: string
          school_id: string
          full_name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          occupation?: string | null
          relationship_to_student?: string | null
          emergency_contact?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          user_id?: string
          school_id?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          occupation?: string | null
          relationship_to_student?: string | null
          emergency_contact?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          school_id: string
          name: string
          code: string
          capacity: number
          teacher_id: string | null
          academic_year: string | null
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          code: string
          capacity?: number
          teacher_id?: string | null
          academic_year?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          code?: string
          capacity?: number
          teacher_id?: string | null
          academic_year?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sections: {
        Row: {
          id: string
          school_id: string
          class_id: string
          name: string
          code: string
          capacity: number
          teacher_id: string | null
          room_number: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          class_id: string
          name: string
          code: string
          capacity?: number
          teacher_id?: string | null
          room_number?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          class_id?: string
          name?: string
          code?: string
          capacity?: number
          teacher_id?: string | null
          room_number?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          school_id: string
          name: string
          code: string
          description: string | null
          teacher_id: string | null
          class_ids: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          code: string
          description?: string | null
          teacher_id?: string | null
          class_ids?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          code?: string
          description?: string | null
          teacher_id?: string | null
          class_ids?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          school_id: string
          class_id: string | null
          section_id: string | null
          date: string
          status: 'present' | 'absent' | 'late' | 'excused'
          check_in_time: string | null
          check_out_time: string | null
          notes: string | null
          marked_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          school_id: string
          class_id?: string | null
          section_id?: string | null
          date: string
          status?: 'present' | 'absent' | 'late' | 'excused'
          check_in_time?: string | null
          check_out_time?: string | null
          notes?: string | null
          marked_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          school_id?: string
          class_id?: string | null
          section_id?: string | null
          date?: string
          status?: 'present' | 'absent' | 'late' | 'excused'
          check_in_time?: string | null
          check_out_time?: string | null
          notes?: string | null
          marked_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          school_id: string
          class_id: string
          subject_id: string | null
          name: string
          exam_type: 'midterm' | 'final' | 'quiz' | 'test' | 'practical'
          total_marks: number
          passing_marks: number | null
          exam_date: string
          start_time: string | null
          end_time: string | null
          duration_minutes: number | null
          instructions: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          class_id: string
          subject_id?: string | null
          name: string
          exam_type?: 'midterm' | 'final' | 'quiz' | 'test' | 'practical'
          total_marks: number
          passing_marks?: number | null
          exam_date: string
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          instructions?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          class_id?: string
          subject_id?: string | null
          name?: string
          exam_type?: 'midterm' | 'final' | 'quiz' | 'test' | 'practical'
          total_marks?: number
          passing_marks?: number | null
          exam_date?: string
          start_time?: string | null
          end_time?: string | null
          duration_minutes?: number | null
          instructions?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      results: {
        Row: {
          id: string
          exam_id: string
          student_id: string
          marks_obtained: number | null
          grade: string | null
          gpa: number | null
          percentage: number | null
          remarks: string | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exam_id: string
          student_id: string
          marks_obtained?: number | null
          grade?: string | null
          gpa?: number | null
          percentage?: number | null
          remarks?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exam_id?: string
          student_id?: string
          marks_obtained?: number | null
          grade?: string | null
          gpa?: number | null
          percentage?: number | null
          remarks?: string | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          school_id: string
          class_id: string
          subject_id: string | null
          teacher_id: string
          title: string
          description: string | null
          attachment_urls: string[] | null
          due_date: string
          total_points: number
          assignment_type: string
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          class_id: string
          subject_id?: string | null
          teacher_id: string
          title: string
          description?: string | null
          attachment_urls?: string[] | null
          due_date: string
          total_points?: number
          assignment_type?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          class_id?: string
          subject_id?: string | null
          teacher_id?: string
          title?: string
          description?: string | null
          attachment_urls?: string[] | null
          due_date?: string
          total_points?: number
          assignment_type?: string
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          assignment_id: string
          student_id: string
          submission_text: string | null
          file_urls: string[] | null
          submitted_at: string
          status: 'pending' | 'submitted' | 'graded' | 'overdue'
          grade: number | null
          feedback: string | null
          graded_by: string | null
          graded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          student_id: string
          submission_text?: string | null
          file_urls?: string[] | null
          submitted_at?: string
          status?: 'pending' | 'submitted' | 'graded' | 'overdue'
          grade?: number | null
          feedback?: string | null
          graded_by?: string | null
          graded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          student_id?: string
          submission_text?: string | null
          file_urls?: string[] | null
          submitted_at?: string
          status?: 'pending' | 'submitted' | 'graded' | 'overdue'
          grade?: number | null
          feedback?: string | null
          graded_by?: string | null
          graded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fees: {
        Row: {
          id: string
          school_id: string
          name: string
          category: string
          amount: number
          description: string | null
          due_date: string | null
          recurring: boolean
          recurrence_period: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          name: string
          category: string
          amount: number
          description?: string | null
          due_date?: string | null
          recurring?: boolean
          recurrence_period?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          name?: string
          category?: string
          amount?: number
          description?: string | null
          due_date?: string | null
          recurring?: boolean
          recurrence_period?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          fee_id: string
          student_id: string
          school_id: string
          amount_paid: number
          amount_due: number
          payment_method: string | null
          transaction_id: string | null
          receipt_number: string | null
          status: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived'
          payment_date: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fee_id: string
          student_id: string
          school_id: string
          amount_paid: number
          amount_due: number
          payment_method?: string | null
          transaction_id?: string | null
          receipt_number?: string | null
          status?: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived'
          payment_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fee_id?: string
          student_id?: string
          school_id?: string
          amount_paid?: number
          amount_due?: number
          payment_method?: string | null
          transaction_id?: string | null
          receipt_number?: string | null
          status?: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived'
          payment_date?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          school_id: string
          user_id: string | null
          title: string
          message: string
          type: 'announcement' | 'attendance' | 'academic' | 'fee' | 'assignment' | 'general'
          is_read: boolean
          priority: string
          scheduled_at: string | null
          expires_at: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          user_id?: string | null
          title: string
          message: string
          type?: 'announcement' | 'attendance' | 'academic' | 'fee' | 'assignment' | 'general'
          is_read?: boolean
          priority?: string
          scheduled_at?: string | null
          expires_at?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: 'announcement' | 'attendance' | 'academic' | 'fee' | 'assignment' | 'general'
          is_read?: boolean
          priority?: string
          scheduled_at?: string | null
          expires_at?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          school_id: string
          content: string
          attachment_urls: string[] | null
          status: 'sent' | 'delivered' | 'read'
          is_deleted_by_sender: boolean
          is_deleted_by_receiver: boolean
          sent_at: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          school_id: string
          content: string
          attachment_urls?: string[] | null
          status?: 'sent' | 'delivered' | 'read'
          is_deleted_by_sender?: boolean
          is_deleted_by_receiver?: boolean
          sent_at?: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          school_id?: string
          content?: string
          attachment_urls?: string[] | null
          status?: 'sent' | 'delivered' | 'read'
          is_deleted_by_sender?: boolean
          is_deleted_by_receiver?: boolean
          sent_at?: string
          read_at?: string | null
          created_at?: string
        }
      }
      timetables: {
        Row: {
          id: string
          school_id: string
          class_id: string
          section_id: string | null
          subject_id: string
          teacher_id: string
          day_of_week: number
          start_time: string
          end_time: string
          room_number: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          class_id: string
          section_id?: string | null
          subject_id: string
          teacher_id: string
          day_of_week: number
          start_time: string
          end_time: string
          room_number?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          class_id?: string
          section_id?: string | null
          subject_id?: string
          teacher_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          room_number?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          school_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          school_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          school_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      files: {
        Row: {
          id: string
          school_id: string
          user_id: string | null
          name: string
          original_name: string
          file_type: string | null
          file_size: number | null
          storage_path: string
          public_url: string | null
          entity_type: string | null
          entity_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          user_id?: string | null
          name: string
          original_name: string
          file_type?: string | null
          file_size?: number | null
          storage_path: string
          public_url?: string | null
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          user_id?: string | null
          name?: string
          original_name?: string
          file_type?: string | null
          file_size?: number | null
          storage_path?: string
          public_url?: string | null
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_student_id: {
        Args: { school_code: string; year: number }
        Returns: string
      }
      generate_teacher_id: {
        Args: { school_code: string; year: number }
        Returns: string
      }
      generate_receipt_number: {
        Args: { school_code: string; year: number }
        Returns: string
      }
      calculate_gpa: {
        Args: { percentage: number }
        Returns: number
      }
      calculate_letter_grade: {
        Args: { percentage: number }
        Returns: string
      }
    }
    Enums: {
      user_role: 'platform_owner' | 'school_manager' | 'teacher' | 'student' | 'parent'
      gender_type: 'male' | 'female' | 'other'
      attendance_status: 'present' | 'absent' | 'late' | 'excused'
      exam_type: 'midterm' | 'final' | 'quiz' | 'test' | 'practical'
      assignment_status: 'pending' | 'submitted' | 'graded' | 'overdue'
      fee_status: 'pending' | 'paid' | 'overdue' | 'partial' | 'waived'
      notification_type: 'announcement' | 'attendance' | 'academic' | 'fee' | 'assignment' | 'general'
      message_status: 'sent' | 'delivered' | 'read'
      academic_status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended'
    }
  }
}
