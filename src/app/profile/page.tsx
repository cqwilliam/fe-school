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
  { href: "/users", label: "Gestión de Usuarios", icon: "👥" },
  { href: "/studentsGuardians", label: "Apoderados y Estudiantes", icon: "👨‍👩‍👧‍👦" },
  { href: "/periods", label: "Periodos Académicos", icon: "📅" },
  { href: "/courses", label: "Administración de Cursos", icon: "📚" },
  { href: "/sections", label: "Gestión de Secciones", icon: "🏫" },
  { href: "/sectionsCourses", label: "Secciones por Curso", icon: "📚" },
  { href: "/periodsSections", label: "Secciones por Periodo", icon: "🎯" },
  { href: "/periodsSectionsUsers", label: "Asignación de Secciones", icon: "📎" },
  { href: "/schedules", label: "Horarios", icon: "⏰" },
  { href: "/evaluationsTypes", label: "Tipos de Evaluación", icon: "📋" },
  { href: "/evaluations", label: "Evaluaciones", icon: "📊" },
  { href: "/evaluationGrades", label: "Calificaciones", icon: "💯" },
  { href: "/classSessions", label: "Sesiones de Clase", icon: "🗓️" },
  { href: "/attendances", label: "Asistencia", icon: "✅" },
  { href: "/assignments", label: "Tareas", icon: "📝" },
  { href: "/assignmentSubmissions", label: "Entregas de Tareas", icon: "📤" },
  { href: "/courseMaterials", label: "Materiales del Curso", icon: "📂" },
  { href: "/announcements", label: "Anuncios", icon: "📢" },
  { href: "/messages", label: "Mensajes", icon: "💬" },
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
    return `${birthYear}/01/01`; // Asumiendo que solo tienes el año y asignas 01/01
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
        <div className="lg:col-span-1">
          <div className="bg-white rounded-4xl shadow-md p-6 text-center border border-gray-100">
            <div className="relative inline-block mb-4">
              {user.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={user.full_name}
                  className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-gray-200"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-700 text-4xl font-bold ring-4 ring-gray-200">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {user.full_name}
            </h2>
            <p className="text-gray-600 text-lg mb-2">{user.role_name}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-4xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
              Información Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">
                  ID de Usuario
                </label>
                <p className="text-gray-800 font-medium">
                  {formatId(user.id)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">
                  Nombre de Usuario
                </label>
                <p className="text-gray-800 font-medium">{user.user_name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">
                  DNI
                </label>
                <p className="text-gray-800 font-medium">{user.dni}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">
                  Fecha de Nacimiento
                </label>
                <p className="text-gray-800 font-medium">
                  {formatBirthDate(user.age_name)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">
                  Dirección
                </label>
                <p className="text-gray-800 font-medium">{user.address}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">
                  Número de Teléfono
                </label>
                <p className="text-gray-800 font-medium">{user.phone}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 block mb-1">
                  Contraseña
                </label>
                <button
                  onClick={() => setEditingPassword(true)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium underline text-sm"
                >
                  Cambiar contraseña
                </button>
              </div>
            </div>

            {user.role_name === "Estudiante" && sections.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Mis Secciones
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center space-x-3"
                    >
                      <span className="text-gray-600 text-lg">🏫</span>
                      <p className="text-gray-800 font-medium">
                        {section.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(user.role_name === "Docente" || user.role_name === "Profesor") &&
              courses.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">
                    Mis Cursos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center space-x-3"
                      >
                        <span className="text-gray-600 text-lg">📚</span>
                        <p className="text-gray-800 font-medium">
                          {course.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {user.role_name === "Estudiante" && studentGuardians.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Información de Apoderados
                </h4>
                <div className="space-y-4">
                  {studentGuardians.map(
                    (relation, index) =>
                      relation.guardian && (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">
                                Parentesco
                              </label>
                              <p className="text-gray-800 font-semibold">
                                {relation.relationship}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">
                                Nombre
                              </label>
                              <p className="text-gray-800 font-semibold">
                                {relation.guardian.full_name}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">
                                Teléfono
                              </label>
                              <p className="text-gray-800 font-semibold">
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

            {user.role_name === "Apoderado" && studentGuardians.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Estudiantes a cargo
                </h4>
                <div className="space-y-4">
                  {studentGuardians.map(
                    (relation, index) =>
                      relation.student && (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">
                                Parentesco
                              </label>
                              <p className="text-gray-800 font-semibold">
                                {relation.relationship}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">
                                Nombre
                              </label>
                              <p className="text-gray-800 font-semibold">
                                {relation.student.full_name}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500 block mb-1">
                                DNI
                              </label>
                              <p className="text-gray-800 font-semibold">
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
      </div>

      {user.role_name === "Administrador" && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4 border-gray-200">
            Panel de Administración
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {adminLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium text-center border border-gray-200"
              >
                <span className="text-xl mr-2">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Modal para cambiar contraseña */}
      {editingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all scale-100 opacity-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 border-gray-200">
              Cambiar Contraseña
            </h3>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña actual
                </label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nueva contraseña
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmar nueva contraseña
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={resetPasswordForm}
                disabled={isLoading}
                className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}