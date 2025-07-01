"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api"; 

export interface PeriodsSectionsUserData {
  user_id: number;
  period_section_id: number;
  status: string;
}

interface BuilderProps {
  periodSectionUserId?: string; 
  afterSubmit?: () => void;
}

export default function PeriodsSectionsUserBuilder({
  periodSectionUserId,
  afterSubmit,
}: BuilderProps) {
  const [formData, setFormData] = useState<PeriodsSectionsUserData>({
    user_id: 0,
    period_section_id: 0,
    status: "",
  });

  const onSubmit = async (data: PeriodsSectionsUserData) => {
    try {
      if (periodSectionUserId) {
        await api.put(`/period-sections-users/${periodSectionUserId}`, data);
        alert("Registro actualizado exitosamente");
      } else {
        await api.post("/period-sections-users", data);
        alert("Registro creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (periodSectionUserId) {
      const fetchData = async () => {
        const response = await api.get(
          `/period-sections-users/${periodSectionUserId}`
        );
        setFormData(response.data.data);
      };
      fetchData();
    }
  }, [periodSectionUserId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "user_id" || name === "period_section_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1>{periodSectionUserId ? "Actualizar Registro" : "Crear Registro"}</h1>

      <label>ID de Usuario:</label>
      <input
        type="number"
        name="user_id"
        value={formData.user_id}
        onChange={handleChange}
        required
      />

      <label>ID de Periodo-Sección:</label>
      <input
        type="number"
        name="period_section_id"
        value={formData.period_section_id}
        onChange={handleChange}
        required
      />

      <label>Estado:</label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona un estado</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
        <option value="pendiente">Pendiente</option>
      </select>

      <button type="submit">
        {periodSectionUserId ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
