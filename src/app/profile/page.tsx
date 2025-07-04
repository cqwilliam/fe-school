"use client";

import { useState } from "react";
import api from "../../lib/api";

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

interface ProfileProps {
  user: User;
  studentGuardians: StudentGuardian[];
  courses: Course[];
  sections: Section[];
  onPasswordChange?: () => void;
}

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

export function Profile({
  user,
  studentGuardians,
  courses,
  sections,
  onPasswordChange,
}: ProfileProps) {
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatId = (id: number) => {
    return id.toString().padStart(8, "0");
  };

  const formatBirthDate = (age: number) => {
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    return `${birthYear}/01/01`;
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEditingPassword(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/users/${user.id}`, {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      alert("Contraseña actualizada correctamente.");
      resetPasswordForm();
      onPasswordChange?.();
    } catch (error: any) {
      alert(
        error.response?.data?.message || "Error al actualizar la contraseña."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
                  <p className="text-gray-900 font-medium">{user.user_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Dirección
                  </label>
                  <p className="text-gray-900 font-medium">{user.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Número celular
                  </label>
                  <p className="text-gray-900 font-medium">{user.phone}</p>
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

            {/* Secciones - Solo para estudiantes */}
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

            {/* Cursos - Solo para docentes */}
            {(user.role_name === "Docente" || user.role_name === "Profesor") &&
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
                          <span className="text-green-600 text-lg">📚</span>
                          <p className="text-green-900 font-medium">
                            {course.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Información de apoderados - Solo para estudiantes */}
            {user.role_name === "Estudiante" && studentGuardians.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Información de Apoderados
                </h4>
                <div className="space-y-4">
                  {studentGuardians.map(
                    (relation, index) =>
                      relation.guardian && (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
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

            {/* Estudiantes a cargo - Solo para apoderados */}
            {user.role_name === "Apoderado" && studentGuardians.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Estudiantes a cargo
                </h4>
                <div className="space-y-4">
                  {studentGuardians.map(
                    (relation, index) =>
                      relation.student && (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
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

        {/* Foto de perfil */}
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
            <p className="text-gray-600 font-medium mb-4">{user.role_name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {user.role_name === "Administrador" && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Panel de Control
          </h3>
          <div className="w-1/2 grid grid-cols-1 gap-4">
            {adminLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors text-blue-600 text-center font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Modal para cambiar contraseña */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={resetPasswordForm}
                disabled={isLoading}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
