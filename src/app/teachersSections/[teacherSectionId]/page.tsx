"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface TeacherSectionData {
  id: number;
  section_id: number;
  teacher_id: number;
  is_primary: boolean;
}

const TeacherSection = () => {
  const { teacherSectionId } = useParams();
  const [teacherSection, setTeacherSection] = useState<TeacherSectionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherSection = async () => {
      try {
        const response = await api.get<{ success: boolean; data: TeacherSectionData }>(
          `/teacher-sections/${teacherSectionId}`
        );

        if (response.data.success) {
          setTeacherSection(response.data.data);
        } else {
          setError("No se pudo obtener la asignación.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la asignación.");
      }
    };

    if (teacherSectionId) {
      fetchTeacherSection();
    }
  }, [teacherSectionId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!teacherSection) {
    return <div style={{ padding: 24 }}>Cargando asignación...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Detalles de la Asignación Docente</h1>
      <p><strong>ID:</strong> {teacherSection.id}</p>
      <p><strong>ID de la Sección:</strong> {teacherSection.section_id}</p>
      <p><strong>ID del Profesor:</strong> {teacherSection.teacher_id}</p>
      <p><strong>¿Es el Docente Principal?:</strong> {teacherSection.is_primary ? "Sí" : "No"}</p>
    </div>
  );
};

export default TeacherSection;
