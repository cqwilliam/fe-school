"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface EvaluationGrade {
  id: number;
  evaluation_id: number;
  student_user_id: number;
  grade: number;
  comment: string | null;
}

const EvaluationGrades = () => {
  const router = useRouter();
  const [grades, setGrades] = useState<EvaluationGrade[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await api.get("/evaluation-grades");

        if (response.data.success) {
          setGrades(response.data.data);
        } else {
          setError("No se pudo obtener la lista de calificaciones.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar calificaciones."
        );
      }
    };

    fetchGrades();
  }, []);

  const handleShow = (id: number) => router.push(`/evaluationGrades/${id}`);
  const handleUpdate = (id: number) =>
    router.push(`/evaluationGrades/${id}/update`);
  const handleCreate = () => router.push("/evaluationGrades/create");

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
        <p style={{ color: "red" }}>Error al cargar calificaciones: {error}</p>
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
            <strong
              style={{
                fontSize: "18px",
                marginBottom: "8px",
                color: "#000000",
              }}
            >
              Evaluación #{grade.evaluation_id} - Estudiante #
              {grade.student_user_id}
            </strong>
            <p>
              Nota: <strong>{grade.grade.toFixed(2)}</strong>
            </p>
            {grade.comment && <p>Comentario: {grade.comment}</p>}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button onClick={() => handleShow(grade.id)}>Ver</button>
              <button onClick={() => handleUpdate(grade.id)}>Actualizar</button>
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

export default EvaluationGrades;
