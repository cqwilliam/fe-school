"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface EvaluationType {
  id: number;
  name: string;
  description?: string;
  weight: number;
}

const EvaluationType = () => {
  const [evaluationType, setEvaluationType] = useState<EvaluationType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { evaluationTypesId } = useParams();

  useEffect(() => {
    const fetchEvaluationType = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: EvaluationType;
        }>(`/evaluation-types/${evaluationTypesId}`);
        if (response.data.success) {
          setEvaluationType(response.data.data);
        } else {
          setError("No se pudo obtener el tipo de evaluación.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el tipo.");
      }
    };

    if (evaluationTypesId) {
      fetchEvaluationType();
    }
  }, [evaluationTypesId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!evaluationType) {
    return <div style={{ padding: 24 }}>Cargando tipo de evaluación...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "16px" }}>
        Tipo de Evaluación
      </h1>
      <p>
        <strong>ID:</strong> {evaluationType.id}
      </p>
      <p>
        <strong>Nombre:</strong> {evaluationType.name}
      </p>
      <p>
        <strong>Descripción:</strong>{" "}
        {evaluationType.description || "No especificada"}
      </p>
      <p>
        <strong>Peso:</strong> {evaluationType.weight}%
      </p>
    </div>
  );
};

export default EvaluationType;
