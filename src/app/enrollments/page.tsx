"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface Enrollment {
  id: number;
  student_id: number;
  section_id: number;
  academic_period_id: number;
  enrolled_at: string;
  status: string;
}

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await api.get("/enrollments");
        if (response.data.success) {
          setEnrollments(response.data.data);
        } else {
          setError("No se pudo obtener la lista de matrículas.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar matrículas.");
      }
    };

    fetchEnrollments();
  }, []);

  const handleShow = (id: number) => router.push(`/enrollments/${id}`);
  const handleUpdate = (id: number) => router.push(`/enrollments/${id}/update`);
  const handleCreate = () => router.push("/enrollments/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Matrículas</h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : enrollments.length === 0 ? (
        <p>Cargando matrículas...</p>
      ) : (
        enrollments.map((enrollment) => (
          <div
            key={enrollment.id}
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
              ID: {enrollment.id}
            </strong>
            <p style={{ margin: "4px 0" }}>
              Estudiante ID: {enrollment.student_id}
            </p>
            <p style={{ margin: "4px 0" }}>
              Sección ID: {enrollment.section_id}
            </p>
            <p style={{ margin: "4px 0" }}>
              Periodo Académico ID: {enrollment.academic_period_id}
            </p>
            <p style={{ margin: "4px 0" }}>
              Fecha de Matrícula:{" "}
              {new Date(enrollment.enrolled_at).toLocaleString()}
            </p>
            <p style={{ margin: "4px 0" }}>Estado: {enrollment.status}</p>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#4f46e5",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleShow(enrollment.id)}
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
                onClick={() => handleUpdate(enrollment.id)}
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
        Crear Nueva Matrícula
      </button>
    </div>
  );
};

export default Enrollments;
