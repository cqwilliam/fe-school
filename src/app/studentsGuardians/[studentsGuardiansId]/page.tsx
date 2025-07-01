"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface StudentGuardian {
  id: number;
  student_user_id: number;
  guardian_user_id: number;
  relationship: string | null;
}

const StudentGuardian = () => {
  const [studentGuardian, setStudentGuardian] =
    useState<StudentGuardian | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { studentsGuardiansId } = useParams();

  useEffect(() => {
    const fetchStudentGuardian = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: StudentGuardian;
        }>(`/students-guardians/${studentsGuardiansId}`);
        if (response.data.success) {
          setStudentGuardian(response.data.data);
        } else {
          setError("No se pudo obtener la relación.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar la relación.");
      }
    };
    if (studentsGuardiansId) {
      fetchStudentGuardian();
    }
  }, [studentsGuardiansId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!studentGuardian) {
    return <div style={{ padding: 24 }}>Cargando relación...</div>;
  }

  return (
    <div>
      <h1>Relación Estudiante - Apoderado</h1>
      <p>ID: {studentGuardian.id}</p>
      <p>ID del Estudiante: {studentGuardian.student_user_id}</p>
      <p>ID del Apoderado: {studentGuardian.guardian_user_id}</p>
      <p>Relación: {studentGuardian.relationship}</p>
    </div>
  );
};

export default StudentGuardian;
