"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Attendance {
  id: number;
  class_session_id: number;
  student_id: number;
  status: "present" | "absent" | "late" | "justified";
  recorded_time: string | null;
  justification: string | null;
  recorded_by: number;
}

const Attendance = () => {
  const { attendanceId } = useParams();
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Attendance }>(
          `/attendances/${attendanceId}`
        );
        if (response.data.success) {
          setAttendance(response.data.data);
        } else {
          setError("No se pudo obtener el registro de asistencia.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la asistencia.");
      }
    };

    if (attendanceId) {
      fetchAttendance();
    }
  }, [attendanceId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!attendance) {
    return <div style={{ padding: 24 }}>Cargando asistencia...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalle de Asistencia</h1>
      <p><strong>ID:</strong> {attendance.id}</p>
      <p><strong>ID Clase:</strong> {attendance.class_session_id}</p>
      <p><strong>ID Estudiante:</strong> {attendance.student_id}</p>
      <p><strong>Estado:</strong> {attendance.status}</p>
      <p><strong>Hora registrada:</strong> {attendance.recorded_time || "N/A"}</p>
      <p><strong>Justificación:</strong> {attendance.justification || "Ninguna"}</p>
      <p><strong>Registrado por (ID Usuario):</strong> {attendance.recorded_by}</p>
    </div>
  );
};

export default Attendance;
