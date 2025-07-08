import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- Simulated Backend Data ---
const allStudentsData = [
  { id: 's1', name: 'Ana Lopez' },
  { id: 's2', name: 'Sofia Vargas' },
  { id: 's3', name: 'Carlos Ruiz' },
  { id: 's4', name: 'Pedro Gomez' },
  { id: 's5', name: 'Luis Garcia' },
  { id: 's6', name: 'Maria Solis' },
];

const coursesData = [
  { id: 1, name: 'Matemáticas', type: '4°', teacher: 'Profesor Juan', studentIds: ['s1', 's2'] },
  { id: 2, name: 'Física', type: '4°', teacher: 'Profesor Juan', studentIds: ['s1', 's3'] },
  { id: 3, name: 'Programación', type: '5°', teacher: 'Profesora Maria', studentIds: ['s4', 's5'] },
  { id: 4, name: 'Historia', type: '2°', teacher: 'Profesora Laura', studentIds: ['s1', 's6'] },
  { id: 5, name: 'Química', type: '1°', teacher: 'Profesor Roberto', studentIds: ['s2', 's3', 's5'] },
  { id: 6, name: 'Arte', type: '3°', teacher: 'Profesor Juan', studentIds: ['s4', 's6'] },
  { id: 7, name: 'Educación Física', type: '5°', teacher: 'Profesora Elena', studentIds: ['s6', 's4'] },
];

// Mock Schedule - defines which courses happen on which days
// Note: This needs to reflect all days for which attendance data might exist for students.
const mockSchedule = {
  '2025-06-10': [1, 2, 3, 4, 5, 6, 7], // All courses could be scheduled
  '2025-06-11': [1, 3, 4, 7, 2],
  '2025-06-12': [2, 5, 6, 1, 3],
  '2025-06-13': [1, 3, 5, 4, 7],
  '2025-06-14': [2, 6, 4],
};

// --- End Simulated Backend Data ---

const AttendancesDash = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('Estudiante');
  const [selectedChildId, setSelectedChildId] = useState('');
  // For student/apoderado, we might not need a single selectedDate initially,
  // but rather a range or a list of available dates.
  // For simplicity, we'll keep `selectedDate` to filter the *display*, but the student view will iterate dates.
  const [selectedDate, setSelectedDate] = useState(new Date('2025-06-10').toISOString().slice(0, 10)); 

  // Store attendance with a unique key: `${date}_${courseId}_${studentId}`
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null); // For Admin/Teacher to expand student list
  const [expandedDate, setExpandedDate] = useState<string | null>(null); // For Student/Apoderado to expand specific date details


  // Simulated logged-in user data
  const loggedInStudentId = 's1';
  const loggedInTeacherName = 'Profesor Juan';
  const apoderadoChildrenIds = ['s1', 's4']; // IDs of children for the guardian

  // Helper to get student name by ID
  const getStudentNameById = useCallback((studentId: string) => {
    return allStudentsData.find(s => s.id === studentId)?.name || 'Estudiante Desconocido';
  }, []);

  // Helper to get course by ID
  const getCourseById = useCallback((courseId: number) => {
    return coursesData.find(c => c.id === courseId);
  }, []);

  // Simulate fetching and populating attendance records for all mock dates
  useEffect(() => {
    const initialRecords: Record<string, string> = {};

    const mockAttendanceData = [
      // 2025-06-10
      { date: '2025-06-10', courseId: 1, studentId: 's1', status: 'Presente' }, // Ana Matemáticas
      { date: '2025-06-10', courseId: 4, studentId: 's1', status: 'Ausente' },   // Ana Historia
      { date: '2025-06-10', courseId: 2, studentId: 's1', status: 'Tardanza' },  // Ana Física (new for s1)
      { date: '2025-06-10', courseId: 3, studentId: 's4', status: 'Ausente' },   // Pedro Programación
      { date: '2025-06-10', courseId: 6, studentId: 's4', status: 'Presente' },  // Pedro Arte

      // 2025-06-11
      { date: '2025-06-11', courseId: 1, studentId: 's1', status: 'Tardanza' },
      { date: '2025-06-11', courseId: 4, studentId: 's1', status: 'Presente' },
      { date: '2025-06-11', courseId: 3, studentId: 's4', status: 'Presente' },
      { date: '2025-06-11', courseId: 7, studentId: 's6', status: 'Presente' },

      // 2025-06-12
      { date: '2025-06-12', courseId: 5, studentId: 's2', status: 'Presente' },
      { date: '2025-06-12', courseId: 4, studentId: 's1', status: 'Ausente' },
      { date: '2025-06-12', courseId: 5, studentId: 's3', status: 'Presente' },
    ];

    // Iterate through all mock schedule dates to set initial attendance
    Object.keys(mockSchedule).forEach(date => {
        const courseIdsForDate = mockSchedule[date];
        courseIdsForDate.forEach(courseId => {
            const course = getCourseById(courseId);
            if (course) {
                course.studentIds.forEach(studentId => {
                    const key = `${date}_${course.id}_${studentId}`;
                    const existingRecord = mockAttendanceData.find(
                        (record) => record.date === date && record.courseId === course.id && record.studentId === studentId
                    );
                    initialRecords[key] = existingRecord?.status || 'No Registrado';
                });
            }
        });
    });
    setAttendanceRecords(initialRecords);
  }, [getCourseById]);

  useEffect(() => {
    if (role === 'Apoderado' && apoderadoChildrenIds.length > 0 && !selectedChildId) {
      setSelectedChildId(apoderadoChildrenIds[0]);
    }
  }, [role, apoderadoChildrenIds, selectedChildId]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setSearchTerm('');
    setSelectedChildId(''); // Reset selected child when role changes
    setExpandedCourseId(null); // Collapse any expanded courses for Admin/Teacher
    setExpandedDate(null); // Collapse any expanded dates for Student/Apoderado
    if (newRole === 'Apoderado' && apoderadoChildrenIds.length > 0) {
      setSelectedChildId(apoderadoChildrenIds[0]);
    }
  };

  const handleAttendanceChange = (courseId: number, studentId: string, date: string, status: string) => {
    const key = `${date}_${courseId}_${studentId}`;
    setAttendanceRecords(prev => ({
      ...prev,
      [key]: status
    }));
    // In a real application, you'd send this update to your backend API
    console.log(`Attendance for ${getStudentNameById(studentId)} in ${getCourseById(courseId)?.name} on ${date} set to: ${status}`);
  };

  const getAttendanceStatus = useCallback((date: string, courseId: number, studentId: string) => {
    const key = `${date}_${courseId}_${studentId}`;
    return attendanceRecords[key] || 'No Registrado';
  }, [attendanceRecords]);

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Presente':
        return 'bg-green-100 text-green-800';
      case 'Ausente':
        return 'bg-red-100 text-red-800';
      case 'Tardanza':
        return 'bg-yellow-100 text-yellow-800';
      case 'Justificado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtered courses for Admin/Teacher views based on selectedDate and search term
  const dailyCoursesAdminTeacher = useMemo(() => {
    const courseIdsForToday = mockSchedule[selectedDate] || [];
    const courses = coursesData.filter(course => courseIdsForToday.includes(course.id));

    const searchedCourses = courses.filter(course =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (role === 'Docente') {
      return searchedCourses.filter(course => course.teacher === loggedInTeacherName);
    } else if (role === 'Administrador') {
      return searchedCourses;
    }
    return [];
  }, [selectedDate, searchTerm, role, loggedInTeacherName]);

  // Data for Student view (grouped by date)
  const studentAttendanceByDate = useMemo(() => {
    if (role !== 'Estudiante') return {};

    const studentDailyRecords: Record<string, any[]> = {};
    const sortedDates = Object.keys(mockSchedule).sort((a, b) => b.localeCompare(a)); // Sort dates descending

    sortedDates.forEach(date => {
      const courseIdsForDate = mockSchedule[date] || [];
      const coursesForStudentOnDate = coursesData.filter(course =>
        courseIdsForDate.includes(course.id) && course.studentIds.includes(loggedInStudentId)
      );

      const recordsForDate = coursesForStudentOnDate.map(course => ({
        courseId: course.id, // Keep courseId for unique keys
        courseName: course.name,
        courseType: course.type,
        teacher: course.teacher,
        status: getAttendanceStatus(date, course.id, loggedInStudentId),
      })).filter(record =>
        // Filter by search term for student view
        record.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.teacher.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (recordsForDate.length > 0) {
        studentDailyRecords[date] = recordsForDate;
      }
    });
    return studentDailyRecords;
  }, [role, loggedInStudentId, searchTerm, getAttendanceStatus]);

  // Data for Apoderado view (grouped by date for selected child)
  const apoderadoAttendanceByDate = useMemo(() => {
    if (role !== 'Apoderado' || !selectedChildId) return {};

    const childDailyRecords: Record<string, any[]> = {};
    const sortedDates = Object.keys(mockSchedule).sort((a, b) => b.localeCompare(a)); // Sort dates descending

    sortedDates.forEach(date => {
      const courseIdsForDate = mockSchedule[date] || [];
      const coursesForChildOnDate = coursesData.filter(course =>
        courseIdsForDate.includes(course.id) && course.studentIds.includes(selectedChildId)
      );

      const recordsForDate = coursesForChildOnDate.map(course => ({
        courseId: course.id, // Keep courseId for unique keys
        courseName: course.name,
        courseType: course.type,
        teacher: course.teacher,
        status: getAttendanceStatus(date, course.id, selectedChildId),
      })).filter(record =>
        // Filter by search term for apoderado view
        record.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.teacher.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (recordsForDate.length > 0) {
        childDailyRecords[date] = recordsForDate;
      }
    });
    return childDailyRecords;
  }, [role, selectedChildId, searchTerm, getAttendanceStatus]);

  // Summaries based on course assignments (unchanged)
  const CourseSummaryCard = ({ summary, title }: { summary: any, title: string }) => (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-green-100 animate-fade-in">
      <h2 className="text-xl font-semibold text-green-800 mb-4">{title}</h2>
      <div className="grid gap-4">
        
        <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-green-700">Cursos Asignados</p>
            <p className="text-2xl font-bold text-green-900">{summary.assignedCourses}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  );

  const studentCourseSummary = useMemo(() => {
    if (role === 'Estudiante') {
      const totalCourses = coursesData.length;
      const assignedCourses = coursesData.filter(course => course.studentIds.includes(loggedInStudentId)).length;
      return { totalCourses, assignedCourses };
    }
    return null;
  }, [role, loggedInStudentId, coursesData]);

  const apoderadoChildCourseSummary = useMemo(() => {
    if (role === 'Apoderado' && selectedChildId) {
      const totalCourses = coursesData.length;
      const assignedCourses = coursesData.filter(course => course.studentIds.includes(selectedChildId)).length;
      return { totalCourses, assignedCourses };
    }
    return null;
  }, [role, selectedChildId, coursesData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-green-900 mb-2">Panel de Asistencia</h1>
          <p className="text-green-700 text-lg">Gestiona y visualiza la asistencia de estudiantes en sus respectivos cursos.</p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-3 items-center justify-center bg-white p-4 rounded-xl shadow-lg border border-green-100">
          <div className="flex gap-2 flex-wrap justify-center mb-4 sm:mb-0">
            <button
              onClick={() => handleRoleChange('Administrador')}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${role === 'Administrador' ? 'bg-green-600 text-white shadow-lg shadow-green-300' : 'bg-white text-green-700 border border-green-300 hover:bg-green-50 hover:border-green-400'}`}
            >
              Administrador
            </button>
            <button
              onClick={() => handleRoleChange('Estudiante')}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${role === 'Estudiante' ? 'bg-green-600 text-white shadow-lg shadow-green-300' : 'bg-white text-green-700 border border-green-300 hover:bg-green-50 hover:border-green-400'}`}
            >
              Estudiante
            </button>
            <button
              onClick={() => handleRoleChange('Docente')}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${role === 'Docente' ? 'bg-green-600 text-white shadow-lg shadow-green-300' : 'bg-white text-green-700 border border-green-300 hover:bg-green-50 hover:border-green-400'}`}
            >
              Docente
            </button>
            <button
              onClick={() => handleRoleChange('Apoderado')}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${role === 'Apoderado' ? 'bg-green-600 text-white shadow-lg shadow-green-300' : 'bg-white text-green-700 border border-green-300 hover:bg-green-50 hover:border-green-400'}`}
            >
              Apoderado
            </button>
          </div>

          <div className="w-full sm:w-auto sm:flex-grow">
            <input
              type="text"
              placeholder="Buscar curso, profesor o grado..."
              className="w-full px-5 py-2 border border-green-300 rounded-full bg-white text-green-900 placeholder-green-500 focus:outline-none focus:ring-3 focus:ring-green-400 focus:border-transparent transition-all duration-300 shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {(role === 'Administrador' || role === 'Docente') && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-green-200 animate-fade-in">
            <h2 className="text-xl font-semibold text-green-800 mb-4 border-b pb-3 border-green-100">
              Gestión de Asistencia para el día: <span className="font-bold text-green-900">{selectedDate}</span>
            </h2>
            <input
              type="date"
              className="w-full px-5 py-2 border border-green-300 rounded-lg bg-green-50 text-green-900 focus:outline-none focus:ring-3 focus:ring-green-400 transition-all duration-300 shadow-sm"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setExpandedCourseId(null); // Collapse any expanded course when date changes
              }}
            />
          </div>
        )}

        {role === 'Apoderado' && apoderadoChildrenIds.length > 0 && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-green-200 animate-fade-in">
            <h2 className="text-xl font-semibold text-green-800 mb-4 border-b pb-3 border-green-100">Selecciona un Hijo:</h2>
            <select
              className="w-full px-5 py-2 border border-green-300 rounded-lg bg-green-50 text-green-900 focus:outline-none focus:ring-3 focus:ring-green-400 transition-all duration-300 shadow-sm appearance-none pr-8"
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
            >
              {apoderadoChildrenIds.map(childId => (
                <option key={childId} value={childId}>
                  {getStudentNameById(childId)}
                </option>
              ))}
            </select>
          </div>
        )}

        {role === 'Apoderado' && (!selectedChildId || apoderadoChildrenIds.length === 0) && (
          <div className="py-12 text-center text-green-600 bg-white rounded-xl shadow-lg border border-green-200 mb-6">
            <p className="text-lg font-medium">
              {apoderadoChildrenIds.length === 0 ? (
                'No se encontraron hijos asociados a tu cuenta de apoderado.'
              ) : (
                'Por favor, selecciona un hijo para ver sus cursos y asistencia.'
              )}
            </p>
          </div>
        )}

        {role === 'Estudiante' && studentCourseSummary && (
          <CourseSummaryCard summary={studentCourseSummary} title={`Resumen de Cursos de ${getStudentNameById(loggedInStudentId)}`} />
        )}

        {role === 'Apoderado' && selectedChildId && apoderadoChildCourseSummary && (
          <CourseSummaryCard summary={apoderadoChildCourseSummary} title={`Resumen de Cursos de ${getStudentNameById(selectedChildId)}`} />
        )}

        <div className="space-y-6">
          {/* Student View (Grouped by Date) */}
          {role === 'Estudiante' && (
            Object.keys(studentAttendanceByDate).length > 0 ? (
              Object.keys(studentAttendanceByDate).map(date => (
                <div key={date} className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden animate-fade-in">
                  <div
                    className="px-6 py-4 bg-green-50 border-b border-green-100 cursor-pointer flex justify-between items-center"
                    onClick={() => setExpandedDate(expandedDate === date ? null : date)}
                  >
                    <div>
                      <h3 className="text-lg font-bold text-green-800">Asistencia del {date}</h3>
                    </div>
                    <svg
                      className={`w-6 h-6 text-green-600 transform transition-transform duration-200 ${expandedDate === date ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {expandedDate === date && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-green-200">
                        <thead className="bg-green-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                              Curso (Grado)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                              Profesor
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-green-100">
                          {studentAttendanceByDate[date].map((record, index) => (
                            <tr key={`${date}-${record.courseId}-${index}`} className="hover:bg-green-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                                {record.courseName} ({record.courseType})
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                                {record.teacher}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(record.status)}`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-green-600 bg-white rounded-xl shadow-lg border border-green-200">
                <p className="text-lg font-medium">
                  No se encontraron registros de asistencia para los filtros seleccionados.
                </p>
              </div>
            )
          )}

          {role === 'Apoderado' && selectedChildId && (
            Object.keys(apoderadoAttendanceByDate).length > 0 ? (
              Object.keys(apoderadoAttendanceByDate).map(date => (
                <div key={date} className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden animate-fade-in">
                  <div
                    className="px-6 py-4 bg-green-50 border-b border-green-100 cursor-pointer flex justify-between items-center"
                    onClick={() => setExpandedDate(expandedDate === date ? null : date)}
                  >
                    <div>
                      <h3 className="text-lg font-bold text-green-800">Asistencia de {getStudentNameById(selectedChildId)} del {date}</h3>
                      <p className="text-sm text-green-600">Cursos registrados: {apoderadoAttendanceByDate[date].length}</p>
                    </div>
                    <svg
                      className={`w-6 h-6 text-green-600 transform transition-transform duration-200 ${expandedDate === date ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {expandedDate === date && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-green-200">
                        <thead className="bg-green-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                              Curso (Grado)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                              Profesor
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-green-100">
                          {apoderadoAttendanceByDate[date].map((record, index) => (
                            <tr key={`${date}-${record.courseId}-${index}`} className="hover:bg-green-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                                {record.courseName} ({record.courseType})
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                                {record.teacher}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(record.status)}`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-green-600 bg-white rounded-xl shadow-lg border border-green-200">
                <p className="text-lg font-medium">
                  No se encontraron registros de asistencia para {getStudentNameById(selectedChildId)} para los filtros seleccionados.
                </p>
              </div>
            )
          )}


          {/* Admin/Teacher View (Courses for the selected day, with expandable student lists) */}
          {(role === 'Administrador' || role === 'Docente') && (
            dailyCoursesAdminTeacher.length > 0 ? (
              dailyCoursesAdminTeacher.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden animate-fade-in">
                  <div
                    className="px-6 py-4 bg-green-50 border-b border-green-100 cursor-pointer flex justify-between items-center"
                    onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
                  >
                    <div>
                      <h3 className="text-lg font-bold text-green-800">{course.name} ({course.type})</h3>
                      <p className="text-sm text-green-600">Profesor: {course.teacher}</p>
                    </div>
                    <svg
                      className={`w-6 h-6 text-green-600 transform transition-transform duration-200 ${expandedCourseId === course.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  {expandedCourseId === course.id && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-green-200">
                        <thead className="bg-green-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                              Estudiante
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                              Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                              Modificar Asistencia
                            </th>
                            {role === 'Administrador' && (
                              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                                Acciones
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-green-100">
                          {course.studentIds.map(studentId => {
                            const studentName = getStudentNameById(studentId);
                            const currentStatus = getAttendanceStatus(selectedDate, course.id, studentId);

                            return (
                              <tr key={`${course.id}-${studentId}`} className="hover:bg-green-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                                  {studentName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(currentStatus)}`}>
                                    {currentStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <div className="flex flex-wrap gap-2">
                                    {['Presente', 'Tardanza', 'Ausente', 'Justificado'].map(status => (
                                      <button
                                        key={status}
                                        onClick={() => handleAttendanceChange(course.id, studentId, selectedDate, status)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200
                                          ${currentStatus === status
                                            ? 'bg-green-600 text-white shadow-sm'
                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                          }`}
                                      >
                                        {status}
                                      </button>
                                    ))}
                                  </div>
                                </td>
                                {role === 'Administrador' && (
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-green-600 hover:text-green-800 mr-4 transition-colors duration-150">Editar</a>
                                    <a href="#" className="text-red-500 hover:text-red-700 transition-colors duration-150">Eliminar</a>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-green-600 bg-white rounded-xl shadow-lg border border-green-200">
                <p className="text-lg font-medium">
                  No hay cursos programados para el **{selectedDate}** con los filtros y rol seleccionados.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancesDash;