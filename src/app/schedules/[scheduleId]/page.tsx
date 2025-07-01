"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface Schedule {
  id: number;
  period_section_id: number;
  course_id: number;
  teacher_user_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

const ScheduleDetail = () => {
  const { scheduleId } = useParams();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Schedule }>(
          `/schedules/${scheduleId}`
        );
        if (response.data.success) {
          setSchedule(response.data.data);
        } else {
          setError("No se pudo obtener el horario.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el horario.");
      }
    };

    if (scheduleId) {
      fetchSchedule();
    }
  }, [scheduleId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!schedule) {
    return <div style={{ padding: 24 }}>Cargando horario...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Detalle del Horario
      </h1>
      <p>
        <strong>ID:</strong> {schedule.id}
      </p>
      <p>
        <strong>Sección del Periodo ID:</strong> {schedule.period_section_id}
      </p>
      <p>
        <strong>Curso ID:</strong> {schedule.course_id}
      </p>
      <p>
        <strong>Profesor ID:</strong> {schedule.teacher_user_id}
      </p>
      <p>
        <strong>Día de la Semana:</strong> {schedule.day_of_week}
      </p>
      <p>
        <strong>Hora de Inicio:</strong> {schedule.start_time}
      </p>
      <p>
        <strong>Hora de Fin:</strong> {schedule.end_time}
      </p>
    </div>
  );
};

export default ScheduleDetail;
