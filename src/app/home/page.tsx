"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuItems from "../../components/MenuItems";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

import api from "../../lib/api";
import { logout } from "../../lib/auth";
import CoursesDash from "../coursesDash/page";
import AnnouncementDash from "../announcementDash/page";

interface Califications {
  user_id: number;
  nombre: string;
}

const calificationsMock: Array<Califications> = [
  {
    user_id: 1,
    nombre: "Juan",
  },
  {
    user_id: 2,
    nombre: "Pedro",
  },
  {
    user_id: 3,
    nombre: "Maria",
  },
  {
    user_id: 4,
    nombre: "Jose",
  },
  {
    user_id: 5,
    nombre: "Luis",
  },
  {
    user_id: 6,
    nombre: "Ana",
  },
  {
    user_id: 7,
    nombre: "Carlos",
  },
  {
    user_id: 8,
    nombre: "Laura",
  },
  {
    user_id: 9,
    nombre: "Sofia",
  },
  {
    user_id: 10,
    nombre: "Diego",
  },
];

interface User {
  id: number;
  full_name: string;
  role_name: string;
  user_name: string;
  email: string;
  dni: string;
  age_name: number;
  photo_url: string;
  phone: string;
  address: string;
}

interface Course {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
}

interface StudentGuardian {
  student_user_id: number;
  guardian_user_id: number;
  relationship: string;
  student?: User;
  guardian?: User;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [studentGuardians, setStudentGuardians] = useState<StudentGuardian[]>(
    []
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState("perfil");
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const formatId = (id: number) => {
    return id.toString().padStart(8, "0");
  };

  const formatBirthDate = (age: number) => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return `${birthYear}/01/01`;
  };

  const menuItems: MenuItem[] = [
    { id: "perfil", label: "Perfil", icon: "👤" },
    { id: "cursos", label: "Cursos", icon: "📚" },
    { id: "calificaciones", label: "Calificaciones", icon: "📊" },
    { id: "horarios", label: "Horarios", icon: "⏰" },
    { id: "comunicados", label: "Comunicados", icon: "📢" },
  ];

  const adminLinks = [
    { href: "/users", label: "Ver usuarios", icon: "👥" },
    {
      href: "/studentsGuardians",
      label: "Ver Apoderados estudiante",
      icon: "👨‍👩‍👧‍👦",
    },
    { href: "/periods", label: "Ver periodos academicos", icon: "📅" },
    { href: "/courses", label: "Ver cursos", icon: "📚" },
    { href: "/sections", label: "Ver secciones", icon: "🏫" },
    { href: "/sectionsCourses", label: "Ver secciones de curso", icon: "🏫" },
    {
      href: "/periodsSections",
      label: "Ver secciones por periodo",
      icon: "🎯",
    },
    {
      href: "/periodsSectionsUsers",
      label: "ver seccion por periodo y usuario",
      icon: "🎯",
    },
    { href: "/schedules", label: "Ver Horario", icon: "⏰" },
    { href: "/evaluationsTypes", label: "Ver tipos de Evaluacion", icon: "📊" },
    { href: "/evaluations", label: "Ver Evaluaciones", icon: "📋" },
    {
      href: "/evaluationGrades",
      label: "Ver Calificaciones de Evaluacion",
      icon: "📋",
    },
    { href: "/classSessions", label: "Ver Sesiones de Clase", icon: "🎪" },
    { href: "/attendances", label: "Ver Asistencia", icon: "✅" },
    { href: "/assignments", label: "Ver Tareas", icon: "📄" },
    {
      href: "/assignmentSubmissions",
      label: "Ver Tareas enviadas",
      icon: "📤",
    },
    { href: "/courseMaterials", label: "Ver Materiales de Clase", icon: "📚" },
    { href: "/announcements", label: "Ver Anuncios", icon: "📢" },
    { href: "/messages", label: "Ver Mensajes", icon: "💬" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get<User>("/current-user");
        const userData = response.data;
        setUser(userData);
      } catch (error) {
        logout();
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchStudentGuardians = async () => {
      if (!user) return;

      try {
        const response = await api.get("/students-guardians");
        const data: StudentGuardian[] = response.data.data;

        if (user.role_name === "Estudiante") {
          const relations = data.filter(
            (rel) => rel.student_user_id === user.id
          );
          const guardianPromises = relations.map((rel) =>
            api.get(`/users/${rel.guardian_user_id}`)
          );
          const guardianResponses = await Promise.all(guardianPromises);

          const updatedRelations = relations.map((rel, index) => ({
            ...rel,
            guardian:
              guardianResponses[index].data.data ||
              guardianResponses[index].data,
          }));

          setStudentGuardians(updatedRelations);
        } else if (user.role_name === "Apoderado") {
          const relations = data.filter(
            (rel) => rel.guardian_user_id === user.id
          );
          const studentPromises = relations.map((rel) =>
            api.get(`/users/${rel.student_user_id}`)
          );
          const studentResponses = await Promise.all(studentPromises);

          const updatedRelations = relations.map((rel, index) => ({
            ...rel,
            student:
              studentResponses[index].data.data || studentResponses[index].data,
          }));

          setStudentGuardians(updatedRelations);
        }
      } catch (error) {
        console.error(
          "Error al obtener relaciones estudiante-apoderado",
          error
        );
      }
    };

    fetchStudentGuardians();
  }, [user]);

  // Nuevo useEffect para obtener secciones del estudiante o cursos del profesor
  useEffect(() => {
    const fetchUserSectionsOrCourses = async () => {
      if (!user) return;

      try {
        if (user.role_name === "Estudiante") {
          // Obtener secciones del estudiante
          const response = await api.get(`/students/${user.id}/sections`);
          setSections(response.data.data || response.data);
        } else if (
          user.role_name === "Docente" ||
          user.role_name === "Profesor"
        ) {
          // Obtener cursos del profesor
          const response = await api.get(`/teachers/${user.id}/courses`);
          setCourses(response.data.data || response.data);
        }
      } catch (error) {
        console.error("Error al obtener secciones/cursos del usuario", error);
      }
    };

    fetchUserSectionsOrCourses();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas nuevas no coinciden.");
      return;
    }

    try {
      await api.put(`/users/${user?.id}`, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      alert("Contraseña actualizada correctamente.");
      setEditingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Error al actualizar la contraseña."
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.full_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.full_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h2 className="font-bold text-gray-900 text-lg">
                {user.full_name.split(" ")[0]}{" "}
                {user.full_name.split(" ")[1] || ""}
              </h2>
              <p className="text-sm text-gray-500">{user.role_name}</p>
            </div>
          </div>
        </div>

        <MenuItems
          items={menuItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="absolute bottom-6 left-6">
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Upgrade
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              {activeSection}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Bienvenido {user.full_name.split(" ")[0]}
              </span>
              <div className="relative">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name.charAt(0)}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  title="Cerrar sesión"
                >
                  <span className="text-white text-xs">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8">
          {activeSection === "perfil" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    INFORMACIÓN ADICIONAL
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          ID
                        </label>
                        <p className="text-gray-900 font-medium">
                          {formatId(user.id)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          DNI
                        </label>
                        <p className="text-gray-900 font-medium">{user.dni}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Fecha de Nacimiento
                        </label>
                        <p className="text-gray-900 font-medium">
                          {formatBirthDate(user.age_name)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Usuario
                        </label>
                        <p className="text-gray-900 font-medium">
                          {user.user_name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Dirección
                        </label>
                        <p className="text-gray-900 font-medium">
                          {user.address}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Número celular
                        </label>
                        <p className="text-gray-900 font-medium">
                          {user.phone}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Contraseña
                        </label>
                        <button
                          onClick={() => setEditingPassword(true)}
                          className="text-blue-500 hover:text-blue-600 font-medium underline"
                        >
                          Cambiar contraseña
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sección para mostrar secciones del estudiante */}
                  {user.role_name === "Estudiante" && sections.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Mis Secciones
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sections.map((section) => (
                          <div
                            key={section.id}
                            className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-600 text-lg">🏫</span>
                              <p className="text-blue-900 font-medium">
                                {section.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sección para mostrar cursos del profesor */}
                  {(user.role_name === "Docente" ||
                    user.role_name === "Profesor") &&
                    courses.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Mis Cursos
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {courses.map((course) => (
                            <div
                              key={course.id}
                              className="bg-green-50 rounded-lg p-4 border border-green-200"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-green-600 text-lg">
                                  📚
                                </span>
                                <p className="text-green-900 font-medium">
                                  {course.name}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {user.role_name === "Estudiante" &&
                    studentGuardians.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Información de Apoderados
                        </h4>
                        <div className="space-y-4">
                          {studentGuardians.map(
                            (relation, index) =>
                              relation.guardian && (
                                <div
                                  key={index}
                                  className="bg-gray-50 rounded-lg p-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">
                                        Parentesco
                                      </label>
                                      <p className="text-gray-900 font-medium">
                                        {relation.relationship}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">
                                        Nombre
                                      </label>
                                      <p className="text-gray-900 font-medium">
                                        {relation.guardian.full_name}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">
                                        Teléfono
                                      </label>
                                      <p className="text-gray-900 font-medium">
                                        {relation.guardian.phone}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}

                  {user.role_name === "Apoderado" &&
                    studentGuardians.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Estudiantes a cargo
                        </h4>
                        <div className="space-y-4">
                          {studentGuardians.map(
                            (relation, index) =>
                              relation.student && (
                                <div
                                  key={index}
                                  className="bg-gray-50 rounded-lg p-4"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">
                                        Parentesco
                                      </label>
                                      <p className="text-gray-900 font-medium">
                                        {relation.relationship}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">
                                        Nombre
                                      </label>
                                      <p className="text-gray-900 font-medium">
                                        {relation.student.full_name}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">
                                        DNI
                                      </label>
                                      <p className="text-gray-900 font-medium">
                                        {relation.student.dni}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="relative inline-block">
                    {user.photo_url ? (
                      <img
                        src={user.photo_url}
                        alt={user.full_name}
                        className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-4xl font-bold">
                          {user.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user.full_name.toUpperCase()}
                  </h2>
                  <p className="text-gray-600 font-medium mb-4">
                    {user.role_name}
                  </p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                {user.role_name === "Administrador" && (
                  <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Panel de Administración
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {adminLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        >
                          <span className="text-gray-600">➤</span>
                          <span className="text-gray-700 hover:text-blue-600">
                            {link.label}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {editingPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Cambiar Contraseña
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setEditingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
    
          {activeSection === "cursos" && <CoursesDash />}
          {activeSection === "calificaciones" &&
            calificationsMock.map((calification, index) => (
              <div key={index}>{calification.nombre}</div>
            ))}
              {activeSection === "comunicados" && <AnnouncementDash />}
          {activeSection !== "perfil" && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sección en desarrollo
              </h3>
              <p className="text-gray-600">
                La sección "{activeSection}" estará disponible próximamente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
