"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface AssignmentSubmission {
  id: number;
  assignment_id: number;
  student_id: number;
  file_url?: string;
  comment?: string;
  submitted_at: string;
  grade?: number;
  feedback?: string;
  graded_by?: number;
}

const AssignmentSubmissions = () => {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/assignment-submissions");

        if (response.data.success) {
          setSubmissions(response.data.data);
        } else {
          setError("No se pudo obtener la lista de entregas.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar entregas.");
      }
    };
    fetchSubmissions();
  }, []);

  const handleShow = (id: number) =>
    router.push(`/assignmentSubmissions/${id}`);
  const handleUpdate = (id: number) =>
    router.push(`/assignmentSubmissions/${id}/update`);
  const handleCreate = () => router.push("/assignmentSubmissions/create");

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
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Entregas de Asignaciones
      </h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar entregas: {error}</p>
      ) : submissions.length === 0 ? (
        <p>Cargando entregas...</p>
      ) : (
        submissions.map((submission) => (
          <div
            key={submission.id}
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
              ID Entrega: {submission.id}
            </strong>
            <p>Asignación: {submission.assignment_id}</p>
            <p>Estudiante: {submission.student_id}</p>
            <p>Fecha de entrega: {submission.submitted_at}</p>
            {submission.file_url && (
              <p>
                Archivo:{" "}
                <a
                  href={submission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3b82f6", textDecoration: "underline" }}
                >
                  Ver archivo
                </a>
              </p>
            )}
            {submission.grade !== undefined && (
              <p>Calificación: {submission.grade}</p>
            )}
            {submission.feedback && (
              <p>Retroalimentación: {submission.feedback}</p>
            )}
            {submission.graded_by !== undefined && (
              <p>Calificado por (ID Usuario): {submission.graded_by}</p>
            )}

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
                onClick={() => handleShow(submission.id)}
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
                onClick={() => handleUpdate(submission.id)}
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
        Registrar Nueva Entrega
      </button>
    </div>
  );
};

export default AssignmentSubmissions;
