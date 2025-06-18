"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface Student {
  id: number;
  user_id: number;
  grade: string;
  section: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/students");

        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          setError("No se pudo obtener la lista de estudiantes.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar estudiantes.");
      }
    };
    fetchStudents();
  }, []);

  const handleShow = (id: number) => router.push(`/students/${id}`);
  const handleUpdate = (id: number) => router.push(`/students/${id}/update`);
  const handleCreate = () => router.push("/students/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Estudiantes</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar estudiantes: {error}</p>
      ) : students.length === 0 ? (
        <p>Cargando estudiantes...</p>
      ) : (
        students.map((student) => (
          <div
            key={student.id}
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
              ID: {student.id} | Usuario ID: {student.user_id}
            </strong>
            <p style={{ margin: "4px 0" }}>Grado: {student.grade}</p>
            <p style={{ margin: "4px 0" }}>Sección: {student.section}</p>
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
                onClick={() => handleShow(student.id)}
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
                onClick={() => handleUpdate(student.id)}
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
        Crear Nuevo Estudiante
      </button>
    </div>
  );
};

export default Students;
