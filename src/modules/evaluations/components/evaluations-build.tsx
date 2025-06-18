"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface EvaluationData {
  section_id: number;
  evaluation_type_id: number;
  academic_period_id: number;
  title: string;
  description?: string;
  weight: number;
  date?: string;
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
    section_id: 0,
    evaluation_type_id: 0,
    academic_period_id: 0,
    title: "",
    description: "",
    weight: 0,
    date: "",
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        name="section_id"
        value={data.section_id}
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
        name="academic_period_id"
        value={data.academic_period_id}
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

      <label>Peso (%):</label>
      <input
        type="number"
        name="weight"
        value={data.weight}
        min={0}
        step="0.01"
        onChange={handleChange}
        required
      />

      <label>Fecha de Evaluación:</label>
      <input
        type="date"
        name="date"
        value={data.date || ""}
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
