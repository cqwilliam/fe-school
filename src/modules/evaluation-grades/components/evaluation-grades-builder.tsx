"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface EvaluationGradeData {
  id?: number;
  evaluation_id: number;
  student_user_id: number;
  grade: string;
  comment?: string;
}

interface EvaluationGradeBuilderProps {
  evaluationGradeId?: string;
  afterSubmit?: () => void;
}

export default function EvaluationGradeBuilder({
  evaluationGradeId,
  afterSubmit,
}: EvaluationGradeBuilderProps) {
  const [gradeData, setGradeData] = useState<EvaluationGradeData>({
    evaluation_id: 0,
    student_user_id: 0,
    grade: "",
    comment: "",
  });

  const onSubmit = async (data: EvaluationGradeData) => {
    try {
      const payload = {
        ...data,
        grade: parseFloat(data.grade),
      };

      if (evaluationGradeId) {
        await api.put(`/evaluation-grades/${evaluationGradeId}`, payload);
        alert("Nota actualizada exitosamente");
      } else {
        await api.post("/evaluation-grades", payload);
        alert("Nota creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (evaluationGradeId) {
      const fetchGrade = async () => {
        try {
          const response = await api.get(
            `/evaluation-grades/${evaluationGradeId}`
          );
          setGradeData({
            ...response.data.data,
            grade: String(response.data.data.grade),
          });
        } catch (error: any) {
          alert(`Error al cargar la nota: ${error.message}`);
        }
      };
      fetchGrade();
    }
  }, [evaluationGradeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGradeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(gradeData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 24 }}>
      <h1>{evaluationGradeId ? "Actualizar Nota" : "Asignar Nota"}</h1>

      <label>ID de la Evaluación:</label>
      <input
        type="number"
        name="evaluation_id"
        value={gradeData.evaluation_id}
        onChange={handleChange}
        required
      />

      <label>ID del Estudiante (Usuario):</label>
      <input
        type="number"
        name="student_user_id"
        value={gradeData.student_user_id}
        onChange={handleChange}
        required
      />

      <label>Nota (0.00 - 99.99):</label>
      <input
        type="number"
        name="grade"
        step="0.01"
        min="0"
        max="99.99"
        value={gradeData.grade}
        onChange={handleChange}
        required
      />

      <label>Comentario:</label>
      <textarea
        name="comment"
        value={gradeData.comment || ""}
        onChange={handleChange}
      />

      <button type="submit">
        {evaluationGradeId ? "Actualizar Nota" : "Asignar Nota"}
      </button>
    </form>
  );
}
