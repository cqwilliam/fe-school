"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface StudentData {
  user_id: number;
  grade: string;
  section: string;
}

interface StudentBuilderProps {
  studentId?: string;
  afterSubmit?: () => void;
}

export default function StudentBuilder({
  studentId,
  afterSubmit,
}: StudentBuilderProps) {
  const [studentData, setStudentData] = useState<StudentData>({
    user_id: 0,
    grade: "",
    section: "",
  });

  const onSubmit = async (studentData: StudentData) => {
    try {
      if (studentId) {
        await api.put(`/students/${studentId}`, studentData);
        alert("Estudiante actualizado exitosamente");
      } else {
        await api.post("/students", studentData);
        alert("Estudiante creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (studentId) {
      const fetchStudent = async () => {
        const response = await api.get(`/students/${studentId}`);
        setStudentData(response.data.data);
      };
      fetchStudent();
    }
  }, [studentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(studentData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{studentId ? "Actualizar Estudiante" : "Crear Estudiante"}</h1>

      <label>ID de Usuario:</label>
      <input
        type="number"
        name="user_id"
        value={studentData.user_id}
        onChange={handleChange}
        required
      />

      <label>Grado:</label>
      <input
        type="text"
        name="grade"
        value={studentData.grade}
        onChange={handleChange}
        maxLength={20}
        required
      />

      <label>Sección:</label>
      <input
        type="text"
        name="section"
        value={studentData.section}
        onChange={handleChange}
        maxLength={10}
        required
      />

      <button type="submit">
        {studentId ? "Actualizar Estudiante" : "Crear Estudiante"}
      </button>
    </form>
  );
}
