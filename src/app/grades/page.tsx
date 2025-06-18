"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface Grade {
  id: number;
  evaluation_id: number;
  student_id: number;
  graded_by?: number | null;
  score: number;
  comment?: string;
  graded_at: string;
}

const Grades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get("/grades");
        if (response.data.success) {
          setGrades(response.data.data);
        } else {
          setError("No se pudo obtener la lista de calificaciones.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar calificaciones.");
      }
    };

    fetchGrades();
  }, []);

  const handleShow = (id: number) => router.push(`/grades/${id}`);
  const handleUpdate = (id: number) => router.push(`/grades/${id}/update`);
  const handleCreate = () => router.push("/grades/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Calificaciones</h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : grades.length === 0 ? (
        <p>Cargando calificaciones...</p>
      ) : (
        grades.map((grade) => (
          <div
            key={grade.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fafafa",
              color: "#000000",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              Nota: {grade.score}
            </strong>
            <p>Evaluación ID: {grade.evaluation_id}</p>
            <p>Estudiante ID: {grade.student_id}</p>
            <p>Calificado por: {grade.graded_by ?? "No asignado"}</p>
            <p>Comentario: {grade.comment || "Sin comentarios"}</p>
            <p>Fecha de calificación: {new Date(grade.graded_at).toLocaleString()}</p>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#4f46e5",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleShow(grade.id)}
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
                onClick={() => handleUpdate(grade.id)}
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
          backgroundColor: "#9333ea",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "18px",
          transition: "background-color 0.3s ease",
        }}
        onClick={handleCreate}
      >
        Crear Nueva Calificación
      </button>
    </div>
  );
};

export default Grades;
