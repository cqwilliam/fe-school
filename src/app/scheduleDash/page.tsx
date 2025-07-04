'use client'
import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { logout } from "../../lib/auth";
import { useRouter } from "next/navigation";

// Interfaces de datos (puedes moverlas a un archivo de tipos separado si lo prefieres)
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

export interface ScheduleData {
  id?: number;
  period_section_id: number;
  course_id: number;
  teacher_user_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  // Puedes añadir más campos si tu API de horario los devuelve,
  // por ejemplo, el nombre del curso, nombre del profesor, etc.
  course_name?: string; // Ejemplo
  teacher_name?: string; // Ejemplo
}

const ScheduleDash = () => {
  const [user, setUser] = useState<User | null>(null);
  const [schedule, setSchedule] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudentSchedule = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Primero, obtener la información del usuario actual
        const userResponse = await api.get<User>("/current-user");
        const userData = userResponse.data;
        setUser(userData);

        if (userData.role_name === "Estudiante") {
          // Si es estudiante, obtener su ID de estudiante
          const studentResponse = await api.get(
            `/students/by-user/${userData.id}`
          );
          if (studentResponse.data.success && studentResponse.data.data) {
            const studentId = studentResponse.data.data.id; // Asumo que el ID del estudiante está aquí

            // Ahora, obtener el horario del estudiante usando su ID
            const scheduleResponse = await api.get<ScheduleData[]>(
              `/schedules/by-student/${studentId}`
            );
            if (scheduleResponse.data) {
              // Asumo que la API devuelve un array directamente o en una propiedad 'data'
              setSchedule(scheduleResponse.data);
            } else {
              setSchedule([]); // No hay horario disponible
            }
          } else {
            setError("No se encontraron datos de estudiante para el usuario.");
          }
        } else {
          setError("Solo los estudiantes pueden ver su horario aquí.");
          // Opcional: Redirigir si no es estudiante
          // router.push("/dashboard");
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          logout();
          router.push("/login");
        } else {
          setError("Error al cargar el horario. Intenta de nuevo más tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentSchedule();
  }, [router]);

  if (loading) {
    return <div className="p-4">Cargando horario...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!user || user.role_name !== "Estudiante") {
    return (
      <div className="p-4">
        Acceso denegado. Esta página es solo para estudiantes.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Horario del Estudiante</h1>
      {schedule.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Día</th>
                <th className="py-2 px-4 border-b">Hora Inicio</th>
                <th className="py-2 px-4 border-b">Hora Fin</th>
                <th className="py-2 px-4 border-b">Curso</th>
                <th className="py-2 px-4 border-b">Profesor</th>
                {/* Agrega más encabezados según los campos que quieras mostrar */}
              </tr>
            </thead>
            <tbody>
              {schedule.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.day_of_week}</td>
                  <td className="py-2 px-4 border-b">{item.start_time}</td>
                  <td className="py-2 px-4 border-b">{item.end_time}</td>
                  <td className="py-2 px-4 border-b">
                    {item.course_name || "N/A"}
                  </td>{" "}
                  {/* Muestra el nombre del curso */}
                  <td className="py-2 px-4 border-b">
                    {item.teacher_name || "N/A"}
                  </td>{" "}
                  {/* Muestra el nombre del profesor */}
                  {/* Renderiza más datos del horario aquí */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontró horario para este estudiante.</p>
      )}
    </div>
  );
};

export default ScheduleDash;
