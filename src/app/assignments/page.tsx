"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface Assignment {
  id: number;
  section_id: number;
  title: string;
  description?: string;
  published_at?: string;
  due_date: string;
  published_by: number;
}

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get("/assignments");
        if (response.data.success) {
          setAssignments(response.data.data);
        } else {
          setError("No se pudo obtener la lista de asignaciones.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar asignaciones.");
      }
    };
    fetchAssignments();
  }, []);

  const handleShow = (id: number) => router.push(`/assignments/${id}`);
  const handleUpdate = (id: number) => router.push(`/assignments/${id}/update`);
  const handleCreate = () => router.push("/assignments/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
        color: "#000000",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Asignaciones</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar asignaciones: {error}</p>
      ) : assignments.length === 0 ? (
        <p>Cargando asignaciones...</p>
      ) : (
        assignments.map((assignment) => (
          <div
            key={assignment.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fdfdfd",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              {assignment.title}
            </strong>
            <p>ID Sección: {assignment.section_id}</p>
            {assignment.description && <p>Descripción: {assignment.description}</p>}
            {assignment.published_at && <p>Publicado: {assignment.published_at}</p>}
            <p>Fecha Límite: {assignment.due_date}</p>
            <p>Publicado por: {assignment.published_by}</p>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleShow(assignment.id)}
              >
                Ver
              </button>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#f59e0b",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleUpdate(assignment.id)}
              >
                Actualizar
              </button>
            </div>
          </div>
        ))
      )}

      <button
        style={{
          marginTop: "32px",
          width: "100%",
          padding: "14px 0",
          backgroundColor: "#10b981",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "18px",
        }}
        onClick={handleCreate}
      >
        Registrar Nueva Asignación
      </button>
    </div>
  );
};

export default Assignments;
