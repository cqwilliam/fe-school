"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface PeriodSectionData {
  period_id: number;
  section_id: number;
}

interface PeriodSectionBuilderProps {
  periodSectionId?: string;
  afterSubmit?: () => void;
}

export default function PeriodSectionBuilder({
  periodSectionId,
  afterSubmit,
}: PeriodSectionBuilderProps) {
  const [periodSectionData, setPeriodSectionData] = useState<PeriodSectionData>(
    {
      period_id: 0,
      section_id: 0,
    }
  );

  const [periods, setPeriods] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);

  const onSubmit = async (periodSectionData: PeriodSectionData) => {
    try {
      if (periodSectionId) {
        await api.put(
          `/periods-sections/${periodSectionId}`,
          periodSectionData
        );
        alert("Periodo-Sección actualizado exitosamente");
      } else {
        await api.post("/periods-sections", periodSectionData);
        alert("Periodo-Sección creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [periodRes, sectionRes] = await Promise.all([
          api.get("/periods"),
          api.get("/sections"),
        ]);
        setPeriods(periodRes.data.data || []);
        setSections(sectionRes.data.data || []);
      } catch (error) {
        console.error("Error al cargar períodos o secciones:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (periodSectionId) {
      const fetchPeriodSection = async () => {
        const response = await api.get(`/periods-sections/${periodSectionId}`);
        setPeriodSectionData(response.data.data);
      };
      fetchPeriodSection();
    }
  }, [periodSectionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPeriodSectionData((prevData) => ({
      ...prevData,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(periodSectionData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1>
        {periodSectionId
          ? "Actualizar Periodo-Sección"
          : "Crear Periodo-Sección"}
      </h1>

      <label>Periodo:</label>
      <select
        name="period_id"
        value={periodSectionData.period_id}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona un periodo</option>
        {periods.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <label>Sección:</label>
      <select
        name="section_id"
        value={periodSectionData.section_id}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona una sección</option>
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <button type="submit">
        {periodSectionId
          ? "Actualizar Periodo-Sección"
          : "Crear Periodo-Sección"}
      </button>
    </form>
  );
}
