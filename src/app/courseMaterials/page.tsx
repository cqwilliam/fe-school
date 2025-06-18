"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../lib/api";

interface CourseMaterial {
  id: number;
  section_id: number;
  published_by: number;
  title: string;
  description?: string;
  type: string;
  url: string;
  published_at: string;
}

const CourseMaterials = () => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await api.get("/course-materials");

        if (response.data.success) {
          setMaterials(response.data.data);
        } else {
          setError("No se pudo obtener la lista de materiales.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar materiales.");
      }
    };

    fetchMaterials();
  }, []);

  const handleShow = (id: number) => router.push(`/courseMaterials/${id}`);
  const handleUpdate = (id: number) => router.push(`/courseMaterials/${id}/update`);
  const handleCreate = () => router.push("/courseMaterials/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
        color: "#000000",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Materiales del Curso</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar materiales: {error}</p>
      ) : materials.length === 0 ? (
        <p>Cargando materiales...</p>
      ) : (
        materials.map((material) => (
          <div
            key={material.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fdfdfd",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              {material.title}
            </strong>
            <p>Sección ID: {material.section_id}</p>
            <p>Publicado por (Usuario ID): {material.published_by}</p>
            <p>Tipo: {material.type}</p>
            <p>URL: <a href={material.url} target="_blank" rel="noopener noreferrer">{material.url}</a></p>
            {material.description && <p>Descripción: {material.description}</p>}
            <p>Publicado el: {new Date(material.published_at).toLocaleString()}</p>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                style={{
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  fontWeight: 500,
                }}
                onClick={() => handleShow(material.id)}
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
                onClick={() => handleUpdate(material.id)}
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
          backgroundColor: "#10b981",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "18px",
        }}
        onClick={handleCreate}
      >
        Registrar Nuevo Material
      </button>
    </div>
  );
};

export default CourseMaterials;
