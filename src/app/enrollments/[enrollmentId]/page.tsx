"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../lib/api";

interface Enrollment {
  id: number;
  student_id: number;
  section_id: number;
  academic_period_id: number;
  enrolled_at: string;
  status: string;
}

const EnrollmentDetail = () => {
  const { enrollmentId } = useParams();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Enrollment }>(
          `/enrollments/${enrollmentId}`
        );
        if (response.data.success) {
          setEnrollment(response.data.data);
        } else {
          setError("No se pudo obtener la matrícula.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar la matrícula."
        );
      }
    };

    if (enrollmentId) {
      fetchEnrollment();
    }
  }, [enrollmentId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!enrollment) {
    return <div style={{ padding: 24 }}>Cargando matrícula...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Detalle de Matrícula
      </h1>
      <p>
        <strong>ID:</strong> {enrollment.id}
      </p>
      <p>
        <strong>ID del Estudiante:</strong> {enrollment.student_id}
      </p>
      <p>
        <strong>ID de la Sección:</strong> {enrollment.section_id}
      </p>
      <p>
        <strong>ID del Periodo Académico:</strong>{" "}
        {enrollment.academic_period_id}
      </p>
      <p>
        <strong>Fecha de Matrícula:</strong>{" "}
        {new Date(enrollment.enrolled_at).toLocaleString()}
      </p>
      <p>
        <strong>Estado:</strong> {enrollment.status}
      </p>
    </div>
  );
};

export default EnrollmentDetail;
