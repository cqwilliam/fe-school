'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface ClassSession {
  id: number;
  period_section_id: number;
  teacher_user_id: number;
  topic: string | null;
  date: string;
  start_time: string;
  end_time: string;
}

const ClassSession = () => {
  const { classSessionId } = useParams(); 
  const [classSession, setClassSession] = useState<ClassSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassSession = async () => {
      try {
        const response = await api.get<{ success: boolean; data: ClassSession }>(
          `/class-sessions/${classSessionId}`
        );
        if (response.data.success) {
          setClassSession(response.data.data);
        } else {
          setError("No se pudo obtener la sesión de clase.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar la sesión de clase."
        );
      }
    };

    if (classSessionId) {
      fetchClassSession();
    }
  }, [classSessionId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!classSession) {
    return <div style={{ padding: 24 }}>Cargando sesión de clase...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalles de la Sesión de Clase</h1>
      <p>ID: {classSession.id}</p>
      <p>Sección Periodo ID: {classSession.period_section_id}</p>
      <p>Tema: {classSession.topic || 'No disponible'}</p>
      <p>Fecha: {classSession.date}</p>
      <p>Hora de inicio: {classSession.start_time}</p>
      <p>Hora de fin: {classSession.end_time}</p>
      <p>Profesor ID: {classSession.teacher_user_id}</p>
    </div>
  );
};

export default ClassSession;
