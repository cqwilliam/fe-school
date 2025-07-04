"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { logout } from "../../lib/auth";

interface User {
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

interface Course {
  id: number;
  name: string;
}

interface CourseMaterial {
  id: number;
  title: string;
  description?: string;
  file_url?: string;
  created_at?: string;
  course_id: number;
}

interface TeacherInfo {
  id: number;
  teacher_name: string;
  teacher_email: string;
  course_id: number;
}

interface CourseWithMaterials extends Course {
  materials: CourseMaterial[];
  teacher?: TeacherInfo;
}

const CoursesDash = () => {
  const [user, setUser] = useState<User | null>(null);
  const [coursesWithMaterials, setCoursesWithMaterials] = useState<
    CourseWithMaterials[]
  >([]);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithMaterials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const courseColors = [
    { bg: "bg-red-50", border: "border-red-200", accent: "bg-red-500" },
    { bg: "bg-green-50", border: "border-green-200", accent: "bg-green-500" },
    { bg: "bg-blue-50", border: "border-blue-200", accent: "bg-blue-500" },
    {
      bg: "bg-purple-50",
      border: "border-purple-200",
      accent: "bg-purple-500",
    },
    {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      accent: "bg-yellow-500",
    },
    { bg: "bg-pink-50", border: "border-pink-200", accent: "bg-pink-500" },
    {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      accent: "bg-indigo-500",
    },
    { bg: "bg-teal-50", border: "border-teal-200", accent: "bg-teal-500" },
  ];

  useEffect(() => {
  const fetchUser  = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Verifica el token
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const userRes = await api.get("/current-user");
      console.log("User  Response:", userRes.data); // Verifica la respuesta del usuario
      setUser (userRes.data);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      setError("Error al cargar la información del usuario.");
      logout();
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  fetchUser ();
}, [router]);


  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const endpoint =
          user.role.name === "Estudiante"
            ? `/students/${user.id}/courses`
            : `/teachers/${user.id}/courses`;

        const coursesRes = await api.get(endpoint);

        if (!coursesRes.data?.data || !Array.isArray(coursesRes.data.data)) {
          throw new Error("Formato de datos de cursos incorrecto");
        }

        const userCourses: Course[] = coursesRes.data.data;
        let combinedCourses: CourseWithMaterials[] = [];

        if (user.role.name === "Estudiante") {
          const materialsRes = await api.get(
            `/students/${user.id}/course-materials`
          );
          if (
            !materialsRes.data?.data ||
            !Array.isArray(materialsRes.data.data)
          ) {
            throw new Error("Formato de datos de materiales incorrecto");
          }
          const courseMaterials: CourseMaterial[] = materialsRes.data.data;

          const teachersRes = await api.get(
            `/students/${user.id}/course-teachers`
          );
          if (
            !teachersRes.data?.data ||
            !Array.isArray(teachersRes.data.data)
          ) {
            throw new Error("Formato de datos de profesores incorrecto");
          }
          const courseTeachers: TeacherInfo[] = teachersRes.data.data;

          combinedCourses = userCourses.map((course) => ({
            ...course,
            materials: courseMaterials.filter((m) => m.course_id === course.id),
            teacher: courseTeachers.find((t) => t.course_id === course.id),
          }));
        } else {
          combinedCourses = userCourses.map((course) => ({
            ...course,
            materials: [],
          }));
        }

        setCoursesWithMaterials(combinedCourses);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Error desconocido al cargar los datos"
        );
        setCoursesWithMaterials([]);
      }
    };

    fetchData();
  }, [user]);

  const handleCourseClick = (course: CourseWithMaterials) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBackToCourses}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver a mis cursos
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {selectedCourse.name}
              </h1>
              <div className="w-32"></div>
            </div>
          </div>
        </div>

        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del curso
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">ID del curso</p>
                    <p className="font-medium">{selectedCourse.id}</p>
                  </div>
                  {selectedCourse.teacher && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Profesor</p>
                        <p className="font-medium">
                          {selectedCourse.teacher.teacher_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Email del profesor
                        </p>
                        <p className="font-medium">
                          {selectedCourse.teacher.teacher_email}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Materiales del curso
                </h2>

                {selectedCourse.materials.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCourse.materials.map((material) => (
                      <div
                        key={material.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-2">
                              {material.title}
                            </h3>
                            {material.description && (
                              <p className="text-sm text-gray-600 mb-3">
                                {material.description}
                              </p>
                            )}
                            {material.created_at && (
                              <p className="text-xs text-gray-500">
                                Creado:{" "}
                                {new Date(
                                  material.created_at
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          {material.file_url && (
                            <a
                              href={material.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              Descargar
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay materiales disponibles
                    </h3>
                    <p className="text-gray-600">
                      Este curso aún no tiene materiales publicados.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Mis Cursos</h1>
            {user && (
              <div className="text-sm text-gray-600">
                Bienvenido, {user.first_name} {user.last_name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {coursesWithMaterials.length > 0 ? (
          <div className="space-y-3">
            {coursesWithMaterials.map((course, index) => {
              const colorScheme = courseColors[index % courseColors.length];
              return (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className={`${colorScheme.bg} ${colorScheme.border} border-l-4 rounded-lg p-6 cursor-pointer hover:shadow-sm transition-all duration-200 group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {course.teacher?.teacher_name || "Curso"}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>ID: {course.id}</span>
                        {user?.role.name === "Estudiante" && (
                          <span>{course.materials.length} materiales</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`${colorScheme.accent} w-3 h-3 rounded-full`}
                      ></div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-8xl mb-6">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No tienes cursos asignados
            </h3>
            <p className="text-gray-600 text-lg">
              Cuando se te asignen cursos, aparecerán aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesDash;
