"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface Attendance {
  id: number;
  class_session_id: number;
  student_user_id: number;
  teacher_user_id: number;
  status: "present" | "absent" | "late" | "justified";
  justification: string | null;
  created_at: string;
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
        color: "#ffffff",
      }}
    >
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
              color: "#000000",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              ID Asistencia: {attendance.id}
            </strong>
            <p>ID Clase: {attendance.class_session_id}</p>
            <p>ID Estudiante: {attendance.student_user_id}</p>
            <p>ID Profesor: {attendance.teacher_user_id}</p>
            <p>Estado: {attendance.status}</p>
            {attendance.justification && (
              <p>Justificación: {attendance.justification}</p>
            )}
            <p>
              Registrado el: {new Date(attendance.created_at).toLocaleString()}
            </p>

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
