"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
}

const Course = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Course }>(
          `/courses/${courseId}`
        );
        if (response.data.success) {
          setCourse(response.data.data);
        } else {
          setError("No se pudo obtener el curso.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el curso.");
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!course) {
    return <div style={{ padding: 24 }}>Cargando curso...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Detalles del Curso
      </h1>
      <p>
        <strong>ID:</strong> {course.id}
      </p>
      <p>
        <strong>Código:</strong> {course.code}
      </p>
      <p>
        <strong>Nombre:</strong> {course.name}
      </p>
      <p>
        <strong>Descripción:</strong> {course.description || "Sin descripción"}
      </p>
    </div>
  );
};

export default Course;
