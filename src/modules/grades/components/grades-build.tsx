"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface GradeData {
  evaluation_id: number;
  student_id: number;
  graded_by?: number | null;
  score: number;
  comment?: string;
  graded_at: string;
}

interface GradeBuilderProps {
  gradesId?: string;
  afterSubmit?: () => void;
}

export default function GradeBuilder({
  gradesId,
  afterSubmit,
}: GradeBuilderProps) {
  const [gradeData, setGradeData] = useState<GradeData>({
    evaluation_id: 0,
    student_id: 0,
    graded_by: null,
    score: 0,
    comment: "",
    graded_at: new Date().toISOString(),
  });

  useEffect(() => {
    if (gradesId) {
      const fetchGrade = async () => {
        try {
          const response = await api.get(`/grades/${gradesId}`);
          setGradeData(response.data.data);
        } catch (error) {
          alert("Error al cargar la calificación");
          console.error(error);
        }
      };
      fetchGrade();
    }
  }, [gradesId]);

  const onSubmit = async (data: GradeData) => {
    try {
      if (gradesId) {
        await api.put(`/grades/${gradesId}`, data);
        alert("Calificación actualizada exitosamente");
      } else {
        await api.post("/grades", data);
        alert("Calificación creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setGradeData((prevData) => ({
      ...prevData,
      [name]: name === "score" ? parseFloat(value) : value,
    }));
  };

  // Control especial para graded_by porque puede ser null
  const handleGradedByChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGradeData((prev) => ({
      ...prev,
      graded_by: value === "" ? null : Number(value),
    }));
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(gradeData);
      }}
    >
      <h1>{gradesId ? "Actualizar Calificación" : "Crear Calificación"}</h1>

      <label>ID de Evaluación:</label>
      <input
        type="number"
        name="evaluation_id"
        value={gradeData.evaluation_id}
        onChange={handleChange}
        required
      />

      <label>ID del Estudiante:</label>
      <input
        type="number"
        name="student_id"
        value={gradeData.student_id}
        onChange={handleChange}
        required
      />

      <label>ID del Usuario Calificador (opcional):</label>
      <input
        type="number"
        name="graded_by"
        value={gradeData.graded_by ?? ""}
        onChange={handleGradedByChange}
      />

      <label>Nota (0.00 - 99.99):</label>
      <input
        type="number"
        name="score"
        value={gradeData.score}
        step="0.01"
        min={0}
        max={99.99}
        onChange={handleChange}
        required
      />

      <label>Comentario:</label>
      <textarea
        name="comment"
        value={gradeData.comment || ""}
        onChange={handleChange}
      />

      <label>Fecha de Calificación:</label>
      <input
        type="datetime-local"
        name="graded_at"
        value={new Date(gradeData.graded_at).toISOString().slice(0, 16)}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {gradesId ? "Actualizar Calificación" : "Crear Calificación"}
      </button>
    </form>
  );
}
