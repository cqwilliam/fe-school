"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface Section {
  id: number;
  name: string;
}

const Sections = () => {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get("/sections");

        if (response.data.success) {
          setSections(response.data.data);
        } else {
          setError("No se pudo obtener la lista de secciones.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar secciones.");
      }
    };

    fetchSections();
  }, []);

  const handleShow = (id: number) => router.push(`/sections/${id}`);
  const handleUpdate = (id: number) => router.push(`/sections/${id}/update`);
  const handleCreate = () => router.push("/sections/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Secciones</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar secciones: {error}</p>
      ) : sections.length === 0 ? (
        <p>Cargando secciones...</p>
      ) : (
        sections.map((section) => (
          <div
            key={section.id}
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
              {section.id} - {section.name}
            </strong>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => handleShow(section.id)}>Ver</button>
              <button onClick={() => handleUpdate(section.id)}>
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
        Crear Nueva Sección
      </button>
    </div>
  );
};

export default Sections;
