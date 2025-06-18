"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface EvaluationData {
  section_id: number;
  evaluation_type_id: number;
  academic_period_id: number;
  title: string;
  description?: string;
  weight: number;
  date?: string;
  due_date?: string;
}

const EvaluationDetail = () => {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { evaluationsId } = useParams();

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: EvaluationData;
        }>(`/evaluations/${evaluationsId}`);

        if (response.data.success) {
          setEvaluation(response.data.data);
        } else {
          setError("No se pudo obtener la evaluación.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la evaluación.");
      }
    };

    if (evaluationsId) {
      fetchEvaluation();
    }
  }, [evaluationsId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!evaluation) {
    return <div style={{ padding: 24 }}>Cargando evaluación...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalle de Evaluación</h1>
      <p><strong>ID de Sección:</strong> {evaluation.section_id}</p>
      <p><strong>ID Tipo de Evaluación:</strong> {evaluation.evaluation_type_id}</p>
      <p><strong>ID Periodo Académico:</strong> {evaluation.academic_period_id}</p>
      <p><strong>Título:</strong> {evaluation.title}</p>
      <p><strong>Descripción:</strong> {evaluation.description || "N/A"}</p>
      <p><strong>Peso:</strong> {evaluation.weight}%</p>
      <p><strong>Fecha de Evaluación:</strong> {evaluation.date || "N/A"}</p>
      <p><strong>Fecha Límite:</strong> {evaluation.due_date || "N/A"}</p>
    </div>
  );
};

export default EvaluationDetail;
