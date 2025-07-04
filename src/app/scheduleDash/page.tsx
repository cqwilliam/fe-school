"use client";
import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { logout } from "../../lib/auth";
import { useRouter } from "next/navigation";

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
  course_name?: string;
  teacher_name?: string;
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
        const userResponse = await api.get<User>("/current-user");
        const userData = userResponse.data;
        setUser(userData);

        if (userData.role_name === "Estudiante") {
          const studentResponse = await api.get(
            `/students/by-user/${userData.id}`
          );
          if (studentResponse.data.success && studentResponse.data.data) {
            const studentId = studentResponse.data.data.id;

            const scheduleResponse = await api.get<ScheduleData[]>(
              `/schedules/by-student/${studentId}`
            );
            if (scheduleResponse.data) {
              setSchedule(scheduleResponse.data);
            } else {
              setSchedule([]);
            }
          } else {
            setError("No se encontraron datos de estudiante para el usuario.");
          }
        } else {
          setError("Solo los estudiantes pueden ver su horario aquí.");
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
                  <td className="py-2 px-4 border-b">
                    {item.teacher_name || "N/A"}
                  </td>{" "}
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
