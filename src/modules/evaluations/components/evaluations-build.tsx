"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface EvaluationData {
  period_section_id: number;
  evaluation_type_id: number;
  teacher_user_id: number;
  title: string;
  description?: string;
  due_date?: string;
}

interface EvaluationBuilderProps {
  evaluationId?: string;
  afterSubmit?: () => void;
}

export default function EvaluationBuilder({
  evaluationId,
  afterSubmit,
}: EvaluationBuilderProps) {
  const [data, setData] = useState<EvaluationData>({
    period_section_id: 0,
    evaluation_type_id: 0,
    teacher_user_id: 0,
    title: "",
    description: "",
    due_date: "",
  });

  useEffect(() => {
    if (evaluationId) {
      const fetchEvaluation = async () => {
        try {
          const response = await api.get(`/evaluations/${evaluationId}`);
          setData(response.data.data);
        } catch (error) {
          alert("Error al cargar la evaluación");
          console.error(error);
        }
      };
      fetchEvaluation();
    }
  }, [evaluationId]);

  const onSubmit = async (data: EvaluationData) => {
    try {
      if (evaluationId) {
        await api.put(`/evaluations/${evaluationId}`, data);
        alert("Evaluación actualizada exitosamente");
      } else {
        await api.post("/evaluations", data);
        alert("Evaluación creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "weight" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{evaluationId ? "Actualizar Evaluación" : "Crear Evaluación"}</h1>

      <label>ID de la Sección:</label>
      <input
        type="number"
        name="period_section_id"
        value={data.period_section_id}
        onChange={handleChange}
        required
      />

      <label>ID del Tipo de Evaluación:</label>
      <input
        type="number"
        name="evaluation_type_id"
        value={data.evaluation_type_id}
        onChange={handleChange}
        required
      />

      <label>ID del Periodo Académico:</label>
      <input
        type="number"
        name="teacher_user_id"
        value={data.teacher_user_id}
        onChange={handleChange}
        required
      />

      <label>Título:</label>
      <input
        type="text"
        name="title"
        value={data.title}
        onChange={handleChange}
        maxLength={100}
        required
      />

      <label>Descripción:</label>
      <textarea
        name="description"
        value={data.description || ""}
        onChange={handleChange}
      />

      <label>Fecha Límite:</label>
      <input
        type="date"
        name="due_date"
        value={data.due_date || ""}
        onChange={handleChange}
      />

      <button type="submit">
        {evaluationId ? "Actualizar Evaluación" : "Crear Evaluación"}
      </button>
    </form>
  );
}
