"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface TeacherSection {
  id: number;
  section_id: number;
  teacher_id: number;
  is_primary: boolean;
}

const TeacherSections = () => {
  const router = useRouter();
  const [teacherSections, setTeacherSections] = useState<TeacherSection[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherSections = async () => {
      try {
        const response = await api.get("/teacher-sections");

        if (response.data.success) {
          setTeacherSections(response.data.data);
        } else {
          setError("No se pudo obtener la lista de asignaciones.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar asignaciones.");
      }
    };

    fetchTeacherSections();
  }, []);

  const handleShow = (id: number) => router.push(`/teachersSections/${id}`);
  const handleUpdate = (id: number) => router.push(`/teachersSections/${id}/update`);
  const handleCreate = () => router.push("/teachersSections/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Asignaciones Docentes a Secciones
      </h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : teacherSections.length === 0 ? (
        <p>Cargando asignaciones...</p>
      ) : (
        teacherSections.map((item) => (
          <div
            key={item.id}
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
              ID: {item.id} | Profesor: {item.teacher_id} | Sección: {item.section_id} | Principal: {item.is_primary ? "Sí" : "No"}
            </strong>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => handleShow(item.id)}>Ver</button>
              <button onClick={() => handleUpdate(item.id)}>Actualizar</button>
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
        Crear Nueva Asignación
      </button>
    </div>
  );
};

export default TeacherSections;
