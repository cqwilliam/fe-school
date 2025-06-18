"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface CourseSection {
  id: number;
  code: string;
  course_id: number;
  classroom?: string;
  max_capacity: number;
}

const CoursesSections = () => {
  const router = useRouter();
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get("/course-sections"); // Ajusta si tu endpoint tiene otro nombre
        if (response.data.success) {
          setSections(response.data.data);
        } else {
          setError("No se pudo obtener la lista de secciones de curso.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar secciones.");
      }
    };

    fetchSections();
  }, []);

  const handleShow = (id: number) => router.push(`/coursesSections/${id}`);
  const handleUpdate = (id: number) => router.push(`/coursesSections/${id}/update`);
  const handleCreate = () => router.push("/coursesSections/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Secciones de Cursos</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar secciones: {error}</p>
      ) : sections.length === 0 ? (
        <p>Cargando secciones...</p>
      ) : (
        sections.map((section) => (
          <div
            key={section.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fafafa",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px", color: "#000000" }}>
              Sección #{section.id} - Curso ID: {section.course_id} - Codigo de Sección: {section.code}
            </strong>
            <p><strong>Aula:</strong> {section.classroom || "No asignada"}</p>
            <p><strong>Capacidad Máxima:</strong> {section.max_capacity}</p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => handleShow(section.id)}>Ver</button>
              <button onClick={() => handleUpdate(section.id)}>Actualizar</button>
            </div>
          </div>
        ))
      )}

      <button
        style={{
          marginTop: "32px",
          width: "100%",
          padding: "14px 0",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "18px",
          transition: "background-color 0.3s ease",
        }}
        onClick={handleCreate}
      >
        Crear Nueva Sección
      </button>
    </div>
  );
};

export default CoursesSections;
