"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface EvaluationType {
  id: number;
  name: string;
  description?: string;
  weight: number;
}

const EvaluationTypes = () => {
  const [types, setTypes] = useState<EvaluationType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvaluationTypes = async () => {
      try {
        const response = await api.get("/evaluation-types");
        if (response.data.success) {
          setTypes(response.data.data);
        } else {
          setError("No se pudieron obtener los tipos de evaluación.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar los tipos.");
      }
    };

    fetchEvaluationTypes();
  }, []);

  const handleShow = (id: number) => router.push(`/evaluationsTypes/${id}`);
  const handleUpdate = (id: number) => router.push(`/evaluationsTypes/${id}/update`);
  const handleCreate = () => router.push("/evaluationsTypes/create");

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
        Tipos de Evaluación
      </h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : types.length === 0 ? (
        <p>Cargando tipos de evaluación...</p>
      ) : (
        types.map((type) => (
          <div
            key={type.id}
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
              {type.name}
            </strong>
            <p style={{ margin: "4px 0" }}>
              Descripción: {type.description || "No especificada"}
            </p>
            <p style={{ margin: "4px 0" }}>
              Peso: {type.weight}%
            </p>
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
                onClick={() => handleShow(type.id)}
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
                onClick={() => handleUpdate(type.id)}
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
        Crear Nuevo Tipo de Evaluación
      </button>
    </div>
  );
};

export default EvaluationTypes;
