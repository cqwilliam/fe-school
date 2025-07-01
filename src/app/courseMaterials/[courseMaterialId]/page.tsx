"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface CourseMaterial {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  type: string;
  url: string;
  created_at: string;
}

const CourseMaterial = () => {
  const { courseMaterialId } = useParams(); 
  const [material, setMaterial] = useState<CourseMaterial | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: CourseMaterial;
        }>(`/course-materials/${courseMaterialId}`);
        if (response.data.success) {
          setMaterial(response.data.data);
        } else {
          setError("No se pudo obtener el material.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el material.");
      }
    };

    if (courseMaterialId) {
      fetchMaterial();
    }
  }, [courseMaterialId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!material) {
    return <div style={{ padding: 24 }}>Cargando material...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalle del Material del Curso</h1>
      <p>
        <strong>ID:</strong> {material.id}
      </p>
      <p>
        <strong>ID del Curso:</strong> {material.course_id}
      </p>
      <p>
        <strong>Título:</strong> {material.title}
      </p>
      {material.description && (
        <p>
          <strong>Descripción:</strong> {material.description}
        </p>
      )}
      <p>
        <strong>Tipo:</strong> {material.type}
      </p>
      <p>
        <strong>URL:</strong>{" "}
        <a href={material.url} target="_blank" rel="noopener noreferrer">
          {material.url}
        </a>
      </p>
      <p>
        <strong>Registrado el:</strong>{" "}
        {new Date(material.created_at).toLocaleString()}
      </p>
    </div>
  );
};

export default CourseMaterial;
