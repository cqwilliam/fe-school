"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface PeriodData {
  name: string;
  start_date: string;
  end_date: string;
  active: boolean;
}

interface PeriodBuilderProps {
  periodId?: string;
  afterSubmit?: () => void;
}

export default function PeriodBuilder({
  periodId,
  afterSubmit,
}: PeriodBuilderProps) {
  const [periodData, setPeriodData] = useState<PeriodData>({
    name: "",
    start_date: "",
    end_date: "",
    active: false,
  });

  const onSubmit = async (periodData: PeriodData) => {
    try {
      if (periodId) {
        await api.put(`/periods/${periodId}`, periodData);
        alert("Periodo actualizado exitosamente");
      } else {
        await api.post("/periods", periodData);
        alert("Periodo creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (periodId) {
      const fetchPeriod = async () => {
        const response = await api.get(`/periods/${periodId}`);
        setPeriodData(response.data.data);
      };
      fetchPeriod();
    }
  }, [periodId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPeriodData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(periodData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1>{periodId ? "Actualizar Periodo" : "Crear Periodo"}</h1>

      <label>Nombre del Periodo:</label>
      <input
        type="text"
        name="name"
        value={periodData.name}
        onChange={handleChange}
        required
      />

      <label>Fecha de Inicio:</label>
      <input
        type="date"
        name="start_date"
        value={periodData.start_date}
        onChange={handleChange}
        required
      />

      <label>Fecha de Fin:</label>
      <input
        type="date"
        name="end_date"
        value={periodData.end_date}
        onChange={handleChange}
        required
      />

      <label>Activo:</label>
      <input
        type="checkbox"
        name="active"
        checked={periodData.active}
        onChange={handleChange}
      />

      <button type="submit">
        {periodId ? "Actualizar Periodo" : "Crear Periodo"}
      </button>
    </form>
  );
}
