"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface Period {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  active: boolean;
}

const Periods = () => {
  const router = useRouter();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await api.get("/periods");

        if (response.data.success) {
          setPeriods(response.data.data);
        } else {
          setError("No se pudo obtener la lista de períodos.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar períodos.");
      }
    };

    fetchPeriods();
  }, []);

  const handleShow = (id: number) => router.push(`/periods/${id}`);
  const handleUpdate = (id: number) => router.push(`/periods/${id}/update`);
  const handleCreate = () => router.push("/periods/create");

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
        <p style={{ color: "red" }}>Error al cargar períodos: {error}</p>
      ) : periods.length === 0 ? (
        <p>Cargando períodos...</p>
      ) : (
        periods.map((period) => (
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
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              {period.id} - {period.name} ({period.start_date} a{" "}
              {period.end_date}) {period.active ? "🟢 Activo" : "🔴 Inactivo"}
            </strong>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => handleShow(period.id)}>Ver</button>
              <button onClick={() => handleUpdate(period.id)}>
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
          backgroundColor: "#16a34a",
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
        Crear Nuevo Período
      </button>
    </div>
  );
};

export default Periods;
