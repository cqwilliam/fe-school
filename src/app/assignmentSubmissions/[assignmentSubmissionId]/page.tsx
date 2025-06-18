"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

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

const AssignmentSubmission = () => {
  const { assignmentSubmissionId } = useParams();
  const [submission, setSubmission] = useState<AssignmentSubmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await api.get<{ success: boolean; data: AssignmentSubmission }>(
          `/assignment-submissions/${assignmentSubmissionId}`
        );

        if (response.data.success) {
          setSubmission(response.data.data);
        } else {
          setError("No se pudo obtener la entrega de asignación.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la entrega.");
      }
    };

    if (assignmentSubmissionId) {
      fetchSubmission();
    }
  }, [assignmentSubmissionId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!submission) {
    return <div style={{ padding: 24 }}>Cargando entrega...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalle de Entrega de Asignación</h1>
      <p><strong>ID:</strong> {submission.id}</p>
      <p><strong>ID Asignación:</strong> {submission.assignment_id}</p>
      <p><strong>ID Estudiante:</strong> {submission.student_id}</p>
      {submission.file_url && (
        <p>
          <strong>Archivo:</strong>{" "}
          <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
            Ver archivo
          </a>
        </p>
      )}
      {submission.comment && <p><strong>Comentario:</strong> {submission.comment}</p>}
      <p><strong>Fecha de entrega:</strong> {submission.submitted_at}</p>
      {submission.grade !== undefined && <p><strong>Calificación:</strong> {submission.grade}</p>}
      {submission.feedback && <p><strong>Retroalimentación:</strong> {submission.feedback}</p>}
      {submission.graded_by !== undefined && (
        <p><strong>Calificado por (ID Usuario):</strong> {submission.graded_by}</p>
      )}
    </div>
  );
};

export default AssignmentSubmission;
