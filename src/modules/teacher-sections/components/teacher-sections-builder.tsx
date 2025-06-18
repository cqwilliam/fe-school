"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface TeacherSectionData {
  section_id: number;
  teacher_id: number;
  is_primary: boolean;
}

interface TeacherSectionBuilderProps {
  teacherSectionId?: string;
  afterSubmit?: () => void;
}

export default function TeacherSectionBuilder({
  teacherSectionId,
  afterSubmit,
}: TeacherSectionBuilderProps) {
  const [teacherSectionData, setTeacherSectionData] =
    useState<TeacherSectionData>({
      section_id: 0,
      teacher_id: 0,
      is_primary: true,
    });

  const onSubmit = async (data: TeacherSectionData) => {
    try {
      if (teacherSectionId) {
        await api.put(`/teacher-sections/${teacherSectionId}`, data);
        alert("Asignación docente actualizada exitosamente");
      } else {
        await api.post("/teacher-sections", data);
        alert("Asignación docente creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (teacherSectionId) {
      const fetchTeacherSection = async () => {
        const response = await api.get(`/teacher-sections/${teacherSectionId}`);
        setTeacherSectionData(response.data.data);
      };
      fetchTeacherSection();
    }
  }, [teacherSectionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setTeacherSectionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(teacherSectionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>
        {teacherSectionId
          ? "Actualizar Asignación Docente"
          : "Crear Asignación Docente"}
      </h1>

      <label>ID de la Sección:</label>
      <input
        type="number"
        name="section_id"
        value={teacherSectionData.section_id}
        onChange={handleChange}
        required
      />

      <label>ID del Profesor:</label>
      <input
        type="number"
        name="teacher_id"
        value={teacherSectionData.teacher_id}
        onChange={handleChange}
        required
      />

      <label>
        <input
          type="checkbox"
          name="is_primary"
          checked={teacherSectionData.is_primary}
          onChange={handleChange}
        />
        ¿Es el Docente Principal?
      </label>

      <button type="submit">
        {teacherSectionId ? "Actualizar Asignación" : "Crear Asignación"}
      </button>
    </form>
  );
}
