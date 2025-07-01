"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface PeriodsSectionsUser {
  id: number;
  user_id: number;
  period_section_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const PeriodsSectionsUsers = () => {
  const router = useRouter();
  const [records, setRecords] = useState<PeriodsSectionsUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.get("/period-sections-users");

        if (response.data.success) {
          setRecords(response.data.data);
        } else {
          setError("No se pudo obtener la lista de registros.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar los datos.");
      }
    };

    fetchRecords();
  }, []);

  const handleShow = (id: number) => router.push(`/periodsSectionsUsers/${id}`);
  const handleUpdate = (id: number) =>
    router.push(`/periodsSectionsUsers/${id}/update`);
  const handleCreate = () => router.push("/periodsSectionsUsers/create");

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
        Asignaciones de Usuarios a Secciones
      </h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : records.length === 0 ? (
        <p>Cargando registros...</p>
      ) : (
        records.map((item) => (
          <div
            key={item.id}
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
              ID: {item.id} | Usuario: {item.user_id} | Sección:{" "}
              {item.period_section_id} | Estado: {item.status}
            </strong>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => handleShow(item.id)}>Ver</button>
              <button onClick={() => handleUpdate(item.id)}>Actualizar</button>
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
        Asignar Nuevo Usuario a Sección
      </button>
    </div>
  );
};

export default PeriodsSectionsUsers;
