"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface Attendance {
  id: number;
  class_session_id: number;
  student_id: number;
  status: "present" | "absent" | "late" | "justified";
  recorded_time: string | null;
  justification: string | null;
  recorded_by: number;
}

const Attendances = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const response = await api.get("/attendances");

        if (response.data.success) {
          setAttendances(response.data.data);
        } else {
          setError("No se pudo obtener la lista de asistencias.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar asistencias.");
      }
    };
    fetchAttendances();
  }, []);

  const handleShow = (id: number) => router.push(`/attendances/${id}`);
  const handleUpdate = (id: number) => router.push(`/attendances/${id}/update`);
  const handleCreate = () => router.push("/attendances/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
        color: "#000000",
      }}
    >
      {/* <AttendanceBuilder/> */}

      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Asistencias</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar asistencias: {error}</p>
      ) : attendances.length === 0 ? (
        <p>Cargando asistencias...</p>
      ) : (
        attendances.map((attendance) => (
          <div
            key={attendance.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fdfdfd",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              ID Asistencia: {attendance.id}
            </strong>
            <p>Clase: {attendance.class_session_id}</p>
            <p>Estudiante: {attendance.student_id}</p>
            <p>Estado: {attendance.status}</p>
            {attendance.recorded_time && <p>Hora registrada: {attendance.recorded_time}</p>}
            {attendance.justification && <p>Justificación: {attendance.justification}</p>}
            <p>Registrado por (Usuario ID): {attendance.recorded_by}</p>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleShow(attendance.id)}
              >
                Ver
              </button>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#f59e0b",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleUpdate(attendance.id)}
              >
                Actualizar
              </button>
            </div>
          </div>
        ))
      )}

      <button
        style={{
          marginTop: "32px",
          width: "100%",
          padding: "14px 0",
          backgroundColor: "#10b981",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "18px",
        }}
        onClick={handleCreate}
      >
        Registrar Nueva Asistencia
      </button>
    </div>
  );
};

export default Attendances;
