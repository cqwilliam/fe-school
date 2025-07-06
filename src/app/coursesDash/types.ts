export interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
}

export interface Course {
  id: number;
  name: string;
}

export interface CourseMaterial {
  id: number;
  title: string;
  description?: string;
  url?: string;
  created_at?: string;
  course_id: number;
}

export interface TeacherInfo {
  id: number;
  full_name: string;
  teacher_email: string;
  course_id: number;
}

export interface CourseWithMaterials extends Course {
  materials: CourseMaterial[];
  teacher?: TeacherInfo;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
}

export const tasksMock: Task[] = [
  {
    id: 1,
    title: "Tarea 1",
    description: "Descripción de la tarea 1",
    dueDate: "2023-10-30",
  },
  {
    id: 2,
    title: "Tarea 2",
    description: "Descripción de la tarea 2",
    dueDate: "2023-11-05",
  },
];
