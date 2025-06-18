"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface Evaluation {
  id: number;
  title: string;
  section_id: number;
  evaluation_type_id: number;
  academic_period_id: number;
  weight: number;
  date?: string;
  due_date?: string;
}

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await api.get("/evaluations");
        if (response.data.success) {
          setEvaluations(response.data.data);
        } else {
          setError("No se pudo obtener la lista de evaluaciones.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar evaluaciones.");
      }
    };

    fetchEvaluations();
  }, []);

  const handleShow = (id: number) => router.push(`/evaluations/${id}`);
  const handleUpdate = (id: number) => router.push(`/evaluations/${id}/update`);
  const handleCreate = () => router.push("/evaluations/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Evaluaciones
      </h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : evaluations.length === 0 ? (
        <p>Cargando evaluaciones...</p>
      ) : (
        evaluations.map((evaluation) => (
          <div
            key={evaluation.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fafafa",
              color: "#000000",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              {evaluation.title}
            </strong>
            <p>Sección ID: {evaluation.section_id}</p>
            <p>Tipo de Evaluación ID: {evaluation.evaluation_type_id}</p>
            <p>Periodo Académico ID: {evaluation.academic_period_id}</p>
            <p>Peso: {evaluation.weight}%</p>
            <p>Fecha: {evaluation.date || "No especificada"}</p>
            <p>Fecha límite: {evaluation.due_date || "No especificada"}</p>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#4f46e5",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleShow(evaluation.id)}
              >
                Ver
              </button>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#f59e0b",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleUpdate(evaluation.id)}
              >
                Actualizar
              </button>
            </div>
          </div>
        ))
      )}

      <button
        style={{
          marginTop: "32px",
          width: "100%",
          padding: "14px 0",
          backgroundColor: "#9333ea",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "18px",
          transition: "background-color 0.3s ease",
        }}
        onClick={handleCreate}
      >
        Crear Nueva Evaluación
      </button>
    </div>
  );
};

export default Evaluations;
