"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface CourseSectionData {
  id?: number;
  code: string;
  course_id: number;
  classroom?: string;
  max_capacity: number;
}

interface CourseSectionBuilderProps {
  courseSectionId?: string;
  afterSubmit?: () => void;
}

export default function CourseSectionBuilder({
  courseSectionId,
  afterSubmit,
}: CourseSectionBuilderProps) {
  const [courseSectionData, setCourseSectionData] = useState<CourseSectionData>({
    code: "",
    course_id: 0,
    classroom: "",
    max_capacity: 1,
  });

  const onSubmit = async (data: CourseSectionData) => {
    try {
      if (courseSectionId) {
        await api.put(`/course-sections/${courseSectionId}`, data);
        alert("Sección del curso actualizada exitosamente");
      } else {
        await api.post("/course-sections", data);
        alert("Sección del curso creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (courseSectionId) {
      const fetchCourseSection = async () => {
        const response = await api.get(`/course-sections/${courseSectionId}`);
        setCourseSectionData(response.data.data);
      };
      fetchCourseSection();
    }
  }, [courseSectionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourseSectionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(courseSectionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{courseSectionId ? "Actualizar Sección de Curso" : "Crear Sección de Curso"}</h1>

      <label>Código de la Sección:</label>
      <input
        type="text"
        name="code"
        value={courseSectionData.code}
        onChange={handleChange}
        maxLength={20}
        required
      />

      <label>ID del Curso:</label>
      <input
        type="number"
        name="course_id"
        value={courseSectionData.course_id}
        onChange={handleChange}
        required
      />

      <label>Aula (opcional):</label>
      <input
        type="text"
        name="classroom"
        value={courseSectionData.classroom || ""}
        onChange={handleChange}
        maxLength={50}
      />

      <label>Capacidad Máxima:</label>
      <input
        type="number"
        name="max_capacity"
        value={courseSectionData.max_capacity}
        onChange={handleChange}
        min={1}
        required
      />

      <button type="submit">
        {courseSectionId ? "Actualizar Sección" : "Crear Sección"}
      </button>
    </form>
  );
}
