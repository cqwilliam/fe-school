"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface SectionCourse {
  id: number;
  course_id: number;
  section_id: number;
}

const SectionCourse = () => {
  const { sectionCourseId } = useParams();
  const [sectionCourse, setSectionCourse] = useState<SectionCourse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSectionCourse = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: SectionCourse;
        }>(`/sections-courses/${sectionCourseId}`);
        if (response.data.success) {
          setSectionCourse(response.data.data);
        } else {
          setError("No se pudo obtener el registro de sección-curso.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el registro.");
      }
    };

    if (sectionCourseId) {
      fetchSectionCourse();
    }
  }, [sectionCourseId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!sectionCourse) {
    return <div style={{ padding: 24 }}>Cargando sección-curso...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Detalle de la Relación Sección-Curso
      </h1>
      <p>
        <strong>ID:</strong> {sectionCourse.id}
      </p>
      <p>
        <strong>Course ID:</strong> {sectionCourse.course_id}
      </p>
      <p>
        <strong>Section ID:</strong> {sectionCourse.section_id}
      </p>
    </div>
  );
};

export default SectionCourse;
