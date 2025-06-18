"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface Teacher {
  id: number;
  user_id: number;
  specialty: string;
  academic_degree: string;
}

const Teachers = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/teachers");

        if (response.data.success) {
          setTeachers(response.data.data);
        } else {
          setError("No se pudo obtener la lista de Docentes.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar docentes.");
      }
    };
    fetchTeachers();
  }, []);

  const handleShow = (id: number) => router.push(`/teachers/${id}`);
  const handleUpdate = (id: number) => router.push(`/teachers/${id}/update`);
  const handleCreate = () => router.push("/teachers/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Docentes</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar docentes: {error}</p>
      ) : teachers.length === 0 ? (
        <p>Cargando docentes...</p>
      ) : (
        teachers.map((teacher) => (
          <div
            key={teacher.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fafafa",
              color: "#000000"
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px", color: "#000000" }}>
              ID: {teacher.id} | Usuario ID: {teacher.user_id}
            </strong>
            <p style={{ margin: "4px 0" }}>Especialidad: {teacher.specialty}</p>
            <p style={{ margin: "4px 0" }}>Grado Académico: {teacher.academic_degree}</p>
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#4f46e5",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleShow(teacher.id)}
              >
                Ver
              </button>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#f59e0b",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleUpdate(teacher.id)}
              >
                Actualizar
              </button>
            </div>
          </div>
        ))
      )}

      <button
        style={{
          marginTop: "32px",
          width: "100%",
          padding: "14px 0",
          backgroundColor: "#9333ea",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "18px",
          transition: "background-color 0.3s ease",
        }}
        onClick={handleCreate}
      >
        Crear Nuevo Docente
      </button>
    </div>
  );
};

export default Teachers;
