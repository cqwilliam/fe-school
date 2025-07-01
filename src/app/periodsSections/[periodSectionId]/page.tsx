"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api"; 

interface PeriodSectionData {
  id: number;
  section_id: number;
  period_id: number;
  created_at: string;
  updated_at: string;
}

const PeriodSection = () => {
  const { periodSectionId } = useParams();
  const [data, setData] = useState<PeriodSectionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeriodSection = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: PeriodSectionData;
        }>(`/periods-sections/${periodSectionId}`);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError("No se pudo obtener la relación sección-período.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar la información."
        );
      }
    };

    if (periodSectionId) {
      fetchPeriodSection();
    }
  }, [periodSectionId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!data) {
    return (
      <div style={{ padding: 24 }}>Cargando datos de sección y período...</div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Detalles de Sección-Período
      </h1>
      <p>
        <strong>ID:</strong> {data.id}
      </p>
      <p>
        <strong>Sección:</strong> (ID: {data.section_id})
      </p>
      <p>
        <strong>Período:</strong> (ID: {data.period_id})
      </p>
      <p>
        <strong>Creado el:</strong> {new Date(data.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Actualizado el:</strong>{" "}
        {new Date(data.updated_at).toLocaleString()}
      </p>
    </div>
  );
};

export default PeriodSection;
