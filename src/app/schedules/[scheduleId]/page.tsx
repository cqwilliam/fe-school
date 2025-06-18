"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface Schedule {
  id: number;
  section_id: number;
  day_of_week: string;
  start_date: string;
  end_date: string;
  is_recurring: boolean;
  specific_date?: string | null;
}

const Schedule = () => {
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
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Detalle del Horario</h1>
      <p><strong>ID:</strong> {schedule.id}</p>
      <p><strong>ID de Sección:</strong> {schedule.section_id}</p>
      <p><strong>Día de la Semana:</strong> {schedule.day_of_week}</p>
      <p><strong>Hora de Inicio:</strong> {schedule.start_date}</p>
      <p><strong>Hora de Fin:</strong> {schedule.end_date}</p>
      <p><strong>¿Es recurrente?:</strong> {schedule.is_recurring ? "Sí" : "No"}</p>
      {schedule.specific_date && (
        <p><strong>Fecha específica:</strong> {schedule.specific_date}</p>
      )}
    </div>
  );
};

export default Schedule;
