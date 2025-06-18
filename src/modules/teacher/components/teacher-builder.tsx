"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface TeacherData {
  user_id: number;
  specialty: string;
  academic_degree: string;
}

interface TeacherBuilderProps {
  teacherId?: string;
  afterSubmit?: () => void;
}

export default function TeacherBuilder({
  teacherId,
  afterSubmit,
}: TeacherBuilderProps) {
  const [teacherData, setTeacherData] = useState<TeacherData>({
    user_id: 0,
    specialty: "",
    academic_degree: "",
  });

  const onSubmit = async (teacherData: TeacherData) => {
    try {
      if (teacherId) {
        await api.put(`/teachers/${teacherId}`, teacherData);
        alert("Docente actualizado exitosamente");
      } else {
        await api.post("/teachers", teacherData);
        alert("Docente creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (teacherId) {
      const fetchTeacher = async () => {
        const response = await api.get(`/teachers/${teacherId}`);
        setTeacherData(response.data.data);
      };
      fetchTeacher();
    }
  }, [teacherId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTeacherData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(teacherData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{teacherId ? "Actualizar Docente" : "Crear Docente"}</h1>

      <label>ID de Usuario:</label>
      <input
        type="number"
        name="user_id"
        value={teacherData.user_id}
        onChange={handleChange}
        required
      />

      <label>Especialidad:</label>
      <input
        type="text"
        name="specialty"
        value={teacherData.specialty}
        onChange={handleChange}
        required
      />

      <label>Grado Académico:</label>
      <input
        type="text"
        name="academic_degree"
        value={teacherData.academic_degree}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {teacherId ? "Actualizar Docente" : "Crear Docente"}
      </button>
    </form>
  );
}
