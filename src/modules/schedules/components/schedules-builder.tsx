"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface ScheduleData {
  id?: number;
  section_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  specific_date?: string | null;
}

interface ScheduleBuilderProps {
  scheduleId?: string;
  afterSubmit?: () => void;
}

export default function ScheduleBuilder({
  scheduleId,
  afterSubmit,
}: ScheduleBuilderProps) {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    section_id: 0,
    day_of_week: "",
    start_time: "",
    end_time: "",
    is_recurring: true,
    specific_date: null,
  });

  const onSubmit = async (data: ScheduleData) => {
    try {
      if (scheduleId) {
        await api.put(`/schedules/${scheduleId}`, data);
        alert("Horario actualizado exitosamente");
      } else {
        await api.post("/schedules", data);
        alert("Horario creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (scheduleId) {
      const fetchSchedule = async () => {
        const response = await api.get(`/schedules/${scheduleId}`);
        setScheduleData(response.data.data);
      };
      fetchSchedule();
    }
  }, [scheduleId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setScheduleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(scheduleData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{scheduleId ? "Actualizar Horario" : "Crear Horario"}</h1>

      <label>ID de la Sección:</label>
      <input
        type="number"
        name="section_id"
        value={scheduleData.section_id}
        onChange={handleChange}
        required
      />

      <label>Día de la Semana:</label>
      <select
        name="day_of_week"
        value={scheduleData.day_of_week}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona un día</option>
        <option value="Monday">Lunes</option>
        <option value="Tuesday">Martes</option>
        <option value="Wednesday">Miércoles</option>
        <option value="Thursday">Jueves</option>
        <option value="Friday">Viernes</option>
        <option value="Saturday">Sábado</option>
        <option value="Sunday">Domingo</option>
      </select>

      <label>Hora de Inicio:</label>
      <input
        type="time"
        name="start_time"
        value={scheduleData.start_time}
        onChange={handleChange}
        required
      />

      <label>Hora de Fin:</label>
      <input
        type="time"
        name="end_time"
        value={scheduleData.end_time}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          name="is_recurring"
          checked={scheduleData.is_recurring}
          onChange={handleChange}
        />
        ¿Recurrente?
      </label>

      <label>Fecha específica (opcional):</label>
      <input
        type="date"
        name="specific_date"
        value={scheduleData.specific_date ?? ""}
        onChange={handleChange}
      />

      <button type="submit">
        {scheduleId ? "Actualizar Horario" : "Crear Horario"}
      </button>
    </form>
  );
}
