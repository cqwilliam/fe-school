"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface EvaluationData {
  id: number;
  period_section_id: number;
  evaluation_type_id: number;
  teacher_user_id: number;
  title: string;
  description?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

const EvaluationDetail = () => {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  const evaluationId = params?.evaluationsId;

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: EvaluationData;
        }>(`/evaluations/${evaluationId}`);

        if (response.data.success) {
          setEvaluation(response.data.data);
        } else {
          setError("No se pudo obtener la evaluación.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar la evaluación."
        );
      }
    };

    if (evaluationId) {
      fetchEvaluation();
    }
  }, [evaluationId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!evaluation) {
    return <div style={{ padding: 24 }}>Cargando evaluación...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        Detalle de Evaluación
      </h1>
      <p>
        <strong>ID:</strong> {evaluation.id}
      </p>
      <p>
        <strong>Period Section ID:</strong> {evaluation.period_section_id}
      </p>
      <p>
        <strong>Tipo de Evaluación ID:</strong> {evaluation.evaluation_type_id}
      </p>
      <p>
        <strong>Docente (User ID):</strong> {evaluation.teacher_user_id}
      </p>
      <p>
        <strong>Título:</strong> {evaluation.title}
      </p>
      <p>
        <strong>Descripción:</strong> {evaluation.description || "N/A"}
      </p>
      <p>
        <strong>Fecha Límite:</strong>{" "}
        {evaluation.due_date || "No especificada"}
      </p>
      <p>
        <strong>Creado en:</strong> {evaluation.created_at}
      </p>
      <p>
        <strong>Última Actualización:</strong> {evaluation.updated_at}
      </p>
    </div>
  );
};

export default EvaluationDetail;
