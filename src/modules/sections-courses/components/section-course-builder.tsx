"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface SectionCourseData {
  course_id: number;
  section_id: number;
}

interface SectionCourseBuilderProps {
  sectionCourseId?: string;
  afterSubmit?: () => void;
}

export default function SectionCourseBuilder({
  sectionCourseId,
  afterSubmit,
}: SectionCourseBuilderProps) {
  const [sectionCourseData, setSectionCourseData] = useState<SectionCourseData>(
    {
      course_id: 0,
      section_id: 0,
    }
  );

  const onSubmit = async (data: SectionCourseData) => {
    try {
      if (sectionCourseId) {
        await api.put(`/sections-courses/${sectionCourseId}`, data);
        alert("Relación Sección-Curso actualizada exitosamente");
      } else {
        await api.post("/sections-courses", data);
        alert("Relación Sección-Curso creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (sectionCourseId) {
      const fetchSectionCourse = async () => {
        const response = await api.get(`/sections-courses/${sectionCourseId}`);
        setSectionCourseData(response.data.data);
      };
      fetchSectionCourse();
    }
  }, [sectionCourseId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSectionCourseData((prevData) => ({
      ...prevData,
      [name]: Number(value), // Asegurarse que sean números
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(sectionCourseData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1>
        {sectionCourseId ? "Actualizar Sección-Curso" : "Crear Sección-Curso"}
      </h1>

      <label>Curso ID:</label>
      <input
        type="number"
        name="course_id"
        value={sectionCourseData.course_id}
        onChange={handleChange}
        required
      />

      <label>Sección ID:</label>
      <input
        type="number"
        name="section_id"
        value={sectionCourseData.section_id}
        onChange={handleChange}
        required
      />

      <button type="submit">{sectionCourseId ? "Actualizar" : "Crear"}</button>
    </form>
  );
}
