"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { logout } from "../../lib/auth";

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

interface StudentGuardian {
  student_user_id: number;
  guardian_user_id: number;
  relationship: string;
  student?: User;
  guardian?: User;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [studentGuardians, setStudentGuardians] = useState<StudentGuardian[]>([]);
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const adminLinks = [
    { href: "/crearUsuario", label: "Crear nuevo usuario" },
    { href: "/users", label: "Ver usuarios" },
    { href: "/studentsGuardians", label: "Ver Apoderados estudiante" },
    { href: "/periods", label: "Ver periodos academicos" },
    { href: "/courses", label: "Ver cursos" },
    { href: "/coursesSections", label: "Ver secciones de curso" },
    { href: "/teachersSections", label: "Ver secciones de docentes" },
    { href: "/enrollments", label: "Ver Matriculas" },
    { href: "/schedules", label: "Ver Horario" },
    { href: "/evaluationsTypes", label: "Ver tipos de Evaluacion" },
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

  return (
    <div className="p-4">
      <h1>PERFIL</h1>
      {user ? (
        <div>
          <p>
            <strong>Nombre completo:</strong> {user.full_name}
          </p>
          <p>
            <strong>Usuario:</strong> {user.user_name}
          </p>
          <p>
            <strong>Rol:</strong> {user.role_name}
          </p>
          <p>
            <strong>Edad:</strong> {user.age_name}
          </p>
          <p>
            <strong>DNI:</strong> {user.dni}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {user.phone}
          </p>
          <p>
            <strong>Dirección:</strong> {user.address}
          </p>

          {!editingPassword ? (
            <p>
              <strong>Contraseña:</strong>{" "}
              <button
                className="text-blue-500 underline"
                onClick={() => setEditingPassword(true)}
              >
                Cambiar contraseña
              </button>
            </p>
          ) : (
            <div className="mt-4">
              <input
                type="password"
                placeholder="Contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border p-2 block w-full mb-2"
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 block w-full mb-2"
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 block w-full mb-2"
              />
              <button
                onClick={handlePasswordChange}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditingPassword(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          )}

          {user.role_name === "Estudiante" && studentGuardians.length > 0 && (
            <div className="mt-6">
              <h2>Apoderados:</h2>
              {studentGuardians.map((relation, index) => (
                <div key={index}>
                  {relation.guardian ? (
                    <>
                      <p>
                        <strong>Nombre:</strong> {relation.guardian.full_name}
                      </p>
                      <p>
                        <strong>Relación:</strong> {relation.relationship}
                      </p>
                      <p>
                        <strong>Teléfono:</strong> {relation.guardian.phone}
                      </p>
                    </>
                  ) : (
                    <p>No se encontraron datos completos del apoderado</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {user.role_name === "Apoderado" && studentGuardians.length > 0 && (
            <div className="mt-6">
              <h2>Estudiantes a cargo:</h2>
              {studentGuardians.map((rel, i) => (
                <div key={i} className="mb-2">
                  <p>
                    <strong>Nombre:</strong> {rel.student?.full_name}
                  </p>
                  <p>
                    <strong>Relación:</strong> {rel.relationship}
                  </p>
                  <p>
                    <strong>Edad:</strong> {rel.student?.age_name}
                  </p>
                  <p>
                    <strong>DNI:</strong> {rel.student?.dni}
                  </p>
                  <p>
                    <strong>Email:</strong> {rel.student?.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {rel.student?.phone}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {rel.student?.address}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>

          {user.role_name === "Administrador" && (
            <div className="mt-6 space-y-2">
              {adminLinks.map((link) => (
                <div key={link.href}>
                  <a href={link.href} className="text-blue-600 underline">
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  );
}
