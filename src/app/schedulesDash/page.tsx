import React, { useState, useMemo } from 'react'; // Importamos useMemo para optimización

const ScheduleDash = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRole, setActiveRole] = useState('all'); // 'all', 'admin', 'student', 'teacher', 'parent'
  const [adminSelectedType, setAdminSelectedType] = useState('Todos'); // Estado para el filtro de sección del administrador
  const [parentSelectedChildType, setParentSelectedChildType] = useState(''); // Nuevo estado para el tipo de clase del hijo del apoderado

  const STUDENT_DEFAULT_TYPE = '1°';
  const TEACHER_DEFAULT_ID = 'T001';
  const APODERADO_CHILDREN_INFO = useMemo(() => [
    { name: 'Ana Lopez', type: '4°' },
    { name: 'Pedro Gomez', type: '5°' },
  ], []); // Información de hijos y sus tipos/grados

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
  ))].sort(), [scheduleData]);

  const apoderadoChildrenNames = useMemo(() => APODERADO_CHILDREN_INFO.map(child => child.name), [APODERADO_CHILDREN_INFO]);

  React.useEffect(() => {
    if (activeRole === 'parent' && APODERADO_CHILDREN_INFO.length > 0) {
      const currentSelectedChildExists = APODERADO_CHILDREN_INFO.some(child => child.name === parentSelectedChildType);
      if (!parentSelectedChildType || !currentSelectedChildExists) {
        setParentSelectedChildType(APODERADO_CHILDREN_INFO[0].name);
      }
    } else if (activeRole !== 'parent') {
      setParentSelectedChildType(''); // Limpiar si el rol no es apoderado
    }
  }, [activeRole, APODERADO_CHILDREN_INFO, parentSelectedChildType]);


  const filteredDays = scheduleData.map(day => ({
    ...day,
    courses: day.courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
      let roleSpecificFilter = true; // Por defecto, no hay filtro adicional por rol

      if (activeRole === 'admin') {
        roleSpecificFilter = adminSelectedType === 'Todos' || course.type === adminSelectedType;
      } else if (activeRole === 'student') {
        roleSpecificFilter = course.type === STUDENT_DEFAULT_TYPE;
      } else if (activeRole === 'teacher') {
        roleSpecificFilter = course.teacherId === TEACHER_DEFAULT_ID;
      } else if (activeRole === 'parent') {
        const selectedChildInfo = APODERADO_CHILDREN_INFO.find(child => child.name === parentSelectedChildType);
        roleSpecificFilter = selectedChildInfo ? course.type === selectedChildInfo.type : false;
      }

      return matchesSearch && roleSpecificFilter;
    })
  })).filter(day => day.courses.length > 0);

  // Función para manejar el cambio de rol y resetear los filtros
  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    setSearchTerm('');
    setAdminSelectedType('Todos'); // Resetear filtro de admin
    if (role === 'parent' && APODERADO_CHILDREN_INFO.length > 0) {
      setParentSelectedChildType(APODERADO_CHILDREN_INFO[0].name); // Seleccionar el primer hijo por defecto
    } else {
      setParentSelectedChildType('');
    }
  };

  const parentTitle = useMemo(() => {
    if (activeRole === 'parent' && parentSelectedChildType) {
      const selectedChild = APODERADO_CHILDREN_INFO.find(child => child.name === parentSelectedChildType);
      return selectedChild ? `Apoderado (Hijo: ${selectedChild.name} - Grado: ${selectedChild.type})` : 'Apoderado';
    }
    return 'Apoderado';
  }, [activeRole, parentSelectedChildType, APODERADO_CHILDREN_INFO]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Horario Escolar</h1>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex gap-2 flex-wrap mb-4 sm:mb-0">
            <button
              onClick={() => handleRoleChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeRole === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
              }`}
            >
              Ver Todo
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeRole === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Administrador
            </button>
            <button
              onClick={() => handleRoleChange('student')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeRole === 'student' ? 'bg-green-600 text-white shadow-md' : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Estudiante ({STUDENT_DEFAULT_TYPE})
            </button>
            <button
              onClick={() => handleRoleChange('teacher')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeRole === 'teacher' ? 'bg-yellow-600 text-white shadow-md' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Docente (ID: {TEACHER_DEFAULT_ID})
            </button>
            <button
              onClick={() => handleRoleChange('parent')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeRole === 'parent' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              }`}
            >
              {parentTitle}
            </button>
          </div>

          <input
            type="text"
            placeholder="Buscar clase por nombre..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros específicos del rol */}
        {activeRole === 'admin' && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <label htmlFor="admin-type-filter" className="text-gray-700 font-medium">Filtrar por Grado/Tipo:</label>
            <select
              id="admin-type-filter"
              value={adminSelectedType}
              onChange={(e) => setAdminSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            >
              {allClassTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {activeRole === 'parent' && APODERADO_CHILDREN_INFO.length > 0 && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
            <label htmlFor="parent-child-select" className="text-gray-700 font-medium">Selecciona un hijo:</label>
            <select
              id="parent-child-select"
              value={parentSelectedChildType}
              onChange={(e) => setParentSelectedChildType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 shadow-sm"
            >
              {APODERADO_CHILDREN_INFO.map(child => (
                <option key={child.name} value={child.name}>
                  {child.name} (Grado: {child.type})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Mensaje si el apoderado no tiene hijos o no ha seleccionado uno */}
        {activeRole === 'parent' && (!parentSelectedChildType || APODERADO_CHILDREN_INFO.length === 0) && (
          <div className="py-6 text-center text-gray-600 bg-white rounded-lg shadow-sm mb-6">
            {APODERADO_CHILDREN_INFO.length === 0 ? (
              <p>No se encontraron hijos asociados a tu cuenta de apoderado.</p>
            ) : (
              <p>Por favor, selecciona un hijo para ver su horario.</p>
            )}
          </div>
        )}


        <div className="space-y-6">
          {filteredDays.length > 0 ? (
            filteredDays.map(day => (
              <div key={day.day} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">{day.day}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
                  {day.courses.map(course => (
                    <div key={course.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">{course.name}</h3>
                        <p className="text-sm text-gray-500">{course.time}</p>
                      </div>
                      <div className="mt-3 text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          course.type === '1°' ? 'bg-red-50 text-red-600' :
                          course.type === '2°' ? 'bg-purple-50 text-purple-600' :
                          course.type === '3°' ? 'bg-yellow-50 text-yellow-600' :
                          course.type === '4°' ? 'bg-gray-100 text-gray-800' :
                          course.type === '5°' ? 'bg-blue-50 text-blue-600' :
                          'bg-green-50 text-green-600'
                        }`}>
                          {course.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500 bg-white rounded-lg shadow-sm">
              No hay clases para los filtros seleccionados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDash;