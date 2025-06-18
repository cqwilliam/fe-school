import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import { logout } from "../lib/auth";

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

interface TeacherData {
  specialty: string;
  academic_degree: string;
}

interface StudentData {
  grade: string;
  section: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [extraData, setExtraData] = useState<TeacherData | StudentData | null>(
    null
  );
  const [editingPassword, setEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

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

        // Obtener datos extra según el rol
        if (userData.role_name === "Docente" && userData.id) {
          try {
            const res = await api.get(`/teachers/by-user/${userData.id}`);
            if (res.data.success) {
              const teacher: TeacherData = res.data.data;
              setExtraData(teacher);
            }
          } catch (teacherError) {
            console.error("Error fetching teacher data:", teacherError);
          }
        } else if (userData.role_name === "Estudiante") {
          try {
            const res = await api.get(`/students/by-user/${userData.id}`);
            if (res.data.success) {
              const student: StudentData = res.data.data;
              setExtraData(student);
            }
          } catch (studentError) {
            console.error("Error fetching student data:", studentError);
          }
        }
      } catch (error) {
        logout();
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

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

          {/* Datos adicionales por rol */}
          {user.role_name === "Docente" && extraData
            ? (() => {
                const teacher = extraData as TeacherData;
                return (
                  <>
                    <p>
                      <strong>Especialidad:</strong> {teacher.specialty}
                    </p>
                    <p>
                      <strong>Grado académico:</strong>{" "}
                      {teacher.academic_degree}
                    </p>
                  </>
                );
              })()
            : null}

          {user.role_name === "Estudiante" && extraData
            ? (() => {
                const student = extraData as StudentData;
                return (
                  <>
                    <p>
                      <strong>Grado:</strong> {student.grade}
                    </p>
                    <p>
                      <strong>Sección:</strong> {student.section}
                    </p>
                  </>
                );
              })()
            : null}

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

          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>

          {user.role_name === "Administrador" && (
            <div className="mt-4">
              <a href="/crearUsuario" className="text-blue-600 underline">
                Crear nuevo usuario
              </a>
            </div>
          )}
          {user.role_name === "Administrador" && (
            <div className="mt-4">
              <a href="/createRol" className="text-blue-600 underline">
                crear nuevo rol
              </a>
            </div>
          )}
        </div>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  );
}
