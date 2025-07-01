"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface PeriodsSectionsUser {
  id: number;
  user_id: number;
  period_section_id: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const PeriodsSectionsUser = () => {
  const { periodSectionUserId } = useParams();
  const [record, setRecord] = useState<PeriodsSectionsUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: PeriodsSectionsUser;
        }>(`/period-sections-users/${periodSectionUserId}`);
        if (response.data.success) {
          setRecord(response.data.data);
        } else {
          setError("No se pudo obtener el registro.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el registro.");
      }
    };

    if (periodSectionUserId) {
      fetchRecord();
    }
  }, [periodSectionUserId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!record) {
    return <div style={{ padding: 24 }}>Cargando registro...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Detalles de Asignación Usuario-Sección
      </h1>
      <p>
        <strong>ID:</strong> {record.id}
      </p>
      <p>
        <strong>ID Usuario:</strong> {record.user_id}
      </p>
      <p>
        <strong>ID Sección:</strong> {record.period_section_id}
      </p>
      <p>
        <strong>Estado:</strong> {record.status}
      </p>
      <p>
        <strong>Creado en:</strong>{" "}
        {new Date(record.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Actualizado en:</strong>{" "}
        {new Date(record.updated_at).toLocaleString()}
      </p>
    </div>
  );
};

export default PeriodsSectionsUser;
