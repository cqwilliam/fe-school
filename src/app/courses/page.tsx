"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  academic_period_id: number;
}

const Courses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");

        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          setError("No se pudo obtener la lista de cursos.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar cursos.");
      }
    };

    fetchCourses();
  }, []);

  const handleShow = (id: number) => router.push(`/courses/${id}`);
  const handleUpdate = (id: number) => router.push(`/courses/${id}/update`);
  const handleCreate = () => router.push("/courses/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Cursos</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar cursos: {error}</p>
      ) : courses.length === 0 ? (
        <p>Cargando cursos...</p>
      ) : (
        courses.map((course) => (
          <div
            key={course.id}
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
              {course.code} - {course.name} ({course.credits} créditos)
            </strong>
            <p style={{ marginBottom: "8px", color: "#444" }}>{course.description}</p>
            <span style={{ fontSize: "14px", color: "#666" }}>
              Periodo Académico ID: {course.academic_period_id}
            </span>
            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <button onClick={() => handleShow(course.id)}>Ver</button>
              <button onClick={() => handleUpdate(course.id)}>Actualizar</button>
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
        Crear Nuevo Curso
      </button>
    </div>
  );
};

export default Courses;
