"use client";
import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { logout } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { User, StudentScheduleItem, TeacherScheduleItem } from "./types";
import Schedules from "../schedules/page";

const ScheduleDash = () => {
  const [user, setUser] = useState<User | null>(null);
  const [schedule, setSchedule] = useState<Array<StudentScheduleItem | TeacherScheduleItem>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
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
        console.error("Error fetching user:", error);
        setError("Error loading user information.");
        logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (user) {
        try {
          let scheduleRes;
          if (user.role_name === "Estudiante") {
            scheduleRes = await api.get(`/students/${user.id}/schedules`);
          } else if (user.role_name === "Docente") {
            scheduleRes = await api.get(`/teachers/${user.id}/schedules`);
          } else {
            setSchedule([]);
            return;
          }

          console.log("Schedule Response:", scheduleRes.data);
          if (scheduleRes.data && Array.isArray(scheduleRes.data.data)) {
            setSchedule(scheduleRes.data.data);
          } else {
            setSchedule([]);
          }
        } catch (error) {
          console.error("Error fetching schedule:", error);
          setError("Error loading schedule.");
        }
      }
    };

    if (user) {
      fetchSchedule();
    }
  }, [user]);

  // Filtrar horarios basado en la búsqueda
  const filteredSchedule = schedule.filter(item => 
    item.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  // Debug: Mostrar datos en consola
  console.log("Schedule data:", schedule);
  console.log("Filtered schedule:", filteredSchedule);

  // Organizar horarios por día de la semana
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  const organizedSchedule = daysOfWeek.map(day => ({
    day,
    courses: filteredSchedule
      .filter(item => {
        // Comparación más flexible para los días
        const itemDay = item.day_of_week?.toLowerCase().trim();
        const targetDay = day.toLowerCase().trim();
        return itemDay === targetDay;
      })
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }));

  const getTitleByRole = () => {
    if (!user) return 'Horario Escolar';
    
    switch (user.role_name) {
      case 'Administrador':
        return 'Horario Escolar - Panel de Administración';
      case 'Estudiante':
        return 'Mi Horario - Estudiante';
      case 'Docente':
        return 'Mi Horario - Docente';
      default:
        return 'Horario Escolar';
    }
  };

  const getCourseTypeColorClass = (index: number) => {
    const colors = [
      'bg-lime-100 text-lime-800',
      'bg-emerald-100 text-emerald-800', 
      'bg-green-100 text-green-800',
      'bg-teal-100 text-teal-800',
      'bg-lime-200 text-lime-900'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando horario...</p>
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
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user || (user.role_name !== "Estudiante" && user.role_name !== "Docente" && user.role_name !== "Administrador")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Acceso Denegado</h3>
            <p className="text-gray-600">No tienes permisos para ver esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Título y Descripción */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">{getTitleByRole()}</h1>
          <p className="text-gray-600">
            {user?.role_name === 'Administrador' 
              ? 'Administra y visualiza todos los horarios escolares'
              : 'Visualiza tu horario de clases'
            }
          </p>
        </div>

        {/* Barra de búsqueda y controles */}
        <div className="mb-6 bg-white p-5 rounded-lg shadow-md border border-green-100">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex-grow">
              <label htmlFor="search-input" className="sr-only">Buscar clase por nombre...</label>
              <input
                type="text"
                id="search-input"
                placeholder="Buscar clase por nombre..."
                className="w-full px-4 py-2 border border-green-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm text-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Vista Cuadrícula
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Vista Tabla
              </button>
            </div>
          </div>
        </div>

        {/* Tabla de Horario en formato de cuadrícula para Estudiantes y Docentes */}
        {(user.role_name === "Estudiante" || user.role_name === "Docente") && filteredSchedule.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              // Vista en cuadrícula
              <div className="bg-white rounded-lg shadow-xl border border-green-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-green-200">
                  <thead className="bg-green-50">
                    <tr>
                      {daysOfWeek.map(day => (
                        <th key={day} scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-green-100">
                    <tr>
                      {daysOfWeek.map(day => {
                        const dayData = organizedSchedule.find(d => d.day === day);
                        const coursesForDay = dayData ? dayData.courses : [];

                        return (
                          <td key={day} className="px-6 py-4 text-sm text-gray-700 align-top">
                            <div className="space-y-3">
                              {coursesForDay.length > 0 ? (
                                coursesForDay.map((course, index) => (
                                  <div key={index} className="bg-green-50 rounded-lg shadow-sm p-3 border border-green-200 hover:shadow-md transition-shadow duration-200">
                                    <h3 className="font-bold text-green-800 mb-1 text-base">{course.course_name || "N/A"}</h3>
                                    <p className="text-xs text-gray-600 mb-1">⏰ {course.start_time} - {course.end_time}</p>
                                    <p className="text-xs text-gray-500 mb-2">
                                      {user.role_name === "Estudiante"
                                        ? `Docente: ${(course as StudentScheduleItem).teacher?.name || "N/A"}`
                                        : `Sección: ${(course as TeacherScheduleItem).section_name || "N/A"}`
                                      }
                                    </p>
                                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getCourseTypeColorClass(index)}`}>
                                      {course.course_name || "N/A"}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-400 text-center py-4">—</div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              // Vista en tabla tradicional
              <div className="bg-white rounded-lg shadow-xl border border-green-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-green-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Día</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Hora Inicio</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Hora Fin</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Curso</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                        {user.role_name === "Estudiante" ? "Profesor" : "Sección"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-green-100">
                    {filteredSchedule.map((item, index) => (
                      <tr key={index} className="hover:bg-green-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {item.day_of_week}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="text-green-600 font-semibold">⏰ {item.start_time}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="text-green-600 font-semibold">{item.end_time}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                            <span className="text-green-800 font-bold">{item.course_name || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            {user.role_name === "Estudiante"
                              ? (item as StudentScheduleItem).teacher?.name || "N/A"
                              : (item as TeacherScheduleItem).section_name || "N/A"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (user.role_name === "Estudiante" || user.role_name === "Docente") && (
          <div className="py-12 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-green-100">
            {user.role_name === 'Estudiante' && (
              <>
                <div className="text-gray-300 text-6xl mb-4">📅</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No tienes clases programadas
                </h3>
                <p className="text-gray-500">
                  No se encontró horario para este estudiante.
                </p>
              </>
            )}
            {user.role_name === 'Docente' && (
              <>
                <div className="text-gray-300 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No tienes clases asignadas
                </h3>
                <p className="text-gray-500">
                  No se encontró horario para este docente.
                </p>
              </>
            )}
          </div>
        )}

        {/* Panel de Administrador */}
        {user && user.role_name === "Administrador" && (
          <div className="bg-white rounded-lg shadow-xl border border-green-200 p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Gestión de Horarios (Administrador)</h2>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <Schedules />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleDash;