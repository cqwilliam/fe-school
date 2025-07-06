import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { logout } from "../../lib/auth";

interface User {
  id: string;
  role: {
    name: string;
  };
}

const SchedulesDash = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminSelectedType, setAdminSelectedType] = useState('Todos');
  const [parentSelectedChildType, setParentSelectedChildType] = useState('');
  const router = useRouter();

  const STUDENT_DEFAULT_TYPE = '1°';
  const TEACHER_DEFAULT_ID = 'T001';
  const APODERADO_CHILDREN_INFO = useMemo(() => [
    { name: 'Ana Lopez', type: '4°' },
    { name: 'Pedro Gomez', type: '5°' },
  ], []);

  const scheduleData = [
    {
      day: 'Lunes',
      courses: [
        { id: 1, name: 'Matemáticas', time: '08:00 - 10:00', type: '4°', teacherId: 'T001' },
        { id: 2, name: 'Programación', time: '14:00 - 16:00', type: '5°', teacherId: 'T002' }
      ]
    },
    {
      day: 'Martes',
      courses: [
        { id: 3, name: 'Física', time: '10:00 - 12:00', type: '4°', teacherId: 'T003' },
        { id: 13, name: 'Educación Física', time: '10:00 - 12:00', type: '5°', teacherId: 'T001' },
        { id: 14, name: 'Química', time: '08:00 - 10:00', type: '1°', teacherId: 'T002' },
        { id: 15, name: 'Biología', time: '10:00 - 12:00', type: '1°', teacherId: 'T003' },
      ]
    },
    {
      day: 'Miércoles',
      courses: [
        { id: 4, name: 'Química', time: '08:00 - 10:00', type: '1°', teacherId: 'T002' },
        { id: 5, name: 'Historia', time: '11:00 - 13:00', type: '2°', teacherId: 'T001' },
        { id: 8, name: 'Filosofía', time: '09:00 - 11:00', type: '1°', teacherId: 'T003' },
        { id: 9, name: 'Literatura', time: '10:00 - 12:00', type: '1°', teacherId: 'T001' },
        { id: 10, name: 'Artes Visuales', time: '14:00 - 16:00', type: '1°', teacherId: 'T002' },
      ]
    },
    {
      day: 'Jueves',
      courses: [
        { id: 6, name: 'Arte', time: '09:00 - 11:00', type: '3°', teacherId: 'T003' }
      ]
    },
    {
      day: 'Viernes',
      courses: [
        { id: 7, name: 'Educación Física', time: '10:00 - 12:00', type: '5°', teacherId: 'T001' },
        { id: 11, name: 'Geografía', time: '08:00 - 10:00', type: '1°', teacherId: 'T002' },
        { id: 12, name: 'Economía', time: '08:00 - 10:00', type: '1°', teacherId: 'T003' },
      ]
    }
  ];

  const allClassTypes = useMemo(() => ['Todos', ...new Set(scheduleData.flatMap(day =>
    day.courses.map(course => course.type)
  ))].sort(), []);

  // Obtener información del usuario al cargar el componente
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userRes = await api.get("/current-user");
        setUser(userRes.data);
        
        // Si es apoderado, seleccionar el primer hijo por defecto
        if (userRes.data.role.name === "Apoderado" && APODERADO_CHILDREN_INFO.length > 0) {
          setParentSelectedChildType(APODERADO_CHILDREN_INFO[0].name);
        }
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

  const filteredDays = scheduleData.map(day => ({
    ...day,
    courses: day.courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
      let roleSpecificFilter = true;

      if (!user) return false;

      switch (user.role.name) {
        case 'Administrador':
          roleSpecificFilter = adminSelectedType === 'Todos' || course.type === adminSelectedType;
          break;
        case 'Estudiante':
          roleSpecificFilter = course.type === STUDENT_DEFAULT_TYPE;
          break;
        case 'Docente':
          roleSpecificFilter = course.teacherId === TEACHER_DEFAULT_ID;
          break;
        case 'Apoderado':
          const selectedChildInfo = APODERADO_CHILDREN_INFO.find(child => child.name === parentSelectedChildType);
          roleSpecificFilter = selectedChildInfo ? course.type === selectedChildInfo.type : false;
          break;
        default:
          roleSpecificFilter = true;
      }

      return matchesSearch && roleSpecificFilter;
    })
  })).filter(day => day.courses.length > 0);

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  const getCourseTypeColorClass = (type: string) => {
    switch (type) {
      case '1°': return 'bg-lime-100 text-lime-800';
      case '2°': return 'bg-emerald-100 text-emerald-800';
      case '3°': return 'bg-green-100 text-green-800';
      case '4°': return 'bg-teal-100 text-teal-800';
      case '5°': return 'bg-lime-200 text-lime-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTitleByRole = () => {
    if (!user) return 'Horario Escolar';
    
    switch (user.role.name) {
      case 'Administrador':
        return 'Horario Escolar - Panel de Administración';
      case 'Estudiante':
        return `Mi Horario - ${STUDENT_DEFAULT_TYPE}`;
      case 'Docente':
        return `Horario de Clases - Docente (ID: ${TEACHER_DEFAULT_ID})`;
      case 'Apoderado':
        if (parentSelectedChildType) {
          const selectedChild = APODERADO_CHILDREN_INFO.find(child => child.name === parentSelectedChildType);
          return selectedChild ? `Horario de ${selectedChild.name} - ${selectedChild.type}` : 'Horario - Apoderado';
        }
        return 'Horario - Apoderado';
      default:
        return 'Horario Escolar';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto"></div>
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
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
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
            {user?.role.name === 'Administrador' 
              ? 'Administra y visualiza todos los horarios escolares'
              : 'Visualiza tu horario de clases'
            }
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6 bg-white p-5 rounded-lg shadow-md border border-green-100">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <label htmlFor="search-input" className="sr-only">Buscar clase por nombre...</label>
            <input
              type="text"
              id="search-input"
              placeholder="Buscar clase por nombre..."
              className="flex-grow px-4 py-2 border border-green-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros específicos por rol */}
        {user?.role.name === 'Administrador' && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-green-100 flex flex-col sm:flex-row items-center gap-4">
            <label htmlFor="admin-type-filter" className="text-green-700 font-semibold">Filtrar por Grado/Tipo:</label>
            <select
              id="admin-type-filter"
              value={adminSelectedType}
              onChange={(e) => setAdminSelectedType(e.target.value)}
              className="px-4 py-2 border border-green-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm text-gray-700"
            >
              {allClassTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {user?.role.name === 'Apoderado' && APODERADO_CHILDREN_INFO.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-green-100 flex flex-col sm:flex-row items-center gap-4">
            <label htmlFor="parent-child-select" className="text-green-700 font-semibold">Selecciona un hijo:</label>
            <select
              id="parent-child-select"
              value={parentSelectedChildType}
              onChange={(e) => setParentSelectedChildType(e.target.value)}
              className="px-4 py-2 border border-green-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 shadow-sm text-gray-700"
            >
              {APODERADO_CHILDREN_INFO.map(child => (
                <option key={child.name} value={child.name}>
                  {child.name} (Grado: {child.type})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Mensaje si el apoderado no tiene hijos */}
        {user?.role.name === 'Apoderado' && APODERADO_CHILDREN_INFO.length === 0 && (
          <div className="py-6 text-center text-gray-600 bg-white rounded-lg shadow-sm mb-6 border border-green-100">
            <p>No se encontraron hijos asociados a tu cuenta de apoderado.</p>
          </div>
        )}

        {/* Tabla de Horario */}
        {filteredDays.length > 0 ? (
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
                    const dayData = filteredDays.find(d => d.day === day);
                    const coursesForDay = dayData ? dayData.courses.sort((a, b) => a.time.localeCompare(b.time)) : [];

                    return (
                      <td key={day} className="px-6 py-4 text-sm text-gray-700 align-top">
                        <div className="space-y-3">
                          {coursesForDay.length > 0 ? (
                            coursesForDay.map(course => (
                              <div key={course.id} className="bg-green-50 rounded-lg shadow-sm p-3 border border-green-200 hover:shadow-md transition-shadow duration-200">
                                <h3 className="font-bold text-green-800 mb-1 text-base">{course.name}</h3>
                                <p className="text-xs text-gray-600 mb-1">⏰ {course.time}</p>
                                <p className="text-xs text-gray-500 mb-2">ID Docente: {course.teacherId}</p>
                                <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${getCourseTypeColorClass(course.type)}`}>
                                  {course.type}
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
          <div className="py-12 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-green-100">
            {user?.role.name === 'Estudiante' && (
              <>
                <div className="text-gray-300 text-6xl mb-4">📅</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No tienes clases programadas
                </h3>
                <p className="text-gray-500">
                  No hay clases disponibles para tu grado en este momento.
                </p>
              </>
            )}
            {user?.role.name === 'Docente' && (
              <>
                <div className="text-gray-300 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No tienes clases asignadas
                </h3>
                <p className="text-gray-500">
                  No hay clases asignadas a tu ID en este momento.
                </p>
              </>
            )}
            {user?.role.name === 'Apoderado' && (
              <>
                <div className="text-gray-300 text-6xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No hay horarios disponibles
                </h3>
                <p className="text-gray-500">
                  No hay clases programadas para el hijo seleccionado.
                </p>
              </>
            )}
            {user?.role.name === 'Administrador' && (
              <>
                <div className="text-gray-300 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No hay resultados
                </h3>
                <p className="text-gray-500">
                  No hay clases que coincidan con los filtros seleccionados.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulesDash;