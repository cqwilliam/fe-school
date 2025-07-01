"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface StudentGuardianData {
  student_user_id: number;
  guardian_user_id: number;
  relationship: string;
}

interface StudentGuardianBuilderProps {
  studentGuardianId?: string;
  afterSubmit?: () => void;
}

export default function StudentGuardianBuilder({
  studentGuardianId,
  afterSubmit,
}: StudentGuardianBuilderProps) {
  const [studentGuardianData, setStudentGuardianData] =
    useState<StudentGuardianData>({
      student_user_id: 0,
      guardian_user_id: 0,
      relationship: "",
    });

  const onSubmit = async (studentGuardianData: StudentGuardianData) => {
    try {
      if (studentGuardianId) {
        await api.put(
          `/students-guardians/${studentGuardianId}`,
          studentGuardianData
        );
        alert("Relación actualizada exitosamente");
      } else {
        await api.post("/students-guardians", studentGuardianData);
        alert("Relación creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (studentGuardianId) {
      const fetchStudentGuardian = async () => {
        const response = await api.get(
          `/student-guardians/${studentGuardianId}`
        );
        setStudentGuardianData(response.data.data);
      };
      fetchStudentGuardian();
    }
  }, [studentGuardianId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudentGuardianData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(studentGuardianData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>
        {studentGuardianId
          ? "Actualizar Relación Estudiante-Apoderado"
          : "Crear Relación Estudiante-Apoderado"}
      </h1>

      <label>ID del Estudiante:</label>
      <input
        type="number"
        name="student_id"
        value={studentGuardianData.student_user_id}
        onChange={handleChange}
        required
      />

      <label>ID del Apoderado:</label>
      <input
        type="number"
        name="guardian_id"
        value={studentGuardianData.guardian_user_id}
        onChange={handleChange}
        required
      />

      <label>Relación (opcional):</label>
      <input
        type="text"
        name="relationship"
        value={studentGuardianData.relationship}
        onChange={handleChange}
        maxLength={100}
      />

      <button type="submit">
        {studentGuardianId ? "Actualizar Relación" : "Crear Relación"}
      </button>
    </form>
  );
}
