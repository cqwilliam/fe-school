"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface StudentGuardianData {
  student_user_id: number;
  guardian_user_id: number;
  relationship: string;
}

interface User {
  id: number;
  name: string;
  role_id: number;
}

interface StudentGuardianBuilderProps {
  studentsGuardiansId?: string;
  afterSubmit?: () => void;
}

export default function StudentGuardianBuilder({
  studentsGuardiansId,
  afterSubmit,
}: StudentGuardianBuilderProps) {
  const [studentGuardianData, setStudentGuardianData] =
    useState<StudentGuardianData>({
      student_user_id: 0,
      guardian_user_id: 0,
      relationship: "",
    });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtrar usuarios por rol
  const students = users.filter(user => user.role_id === 2); // Rol 2 = Estudiante
  const guardians = users.filter(user => user.role_id === 4); // Rol 4 = Apoderado

  const onSubmit = async (studentGuardianData: StudentGuardianData) => {
    try {
      if (studentsGuardiansId) {
        await api.put(
          `/students-guardians/${studentsGuardiansId}`,
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
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    if (studentsGuardiansId) {
      const fetchStudentGuardian = async () => {
        const response = await api.get(
          `/students-guardians/${studentsGuardiansId}`
        );
        setStudentGuardianData(response.data.data);
      };
      fetchStudentGuardian();
    }
  }, [studentsGuardiansId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudentGuardianData((prevData) => ({
      ...prevData,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(studentGuardianData);
  };

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>
        {studentsGuardiansId
          ? "Actualizar Relación Estudiante-Apoderado"
          : "Crear Relación Estudiante-Apoderado"}
      </h1>

      <label>Seleccione Estudiante (Rol 2):</label>
      <select
        name="student_user_id"
        value={studentGuardianData.student_user_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un estudiante</option>
        {students.map((student) => (
          <option key={student.id} value={student.id}>
            {student.name} (ID: {student.id})
          </option>
        ))}
      </select>

      <label>Seleccione Apoderado (Rol 4):</label>
      <select
        name="guardian_user_id"
        value={studentGuardianData.guardian_user_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un apoderado</option>
        {guardians.map((guardian) => (
          <option key={guardian.id} value={guardian.id}>
            {guardian.name} (ID: {guardian.id})
          </option>
        ))}
      </select>

      <label>Relación (opcional):</label>
      <input
        type="text"
        name="relationship"
        value={studentGuardianData.relationship}
        onChange={(e) => setStudentGuardianData({ ...studentGuardianData, relationship: e.target.value })}
        maxLength={100}
        placeholder="Ej: Padre/Madre, Tutor"
      />

      <button type="submit">
        {studentsGuardiansId ? "Actualizar Relación" : "Crear Relación"}
      </button>
    </form>
  );
}
