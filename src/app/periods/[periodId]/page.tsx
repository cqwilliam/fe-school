"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Period {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const Period = () => {
  const { periodId } = useParams();
  const [period, setPeriod] = useState<Period | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeriod = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Period }>(
          `/periods/${periodId}`
        );
        if (response.data.success) {
          setPeriod(response.data.data);
        } else {
          setError("No se pudo obtener el período.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el período.");
      }
    };

    if (periodId) {
      fetchPeriod();
    }
  }, [periodId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!period) {
    return <div style={{ padding: 24 }}>Cargando período...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Detalles del Período
      </h1>
      <p>
        <strong>ID:</strong> {period.id}
      </p>
      <p>
        <strong>Nombre:</strong> {period.name}
      </p>
      <p>
        <strong>Fecha de Inicio:</strong> {period.start_date}
      </p>
      <p>
        <strong>Fecha de Fin:</strong> {period.end_date}
      </p>
      <p>
        <strong>Activo:</strong> {period.active ? "Sí" : "No"}
      </p>
      <p>
        <strong>Creado en:</strong> {period.created_at}
      </p>
      <p>
        <strong>Última Actualización:</strong> {period.updated_at}
      </p>
    </div>
  );
};

export default Period;
