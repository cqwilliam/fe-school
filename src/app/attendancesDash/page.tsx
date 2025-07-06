import React, { useState, useEffect, useMemo } from 'react';

const AttendancesDash = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('Estudiante');
  const [selectedChild, setSelectedChild] = useState('');

  const loggedInStudentName = 'Ana Lopez';
  const apoderadoChildrenNames = ['Ana Lopez', 'Pedro Gomez'];

  useEffect(() => {
    if (role === 'Apoderado' && apoderadoChildrenNames.length > 0 && !selectedChild) {
      setSelectedChild(apoderadoChildrenNames[0]);
    }
  }, [role, apoderadoChildrenNames, selectedChild]);

  const attendanceData = [
    {
      day: 'Lunes',
      date: '10 Jun',
      attendances: [
        { id: 1, student: 'Ana Lopez', course: 'Matemáticas', time: '08:00 - 10:00', type: '4°', status: 'Presente' },
        { id: 2, student: 'Pedro Gomez', course: 'Programación', time: '14:00 - 16:00', type: '5°', status: 'Ausente' }
      ]
    },
    {
      day: 'Martes',
      date: '11 Jun',
      attendances: [
        { id: 3, student: 'Ana Lopez', course: 'Física', time: '10:00 - 12:00', type: '4°', status: 'Presente' },
        { id: 13, student: 'Maria Solis', course: 'Educación Física', time: '10:00 - 12:00', type: '5°', status: 'Tardanza' },
        { id: 14, student: 'Carlos Ruiz', course: 'Química', time: '08:00 - 10:00', type: '1°', status: 'Presente' },
        { id: 15, student: 'Luis Garcia', course: 'Química', time: '08:00 - 10:00', type: '1°', status: 'Ausente Justificada' },
      ]
    },
    {
      day: 'Miércoles',
      date: '12 Jun',
      attendances: [
        { id: 4, student: 'Sofia Vargas', course: 'Química', time: '08:00 - 10:00', type: '1°', status: 'Presente' },
        { id: 5, student: 'Ana Lopez', course: 'Historia', time: '11:00 - 13:00', type: '2°', status: 'Presente' },
        { id: 8, student: 'Luis Garcia', course: 'Química', time: '08:00 - 10:00', type: '1°', status: 'Presente' },
        { id: 9, student: 'Sofia Vargas', course: 'Química', time: '08:00 - 10:00', type: '1°', status: 'Presente' },
        { id: 10, student: 'Carlos Ruiz', course: 'Química', time: '08:00 - 10:00', type: '1°', status: 'Presente' },
      ]
    },
    {
      day: 'Jueves',
      date: '13 Jun',
      attendances: [
        { id: 6, student: 'Pedro Gomez', course: 'Arte', time: '09:00 - 11:00', type: '3°', status: 'Presente' }
      ]
    },
    {
      day: 'Viernes',
      date: '14 Jun',
      attendances: [
        { id: 7, student: 'Maria Solis', course: 'Educación Física', time: '10:00 - 12:00', type: '5°', status: 'Presente' },
        { id: 11, student: 'Carlos Ruiz', course: 'Química', time: '08:00 - 10:00', type: '1°', status: 'Presente' },
        { id: 12, student: 'Luis Garcia', course: 'Química', time: '08:00 - 10:00', type: '1°', status: 'Presente' },
      ]
    }
  ];

  const filteredDays = attendanceData.map(day => ({
    ...day,
    attendances: day.attendances.filter(attendance => {
      const matchesSearch =
        attendance.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendance.student.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesRoleSpecificFilter = true;

      if (role === 'Estudiante') {
        matchesRoleSpecificFilter = attendance.student === loggedInStudentName;
      } else if (role === 'Docente') {
        const teacherCourses = ['Matemáticas', 'Física', 'Programación', 'Educación Física', 'Historia', 'Química', 'Arte'];
        matchesRoleSpecificFilter = teacherCourses.includes(attendance.course);
      } else if (role === 'Apoderado') {
        matchesRoleSpecificFilter = selectedChild ? attendance.student === selectedChild : false;
      }
      return matchesSearch && matchesRoleSpecificFilter;
    })
  })).filter(day => day.attendances.length > 0);

  // Nueva función para calcular el resumen de asistencia para cualquier estudiante
  const calculateStudentSummary = (studentName: string) => {
    let present = 0;
    let absent = 0;
    let tardy = 0;
    let justifiedAbsent = 0;
    let totalClasses = 0;

    const allStudentAttendances = attendanceData.flatMap(day =>
      day.attendances.filter(att => att.student === studentName)
    );

    allStudentAttendances.forEach(att => {
      totalClasses++;
      switch (att.status) {
        case 'Presente':
          present++;
          break;
        case 'Ausente':
          absent++;
          break;
        case 'Tardanza':
          tardy++;
          break;
        case 'Ausente Justificada':
          justifiedAbsent++;
          break;
        default:
          break;
      }
    });

    const attendancePercentage = totalClasses > 0
      ? ((present + justifiedAbsent) / totalClasses * 100).toFixed(2)
      : '0.00';

    return {
      present,
      absent,
      tardy,
      justifiedAbsent,
      totalClasses,
      attendancePercentage
    };
  };

  // Resumen para el estudiante logueado (si el rol es Estudiante)
  const studentAttendanceSummary = useMemo(() => {
    if (role === 'Estudiante') {
      return calculateStudentSummary(loggedInStudentName);
    }
    return null;
  }, [role, loggedInStudentName, attendanceData]);

  // Resumen para el hijo seleccionado (si el rol es Apoderado y hay un hijo seleccionado)
  const apoderadoChildAttendanceSummary = useMemo(() => {
    if (role === 'Apoderado' && selectedChild) {
      return calculateStudentSummary(selectedChild);
    }
    return null;
  }, [role, selectedChild, attendanceData]);


  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setSearchTerm('');
    if (newRole !== 'Apoderado') {
      setSelectedChild('');
    } else if (apoderadoChildrenNames.length > 0) {
      setSelectedChild(apoderadoChildrenNames[0]);
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'Presente':
        return 'bg-green-100 text-green-800';
      case 'Ausente':
        return 'bg-red-100 text-red-800';
      case 'Tardanza':
        return 'bg-yellow-100 text-yellow-800';
      case 'Ausente Justificada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Componente reutilizable para mostrar el resumen de asistencia
  const AttendanceSummaryCard = ({ summary, studentName }: { summary: any, studentName: string }) => (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Asistencia de {studentName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-green-700">Presente</p>
            <p className="text-2xl font-bold text-green-900">{summary.present}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="bg-red-50 p-4 rounded-lg flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-red-700">Ausente</p>
            <p className="text-2xl font-bold text-red-900">{summary.absent}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-yellow-700">Tardanza</p>
            <p className="text-2xl font-bold text-yellow-900">{summary.tardy}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-blue-700">Ausente Justificada</p>
            <p className="text-2xl font-bold text-blue-900">{summary.justifiedAbsent}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Panel de Asistencia</h1>
          <p className="text-gray-500">Semana del 10 al 14 de junio</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex gap-2 flex-wrap mb-4 sm:mb-0">
            <button
              onClick={() => handleRoleChange('Administrador')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${role === 'Administrador' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
            >
              Administrador
            </button>
            <button
              onClick={() => handleRoleChange('Estudiante')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${role === 'Estudiante' ? 'bg-green-600 text-white shadow-md' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
            >
              Estudiante
            </button>
            <button
              onClick={() => handleRoleChange('Docente')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${role === 'Docente' ? 'bg-yellow-600 text-white shadow-md' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}
            >
              Docente
            </button>
            <button
              onClick={() => handleRoleChange('Apoderado')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${role === 'Apoderado' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
            >
              Apoderado
            </button>
          </div>

          <input
            type="text"
            placeholder="Buscar clase o estudiante..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        {role === 'Administrador' && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Acciones de Administrador</h2>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200">
                Marcar Asistencia por Curso
              </button>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200">
                Editar Asistencias
              </button>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200">
                Asistencia Masiva (Marcar todos Presentes)
              </button>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200">
                Ver Reportes Generales
              </button>
              <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200">
                Exportar Estadísticas
              </button>
            </div>
          </div>
        )}

        {role === 'Apoderado' && apoderadoChildrenNames.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-medium text-gray-800 mb-2">Selecciona un Hijo:</h2>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-sm"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              {apoderadoChildrenNames.map(childName => (
                <option key={childName} value={childName}>
                  {childName}
                </option>
              ))}
            </select>
          </div>
        )}

        {role === 'Apoderado' && (!selectedChild || apoderadoChildrenNames.length === 0) && (
          <div className="py-6 text-center text-gray-600 bg-white rounded-lg shadow-sm mb-6">
            {apoderadoChildrenNames.length === 0 ? (
              <p>No se encontraron hijos asociados a tu cuenta de apoderado.</p>
            ) : (
              <p>Por favor, selecciona un hijo para ver sus asistencias.</p>
            )}
          </div>
        )}

        {role === 'Estudiante' && studentAttendanceSummary && (
          <AttendanceSummaryCard summary={studentAttendanceSummary} studentName={loggedInStudentName} />
        )}

        {role === 'Apoderado' && selectedChild && apoderadoChildAttendanceSummary && (
          <AttendanceSummaryCard summary={apoderadoChildAttendanceSummary} studentName={selectedChild} />
        )}

        <div className="space-y-6">
          {filteredDays.length > 0 ? (
            filteredDays.map(day => (
              <div key={day.day} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">{day.day}</h2>
                  <p className="text-sm text-gray-400">{day.date}</p>
                </div>

                <div className="overflow-x-auto">
                  {role === 'Docente' ? (
                    Object.entries(
                      day.attendances.reduce((acc: Record<string, typeof day.attendances>, attendance) => {
                        if (!acc[attendance.course]) {
                          acc[attendance.course] = [];
                        }
                        acc[attendance.course].push(attendance);
                        return acc;
                      }, {} as Record<string, typeof day.attendances>)
                    ).map(([course, attendances]) => (
                      <div key={course} className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2 px-4 py-2 bg-gray-50 rounded-t-lg">
                          {course}
                        </h3>
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estudiante
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hora
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Grado
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {attendances.map(attendance => (
                              <tr key={attendance.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {attendance.student}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {attendance.time}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(attendance.status)}`}>
                                    {attendance.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {attendance.type}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {role !== 'Estudiante' && ( // No mostrar "Estudiante" si es la vista del propio estudiante
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estudiante
                            </th>
                          )}
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Curso
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hora
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          {(role === 'Administrador' || role === 'Docente' || role === 'Apoderado') && (
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Grado/Tipo
                            </th>
                          )}
                          {role === 'Administrador' && (
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {day.attendances.map(attendance => (
                          <tr key={attendance.id} className="hover:bg-gray-50">
                            {role !== 'Estudiante' && ( // No mostrar el nombre del estudiante si es el propio estudiante
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {attendance.student}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {attendance.course}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {attendance.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(attendance.status)}`}>
                                {attendance.status}
                              </span>
                            </td>
                            {(role === 'Administrador' || role === 'Docente' || role === 'Apoderado') && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {attendance.type}
                              </td>
                            )}
                            {role === 'Administrador' && (
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</a>
                                <a href="#" className="text-red-600 hover:text-red-900">Eliminar</a>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500 bg-white rounded-lg shadow-sm">
              No hay registros de asistencia para los filtros y el rol seleccionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancesDash;