"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface EvaluationGrade {
  id: number;
  evaluation_id: number;
  student_user_id: number;
  grade: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

const EvaluationGrade = () => {
  const { evaluationGradeId } = useParams();
  const [grade, setGrade] = useState<EvaluationGrade | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: EvaluationGrade;
        }>(`/evaluation-grades/${evaluationGradeId}`);

        if (response.data.success) {
          setGrade(response.data.data);
        } else {
          setError("No se pudo obtener la calificación.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar la calificación."
        );
      }
    };

    if (evaluationGradeId) {
      fetchGrade();
    }
  }, [evaluationGradeId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!grade) {
    return <div style={{ padding: 24 }}>Cargando calificación...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Detalle de Calificación
      </h1>
      <p>
        <strong>ID:</strong> {grade.id}
      </p>
      <p>
        <strong>Evaluación:</strong> {grade.evaluation_id}
      </p>
      <p>
        <strong>Estudiante:</strong> {grade.student_user_id}
      </p>
      <p>
        <strong>Nota:</strong> {grade.grade.toFixed(2)}
      </p>
      <p>
        <strong>Comentario:</strong> {grade.comment || "Sin comentario"}
      </p>
      <p>
        <strong>Creado:</strong> {new Date(grade.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Actualizado:</strong>{" "}
        {new Date(grade.updated_at).toLocaleString()}
      </p>
    </div>
  );
};

export default EvaluationGrade;
