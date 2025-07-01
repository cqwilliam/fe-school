"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface EvaluationTypeData {
  id?: number;
  name: string;
  description?: string;
  weight: number;
}

interface EvaluationTypeBuilderProps {
  evaluationTypeId?: string;
  afterSubmit?: () => void;
}

export default function EvaluationTypeBuilder({
  evaluationTypeId,
  afterSubmit,
}: EvaluationTypeBuilderProps) {
  const [data, setData] = useState<EvaluationTypeData>({
    name: "",
    description: "",
    weight: 0,
  });

  useEffect(() => {
    if (evaluationTypeId) {
      const fetchEvaluationType = async () => {
        try {
          const response = await api.get(
            `/evaluation-types/${evaluationTypeId}`
          );
          setData(response.data.data);
        } catch (error) {
          alert("Error al cargar el tipo de evaluación");
          console.error(error);
        }
      };
      fetchEvaluationType();
    }
  }, [evaluationTypeId]);

  const onSubmit = async (data: EvaluationTypeData) => {
    try {
      if (evaluationTypeId) {
        await api.put(`/evaluation-types/${evaluationTypeId}`, data);
        alert("Tipo de evaluación actualizado exitosamente");
      } else {
        await api.post("/evaluation-types", data);
        alert("Tipo de evaluación creado exitosamente");
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
    setData((prevData) => ({
      ...prevData,
      [name]: name === "weight" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>
        {evaluationTypeId
          ? "Actualizar Tipo de Evaluación"
          : "Crear Tipo de Evaluación"}
      </h1>

      <label>Nombre:</label>
      <input
        type="text"
        name="name"
        value={data.name}
        onChange={handleChange}
        maxLength={50}
        required
      />

      <label>Descripción (opcional):</label>
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
        onChange={handleChange}
        min={0}
        step="0.01"
        required
      />

      <button type="submit">{evaluationTypeId ? "Actualizar" : "Crear"}</button>
    </form>
  );
}
