"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface CourseSection {
  id: number;
  code: string;
  course_id: number;
  classroom?: string;
  max_capacity: number;
  created_at?: string;
  updated_at?: string;
}

const CourseSection = () => {
  const { courseSectionId } = useParams();
  const [section, setSection] = useState<CourseSection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await api.get<{ success: boolean; data: CourseSection }>(
          `/course-sections/${courseSectionId}`
        );

        if (response.data.success) {
          setSection(response.data.data);
        } else {
          setError("No se pudo obtener la sección del curso.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la sección.");
      }
    };

    if (courseSectionId) {
      fetchSection();
    }
  }, [courseSectionId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!section) {
    return <div style={{ padding: 24 }}>Cargando sección...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Detalles de la Sección</h1>
      <p><strong>ID:</strong> {section.id}</p>
      <p><strong>Código:</strong> {section.code}</p>
      <p><strong>ID del Curso:</strong> {section.course_id}</p>
      <p><strong>Aula:</strong> {section.classroom || "No asignada"}</p>
      <p><strong>Capacidad Máxima:</strong> {section.max_capacity}</p>
      {section.created_at && <p><strong>Creado el:</strong> {new Date(section.created_at).toLocaleString()}</p>}
      {section.updated_at && <p><strong>Actualizado el:</strong> {new Date(section.updated_at).toLocaleString()}</p>}
    </div>
  );
};

export default CourseSection;
