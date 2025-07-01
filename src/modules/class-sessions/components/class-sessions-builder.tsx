"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface ClassSessionData {
  period_section_id: number;
  teacher_user_id: number;
  topic?: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface ClassSessionBuilderProps {
  classSessionId?: string;
  afterSubmit?: () => void;
}

export default function ClassSessionBuilder({
  classSessionId,
  afterSubmit,
}: ClassSessionBuilderProps) {
  const [classSessionData, setClassSessionData] = useState<ClassSessionData>({
    period_section_id: 0,
    topic: "",
    date: "",
    start_time: "",
    end_time: "",
    teacher_user_id: 0,
  });

  useEffect(() => {
    if (classSessionId) {
      const fetchClassSession = async () => {
        try {
          const response = await api.get(`/class-sessions/${classSessionId}`);
          setClassSessionData(response.data.data);
        } catch (error) {
          alert("Error al cargar la sesión de clase");
          console.error(error);
        }
      };
      fetchClassSession();
    }
  }, [classSessionId]);

  const onSubmit = async (data: ClassSessionData) => {
    try {
      if (classSessionId) {
        await api.put(`/class-sessions/${classSessionId}`, data);
        alert("Sesión de clase actualizada exitosamente");
      } else {
        await api.post("/class-sessions", data);
        alert("Sesión de clase creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setClassSessionData((prev) => ({
      ...prev,
      [name]:
        name === "teacher_user_id" || name === "period_section_id"
          ? Number(value)
          : value,
    }));
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(classSessionData);
      }}
    >
      <h1>
        {classSessionId
          ? "Actualizar Sesión de Clase"
          : "Crear Sesión de Clase"}
      </h1>

      <label>Id Sección del Periodo:</label>
      <input
        type="number"
        name="period_section_id"
        value={classSessionData.period_section_id}
        onChange={handleChange}
        required
      />

      <label>Tema:</label>
      <input
        type="text"
        name="topic"
        value={classSessionData.topic || ""}
        onChange={handleChange}
      />

      <label>Fecha:</label>
      <input
        type="date"
        name="date"
        value={classSessionData.date}
        onChange={handleChange}
        required
      />

      <label>Hora de inicio:</label>
      <input
        type="time"
        name="start_time"
        value={classSessionData.start_time}
        onChange={handleChange}
        required
      />

      <label>Hora de fin:</label>
      <input
        type="time"
        name="end_time"
        value={classSessionData.end_time}
        onChange={handleChange}
        required
      />

      <label>Id Profesor:</label>
      <input
        type="number"
        name="teacher_user_id"
        value={classSessionData.teacher_user_id}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {classSessionId ? "Actualizar Sesión" : "Crear Sesión"}
      </button>
    </form>
  );
}
