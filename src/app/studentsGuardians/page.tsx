"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface StudentGuardian {
  id: number;
  student_user_id: number;
  guardian_user_id: number;
  relationship: string | null;
}

const StudentsGuardians = () => {
  const [relations, setRelations] = useState<StudentGuardian[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRelations = async () => {
      try {
        const response = await api.get("/students-guardians");
        if (response.data.success) {
          setRelations(response.data.data);
        } else {
          setError("No se pudo obtener la lista de relaciones.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar relaciones.");
      }
    };

    fetchRelations();
  }, []);

  const handleShow = (id: number) => router.push(`/studentsGuardians/${id}`);
  const handleUpdate = (id: number) =>
    router.push(`/studentsGuardians/${id}/update`);
  const handleCreate = () => router.push("/studentsGuardians/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Relaciones Estudiante - Apoderado
      </h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : relations.length === 0 ? (
        <p>Cargando relaciones...</p>
      ) : (
        relations.map((relation) => (
          <div
            key={relation.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fafafa",
              color: "#000000",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              ID: {relation.id}
            </strong>
            <p style={{ margin: "4px 0" }}>
              Estudiante ID: {relation.student_user_id}
            </p>
            <p style={{ margin: "4px 0" }}>
              Apoderado ID: {relation.guardian_user_id}
            </p>
            <p style={{ margin: "4px 0" }}>
              Relación: {relation.relationship || "No especificada"}
            </p>
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
                onClick={() => handleShow(relation.id)}
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
                onClick={() => handleUpdate(relation.id)}
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
        Crear Nueva Relación
      </button>
    </div>
  );
};

export default StudentsGuardians;
