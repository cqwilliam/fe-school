import React, { useState, useEffect, useMemo } from 'react';

const CoursesDash = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('Estudiante'); // Default role
  const [selectedChild, setSelectedChild] = useState('');

  const loggedInStudentName = 'Ana Lopez';
  const loggedInTeacherName = 'Profesor Juan'; // Example for a teacher
  const apoderadoChildrenNames = ['Ana Lopez', 'Pedro Gomez'];

  const coursesData = [
    { id: 1, name: 'Matemáticas', type: '4°', teacher: 'Profesor Juan', students: ['Ana Lopez', 'Sofia Vargas'] },
    { id: 2, name: 'Física', type: '4°', teacher: 'Profesor Juan', students: ['Ana Lopez', 'Carlos Ruiz'] },
    { id: 3, name: 'Programación', type: '5°', teacher: 'Profesora Maria', students: ['Pedro Gomez', 'Luis Garcia'] },
    { id: 4, name: 'Historia', type: '2°', teacher: 'Profesora Laura', students: ['Ana Lopez', 'Maria Solis'] },
    { id: 5, name: 'Química', type: '1°', teacher: 'Profesor Roberto', students: ['Sofia Vargas', 'Carlos Ruiz', 'Luis Garcia'] },
    { id: 6, name: 'Arte', type: '3°', teacher: 'Profesor Juan', students: ['Pedro Gomez', 'Maria Solis'] },
    { id: 7, name: 'Educación Física', type: '5°', teacher: 'Profesora Elena', students: ['Maria Solis', 'Pedro Gomez'] },
  ];

  useEffect(() => {
    if (role === 'Apoderado' && apoderadoChildrenNames.length > 0 && !selectedChild) {
      setSelectedChild(apoderadoChildrenNames[0]);
    }
  }, [role, apoderadoChildrenNames, selectedChild]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setSearchTerm('');
    if (newRole !== 'Apoderado') {
      setSelectedChild('');
    } else if (apoderadoChildrenNames.length > 0) {
      setSelectedChild(apoderadoChildrenNames[0]);
    }
  };

  const filteredCourses = useMemo(() => {
    return coursesData.filter(course => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.type.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesRoleSpecificFilter = true;

      if (role === 'Estudiante') {
        matchesRoleSpecificFilter = course.students.includes(loggedInStudentName);
      } else if (role === 'Docente') {
        matchesRoleSpecificFilter = course.teacher === loggedInTeacherName;
      } else if (role === 'Apoderado') {
        matchesRoleSpecificFilter = selectedChild ? course.students.includes(selectedChild) : false;
      }
      return matchesSearch && matchesRoleSpecificFilter;
    });
  }, [searchTerm, role, loggedInStudentName, loggedInTeacherName, selectedChild, coursesData]);

  const CourseSummaryCard = ({ summary, title }: { summary: any, title: string }) => (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-md border border-green-100 animate-fade-in">
      <h2 className="text-xl font-semibold text-green-800 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm font-medium text-green-700">Total de Cursos</p>
            <p className="text-2xl font-bold text-green-900">{summary.totalCourses}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13.5m0-13.5c-4.142 0-7.5 3.133-7.5 7s3.358 7 7.5 7h.75c2.201 0 4-1.799 4-4v-3.75c0-2.201-1.799-4-4-4H12z" />
          </svg>
        </div>
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
      const assignedCourses = coursesData.filter(course => course.students.includes(loggedInStudentName)).length;
      return { totalCourses, assignedCourses };
    }
    return null;
  }, [role, loggedInStudentName, coursesData]);

  const apoderadoChildCourseSummary = useMemo(() => {
    if (role === 'Apoderado' && selectedChild) {
      const totalCourses = coursesData.length;
      const assignedCourses = coursesData.filter(course => course.students.includes(selectedChild)).length;
      return { totalCourses, assignedCourses };
    }
    return null;
  }, [role, selectedChild, coursesData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-green-900 mb-2">Panel de Cursos</h1>
          <p className="text-green-700 text-lg">Visualiza los cursos disponibles y tus asignaciones.</p>
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

        {role === 'Administrador' && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-green-200 animate-fade-in">
            <h2 className="text-xl font-semibold text-green-800 mb-4 border-b pb-3 border-green-100">Acciones de Administrador</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Añadir Nuevo Curso
              </button>
              <button className="px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Gestionar Horarios
              </button>
              <button className="px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zm-6 9A6 6 0 009 9.13l.426-.213A7 7 0 0115 10a7 7 0 01-.577 2.87l-.426-.213A6 6 0 0013 9zM10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                Asignar Profesores
              </button>
              <button className="px-6 py-3 bg-green-700 text-white rounded-lg shadow-md hover:bg-green-800 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Exportar Lista
              </button>
            </div>
          </div>
        )}

        {role === 'Apoderado' && apoderadoChildrenNames.length > 0 && (
          <div className="mb-6 bg-white p-6 rounded-xl shadow-lg border border-green-200 animate-fade-in">
            <h2 className="text-xl font-semibold text-green-800 mb-4 border-b pb-3 border-green-100">Selecciona un Hijo:</h2>
            <select
              className="w-full px-5 py-2 border border-green-300 rounded-lg bg-green-50 text-green-900 focus:outline-none focus:ring-3 focus:ring-green-400 transition-all duration-300 shadow-sm appearance-none pr-8"
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
          <div className="py-12 text-center text-green-600 bg-white rounded-xl shadow-lg border border-green-200 mb-6">
            <p className="text-lg font-medium">
              {apoderadoChildrenNames.length === 0 ? (
                'No se encontraron hijos asociados a tu cuenta de apoderado.'
              ) : (
                'Por favor, selecciona un hijo para ver sus cursos.'
              )}
            </p>
          </div>
        )}

        {role === 'Estudiante' && studentCourseSummary && (
          <CourseSummaryCard summary={studentCourseSummary} title={`Resumen de Cursos de ${loggedInStudentName}`} />
        )}

        {role === 'Apoderado' && selectedChild && apoderadoChildCourseSummary && (
          <CourseSummaryCard summary={apoderadoChildCourseSummary} title={`Resumen de Cursos de ${selectedChild}`} />
        )}

        <div className="space-y-6">
          {filteredCourses.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden animate-fade-in">
              <table className="min-w-full divide-y divide-green-200">
                <thead className="bg-green-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Curso
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Tipo/Grado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                      Profesor
                    </th>
                    {(role === 'Administrador' || role === 'Docente') && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                        Estudiantes
                      </th>
                    )}
                    {role === 'Administrador' && (
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-green-100">
                  {filteredCourses.map(course => (
                    <tr key={course.id} className="hover:bg-green-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-900">
                        {course.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                        {course.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                        {course.teacher}
                      </td>
                      {(role === 'Administrador' || role === 'Docente') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700">
                          {course.students.join(', ')}
                        </td>
                      )}
                      {role === 'Administrador' && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-green-600 hover:text-green-800 mr-4 transition-colors duration-150">Editar</a>
                          <a href="#" className="text-red-500 hover:text-red-700 transition-colors duration-150">Eliminar</a>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-green-600 bg-white rounded-xl shadow-lg border border-green-200">
              <p className="text-lg font-medium">
                No hay cursos disponibles para los filtros y el rol seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesDash;