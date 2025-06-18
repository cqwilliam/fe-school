"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Teacher {
  id: number;
  user_id: number;
  specialty: string;
  academic_degree: string;
}

const Teacher = () => {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Teacher }>(
          `/teachers/${teacherId}`
        );
        if (response.data.success) {
          setTeacher(response.data.data);
        } else {
          setError("No se pudo obtener el profesor.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el profesor.");
      }
    };
    if (teacherId) {
      fetchTeacher();
    }
  }, [teacherId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!teacher) {
    return <div style={{ padding: 24 }}>Cargando profesor...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Profesor</h1>
      <p>ID: {teacher.id}</p>
      <p>Usuario ID: {teacher.user_id}</p>
      <p>Especialidad: {teacher.specialty}</p>
      <p>Grado Académico: {teacher.academic_degree}</p>
    </div>
  );
};

export default Teacher;
