"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface GradeData {
  evaluation_id: number;
  student_id: number;
  graded_by?: number | null;
  score: number;
  comment?: string;
  graded_at: string;
}

const GradeDetail = () => {
  const [grade, setGrade] = useState<GradeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { gradesId } = useParams();

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: GradeData;
        }>(`/grades/${gradesId}`);

        if (response.data.success) {
          setGrade(response.data.data);
        } else {
          setError("No se pudo obtener la calificación.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la calificación.");
      }
    };

    if (gradesId) {
      fetchGrade();
    }
  }, [gradesId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!grade) {
    return <div style={{ padding: 24 }}>Cargando calificación...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalle de Calificación</h1>
      <p><strong>ID de Evaluación:</strong> {grade.evaluation_id}</p>
      <p><strong>ID del Estudiante:</strong> {grade.student_id}</p>
      <p><strong>Calificado por:</strong> {grade.graded_by ?? "No asignado"}</p>
      <p><strong>Nota:</strong> {grade.score}</p>
      <p><strong>Comentario:</strong> {grade.comment || "N/A"}</p>
      <p><strong>Fecha de Calificación:</strong> {new Date(grade.graded_at).toLocaleString()}</p>
    </div>
  );
};

export default GradeDetail;
