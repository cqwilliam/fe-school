"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface AcademicPeriod {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  active: boolean;
}

const AcademicPeriod = () => {
  const [academicPeriod, setAcademicPeriod] = useState<AcademicPeriod | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const { periodId } = useParams();

  useEffect(() => {
    const fetchAcademicPeriod = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: AcademicPeriod;
        }>(`/academic-periods/${periodId}`);

        if (response.data.success) {
          setAcademicPeriod(response.data.data);
        } else {
          setError("No se pudo obtener el período académico.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar el período académico."
        );
      }
    };
    if (periodId) {
      fetchAcademicPeriod();
    }
  }, [periodId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!academicPeriod) {
    return <div style={{ padding: 24 }}>Cargando período académico...</div>;
  }

  return (
    <div>
      <h1>Período Académico</h1>
      <p>ID: {academicPeriod.id}</p>
      <p>Nombre: {academicPeriod.name}</p>
      <p>Fecha de inicio: {academicPeriod.start_date}</p>
      <p>Fecha de finalización: {academicPeriod.end_date}</p>
      <p>Activo: {academicPeriod.active ? "Sí" : "No"}</p>
    </div>
  );
};

export default AcademicPeriod;
