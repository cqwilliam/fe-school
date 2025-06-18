"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface AcademicPeriod {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  active: boolean;
}

const AcademicPeriods = () => {
  const [academicPeriods, setAcademicPeriods] = useState<AcademicPeriod[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAcademicPeriods = async () => {
      try {
        const response = await api.get("/academic-periods");
        if (response.data.success) {
          setAcademicPeriods(response.data.data);
        } else {
          setError("No se pudo obtener la lista de períodos académicos.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar períodos académicos."
        );
      }
    };

    fetchAcademicPeriods();
  }, []);

  const handleShow = (id: number) => router.push(`/academicsPeriods/${id}`);
  const handleUpdate = (id: number) =>
    router.push(`/academicsPeriods/${id}/update`);
  const handleCreate = () => router.push("/academicsPeriods/create");

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
        Períodos Académicos
      </h1>

      {error ? (
        <p style={{ color: "red" }}>
          Error al cargar períodos académicos: {error}
        </p>
      ) : academicPeriods.length === 0 ? (
        <p>Cargando períodos académicos...</p>
      ) : (
        academicPeriods.map((period) => (
          <div
            key={period.id}
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
            <strong
              style={{
                fontSize: "18px",
                marginBottom: "8px",
                color: "#000000",
              }}
            >
              {period.name}{" "}
              {period.active && (
                <span style={{ color: "#16a34a" }}>(Activo)</span>
              )}
            </strong>
            <p style={{ margin: "4px 0" }}>
              Fecha de inicio:{" "}
              {new Date(period.start_date).toLocaleDateString()}
            </p>
            <p style={{ margin: "4px 0" }}>
              Fecha de fin: {new Date(period.end_date).toLocaleDateString()}
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
                onClick={() => handleShow(period.id)}
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
                onClick={() => handleUpdate(period.id)}
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
        Crear Nuevo Período Académico
      </button>
    </div>
  );
};

export default AcademicPeriods;
