"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Student {
  id: number;
  user_id: number;
  grade: string;
  section: string;
}

const Student = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Student }>(
          `/students/${studentId}`
        );
        if (response.data.success) {
          setStudent(response.data.data);
        } else {
          setError("No se pudo obtener el estudiante.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar el estudiante."
        );
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!student) {
    return <div style={{ padding: 24 }}>Cargando estudiante...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Estudiante</h1>
      <p>ID: {student.id}</p>
      <p>Usuario ID: {student.user_id}</p>
      <p>Grado: {student.grade}</p>
      <p>Sección: {student.section}</p>
    </div>
  );
};

export default Student;
