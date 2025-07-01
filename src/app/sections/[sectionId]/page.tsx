"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Section {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

const Section = () => {
  const { sectionId } = useParams();
  const [section, setSection] = useState<Section | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Section }>(
          `/sections/${sectionId}`
        );
        if (response.data.success) {
          setSection(response.data.data);
        } else {
          setError("No se pudo obtener la sección.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la sección.");
      }
    };

    if (sectionId) {
      fetchSection();
    }
  }, [sectionId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!section) {
    return <div style={{ padding: 24 }}>Cargando sección...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Detalles de la Sección
      </h1>
      <p>
        <strong>ID:</strong> {section.id}
      </p>
      <p>
        <strong>Nombre:</strong> {section.name}
      </p>
      <p>
        <strong>Creado en:</strong>{" "}
        {new Date(section.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Última actualización:</strong>{" "}
        {new Date(section.updated_at).toLocaleString()}
      </p>
    </div>
  );
};

export default Section;
