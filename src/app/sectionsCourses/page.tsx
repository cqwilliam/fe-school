"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface SectionCourse {
  id: number;
  course_id: number;
  section_id: number;
}

const SectionsCourses = () => {
  const router = useRouter();
  const [sectionsCourses, setSectionsCourses] = useState<SectionCourse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSectionsCourses = async () => {
      try {
        const response = await api.get("/sections-courses");

        if (response.data.success) {
          setSectionsCourses(response.data.data);
        } else {
          setError("No se pudo obtener la lista de secciones-cursos.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar secciones-cursos."
        );
      }
    };

    fetchSectionsCourses();
  }, []);

  const handleShow = (id: number) => router.push(`/sectionsCourses/${id}`);
  const handleUpdate = (id: number) =>
    router.push(`/sectionsCourses/${id}/update`);
  const handleCreate = () => router.push("/sectionsCourses/create");

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
        Secciones-Cursos
      </h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar datos: {error}</p>
      ) : sectionsCourses.length === 0 ? (
        <p>Cargando secciones-cursos...</p>
      ) : (
        sectionsCourses.map((item) => (
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
              color: "#000000",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              {item.id} | {item.course_id} - {item.section_id}
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
          backgroundColor: "#9333ea",
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
        Crear Nueva Relación
      </button>
    </div>
  );
};

export default SectionsCourses;
