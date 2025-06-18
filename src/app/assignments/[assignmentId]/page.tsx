"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Assignment {
  id: number;
  section_id: number;
  title: string;
  description?: string;
  published_at?: string;
  due_date: string;
  published_by: number;
}

const Assignment = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Assignment }>(
          `/assignments/${assignmentId}`
        );
        if (response.data.success) {
          setAssignment(response.data.data);
        } else {
          setError("No se pudo obtener la asignación.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la asignación.");
      }
    };

    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!assignment) {
    return <div style={{ padding: 24 }}>Cargando asignación...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalle de Asignación</h1>
      <p><strong>ID:</strong> {assignment.id}</p>
      <p><strong>ID Sección:</strong> {assignment.section_id}</p>
      <p><strong>Título:</strong> {assignment.title}</p>
      <p><strong>Descripción:</strong> {assignment.description || "Ninguna"}</p>
      <p><strong>Publicado:</strong> {assignment.published_at || "No publicado"}</p>
      <p><strong>Fecha límite:</strong> {assignment.due_date}</p>
      <p><strong>Publicado por (ID Usuario):</strong> {assignment.published_by}</p>
    </div>
  );
};

export default Assignment;
