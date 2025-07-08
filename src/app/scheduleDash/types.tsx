// types.ts (Updated for clarity)

export interface User {
  id: number;
  full_name: string; // Use full_name for display
  role_name: string;
  user_name: string;
  email: string;
  dni: string;
  age_name: number;
  photo_url: string;
  phone: string;
  address: string;
}

export interface Teacher {
  id: number;
  name: string;
}

// Type for Student's Schedule
export interface StudentScheduleItem {
  course_id: number;
  course_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  section_id: number;
  section_name: string;
  teacher: Teacher; // Student schedule includes teacher info
}

// Type for Teacher's Schedule (based on your provided JSON)
export interface TeacherScheduleItem {
  course_id: number;
  course_name: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  section_id: number;
  section_name: string; // Teacher schedule includes section info
}

// If Schedule is a generic type for creation/update, it might not be directly used for display
export interface Schedule {
  id?: number;
  period_section_id: number;
  course_id: number;
  teacher_user_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  course_name?: string; // Optional as it might be populated on frontend or derived
  teacher_name?: string; // Optional as it might be populated on frontend or derived
}

export interface Section {
  id: number;
  name: string;
}