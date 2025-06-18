"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface EnrollmentData {
  student_id: number;
  section_id: number;
  academic_period_id: number;
  enrolled_at: string;
  status: string;
}

interface EnrollmentBuilderProps {
  enrollmentId?: string;
  afterSubmit?: () => void;
}

export default function EnrollmentBuilder({
  enrollmentId,
  afterSubmit,
}: EnrollmentBuilderProps) {
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
    student_id: 0,
    section_id: 0,
    academic_period_id: 0,
    enrolled_at: new Date().toISOString(),
    status: "activo",
  });

  const onSubmit = async (data: EnrollmentData) => {
    try {
      if (enrollmentId) {
        await api.put(`/enrollments/${enrollmentId}`, data);
        alert("Matrícula actualizada exitosamente");
      } else {
        await api.post("/enrollments", data);
        alert("Matrícula creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (enrollmentId) {
      const fetchEnrollment = async () => {
        const response = await api.get(`/enrollments/${enrollmentId}`);
        setEnrollmentData(response.data.data);
      };
      fetchEnrollment();
    }
  }, [enrollmentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setEnrollmentData((prevData) => ({
      ...prevData,
      [name]:
        name === "student_id" || name === "section_id" || name === "academic_period_id"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(enrollmentData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{enrollmentId ? "Actualizar Matrícula" : "Crear Matrícula"}</h1>

      <label>ID del Estudiante:</label>
      <input
        type="number"
        name="student_id"
        value={enrollmentData.student_id}
        onChange={handleChange}
        required
      />

      <label>ID de la Sección:</label>
      <input
        type="number"
        name="section_id"
        value={enrollmentData.section_id}
        onChange={handleChange}
        required
      />

      <label>ID del Periodo Académico:</label>
      <input
        type="number"
        name="academic_period_id"
        value={enrollmentData.academic_period_id}
        onChange={handleChange}
        required
      />

      <label>Fecha de Matrícula:</label>
      <input
        type="datetime-local"
        name="enrolled_at"
        value={new Date(enrollmentData.enrolled_at).toISOString().slice(0, 16)}
        onChange={handleChange}
        required
      />

      <label>Estado:</label>
      <input
        type="text"
        name="status"
        value={enrollmentData.status}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {enrollmentId ? "Actualizar Matrícula" : "Crear Matrícula"}
      </button>
    </form>
  );
}
