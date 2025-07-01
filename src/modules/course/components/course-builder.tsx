"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface CourseData {
  id?: number;
  code: string;
  name: string;
  description?: string;
}

interface CourseBuilderProps {
  courseId?: string;
  afterSubmit?: () => void;
}

export default function CourseBuilder({
  courseId,
  afterSubmit,
}: CourseBuilderProps) {
  const [courseData, setCourseData] = useState<CourseData>({
    code: "",
    name: "",
    description: "",
  });

  const onSubmit = async (courseData: CourseData) => {
    try {
      if (courseId) {
        await api.put(`/courses/${courseId}`, courseData);
        alert("Curso actualizado exitosamente");
      } else {
        await api.post("/courses", courseData);
        alert("Curso creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        const response = await api.get(`/courses/${courseId}`);
        setCourseData(response.data.data);
      };
      fetchCourse();
    }
  }, [courseId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(courseData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{courseId ? "Actualizar Curso" : "Crear Curso"}</h1>

      <label>Código del Curso:</label>
      <input
        type="text"
        name="code"
        value={courseData.code}
        onChange={handleChange}
        maxLength={20}
        required
      />

      <label>Nombre del Curso:</label>
      <input
        type="text"
        name="name"
        value={courseData.name}
        onChange={handleChange}
        maxLength={100}
        required
      />

      <label>Descripción:</label>
      <textarea
        name="description"
        value={courseData.description || ""}
        onChange={handleChange}
        rows={4}
      />

      <button type="submit">
        {courseId ? "Actualizar Curso" : "Crear Curso"}
      </button>
    </form>
  );
}
