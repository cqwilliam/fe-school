"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { logout } from "../../lib/auth";
import {
  User,
  Course,
  CourseMaterial,
  TeacherInfo,
  CourseWithMaterials,
  tasksMock,
} from "./types";
import Courses from "../courses/page";
import CreateCourse from "../courses/create/page"; // Asegúrate de que esta ruta sea correcta

const CoursesDash = () => {
  const [user, setUser] = useState<User | null>(null);
  const [coursesWithMaterials, setCoursesWithMaterials] = useState<
    CourseWithMaterials[]
  >([]);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithMaterials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateCourseForm, setShowCreateCourseForm] = useState(false); // Nuevo estado
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userRes = await api.get("/current-user");
        console.log("User Response:", userRes.data);
        setUser(userRes.data);
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        setError("Error al cargar la información del usuario.");
        logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      if (user.role.name === "Administrador") {
        setLoading(false); // Terminamos la carga si es administrador y no necesitamos más datos de cursos aquí
        return;
      }

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
          const materialsRes = await api.get(
            `/teachers/${user.id}/course-materials`
          );
          if (
            !materialsRes.data?.data ||
            !Array.isArray(materialsRes.data.data)
          ) {
            throw new Error("Formato de datos de materiales incorrecto");
          }
          const courseMaterials: CourseMaterial[] = materialsRes.data.data;

          combinedCourses = userCourses.map((course) => ({
            ...course,
            materials: courseMaterials.filter((m) => m.course_id === course.id),
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
      } finally {
        setLoading(false); // Mover esto aquí asegura que `loading` se desactive después de intentar cargar datos
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

  // Nueva función para alternar la visibilidad de CreateCourse
  const handleToggleCreateCourseForm = () => {
    setShowCreateCourseForm(!showCreateCourseForm);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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

  if (user?.role.name === "Administrador") {
    return (
      <div className="min-h-screen bg-white rounded-4xl p-6">
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Panel de Administración de Cursos
          </h1>
        </div>
        <div className="mb-6">
          <button
            onClick={handleToggleCreateCourseForm}
            className="px-5 py-2 border border-green-600 text-green-800 rounded-lg hover:bg-green-700 hover:text-white transition-colors font-medium"
          >
            {showCreateCourseForm ? "Ocultar Formulario de Creación" : "Crear Nuevo Curso"}
          </button>
        </div>
        {showCreateCourseForm ? (
          <CreateCourse />
        ) : (
          <Courses /> // Muestra la lista de cursos si no se está creando uno nuevo
        )}
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

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del curso
                </h2>
                <div className="space-y-3">
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
              <div className="bg-white rounded-3xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Materiales del curso
                </h2>

                {selectedCourse.materials.length > 0 ? (
                  <div className="space-y-4">
                    {selectedCourse.materials.map((material, index) => (
                      <div
                        key={`material-${material.id || index}`}
                        className="border border-blue-200 rounded-3xl p-4 hover:bg-green-50 transition-colors"
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
                            {material.url && (
                              <p className="text-sm text-gray-500 mb-3">
                                {material.url}
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
                          {material.url && (
                            <a
                              href={material.url}
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
                <h2 className="text-lg font-semibold text-gray-900 mb-6 mt-8">
                  Tareas
                </h2>
                {tasksMock.length > 0 ? (
                  <div className="space-y-4">
                    {tasksMock.map((task) => (
                      <div
                        key={task.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 mb-2">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {task.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Fecha de entrega:{" "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay tareas disponibles
                    </h3>
                    <p className="text-gray-600">
                      Este curso aún no tiene tareas asignadas.
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
    <div className="min-h-screen bg-white rounded-4xl">
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-semibold text-gray-900">Mis Cursos</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {coursesWithMaterials.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {coursesWithMaterials.map((course) => {
              const cardClasses =
                "bg-white hover:bg-gray-50 border border-gray-400 rounded-4xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg group";
              const accentClasses = "bg-gray-900 h-1 w-12 rounded-full mb-4";
              return (
                <div
                  key={`course-${course.id}`}
                  onClick={() => handleCourseClick(course)}
                  className={cardClasses}
                >
                  <div className={accentClasses}></div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {course.teacher?.teacher_name || "any"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {user?.role.name === "Estudiante" && (
                        <span>{course.materials.length} materiales</span>
                      )}
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-300 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No tienes cursos asignados
            </h3>
            <p className="text-gray-500">
              Cuando se te asignen cursos, aparecerán aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesDash;