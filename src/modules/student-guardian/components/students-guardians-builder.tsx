"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api"; // Asegúrate de que esta ruta sea correcta

export interface StudentGuardianData {
  student_user_id: number;
  guardian_user_id: number;
  relationship: string;
}

interface User {
  id: number;
  full_name: string;
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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtrar usuarios por rol
  const students = users.filter((user) => user.role_id === 2); // Rol 2 = Estudiante
  const guardians = users.filter((user) => user.role_id === 4); // Rol 4 = Apoderado

  const onSubmit = async (studentGuardianData: StudentGuardianData) => {
    setError(null);
    setSuccessMessage(null);
    try {
      if (studentsGuardiansId) {
        await api.put(
          `/students-guardians/${studentsGuardiansId}`,
          studentGuardianData
        );
        setSuccessMessage("Relación actualizada exitosamente");
      } else {
        await api.post("/students-guardians", studentGuardianData);
        setSuccessMessage("Relación creada exitosamente");
        // Opcional: limpiar el formulario después de crear la relación
        setStudentGuardianData({
          student_user_id: 0,
          guardian_user_id: 0,
          relationship: "",
        });
      }
      afterSubmit?.();
    } catch (err: any) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error al cargar usuarios. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    if (studentsGuardiansId) {
      const fetchStudentGuardian = async () => {
        try {
          const response = await api.get(
            `/students-guardians/${studentsGuardiansId}`
          );
          setStudentGuardianData(response.data.data);
        } catch (err) {
          console.error("Error fetching student-guardian relation:", err);
          setError(
            "Error al cargar la relación estudiante-apoderado. Intenta de nuevo más tarde."
          );
        }
      };
      fetchStudentGuardian();
    }
  }, [studentsGuardiansId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setStudentGuardianData((prevData) => ({
      ...prevData,
      [name]: name === "relationship" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(studentGuardianData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent mb-2">
              {studentsGuardiansId
                ? "Actualizar Relación Estudiante-Apoderado"
                : "Crear Nueva Relación Estudiante-Apoderado"}
            </h1>
            <p className="text-slate-600">
              {studentsGuardiansId
                ? "Modifica la relación entre estudiante y apoderado."
                : "Establece una nueva relación entre un estudiante y un apoderado."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="student_user_id"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Seleccione Estudiante:
                </label>
                <select
                  id="student_user_id"
                  name="student_user_id"
                  value={studentGuardianData.student_user_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                >
                  <option value="">Seleccione un estudiante</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name} (ID: {student.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="guardian_user_id"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Seleccione Apoderado:
                </label>
                <select
                  id="guardian_user_id"
                  name="guardian_user_id"
                  value={studentGuardianData.guardian_user_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                >
                  <option value="">Seleccione un apoderado</option>
                  {guardians.map((guardian) => (
                    <option key={guardian.id} value={guardian.id}>
                      {guardian.full_name} (ID: {guardian.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 col-span-full">
                <label
                  htmlFor="relationship"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Relación (opcional):
                </label>
                <input
                  type="text"
                  id="relationship"
                  name="relationship"
                  value={studentGuardianData.relationship}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej: Padre/Madre, Tutor"
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {studentsGuardiansId
                  ? "Actualizar Relación"
                  : "Crear Relación"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}