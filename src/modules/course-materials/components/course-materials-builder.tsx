"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface CourseMaterialData {
  section_id: number;
  published_by: number;
  title: string;
  description?: string;
  type: string;
  url: string;
  published_at?: string;
}

interface CourseMaterialsBuilderProps {
  courseMaterialId?: string;
  afterSubmit?: () => void;
}

export default function CourseMaterialsBuilder({
  courseMaterialId,
  afterSubmit,
}: CourseMaterialsBuilderProps) {
  const [materialData, setMaterialData] = useState<CourseMaterialData>({
    section_id: 0,
    published_by: 0,
    title: "",
    description: "",
    type: "",
    url: "",
    published_at: "",
  });

  const onSubmit = async (data: CourseMaterialData) => {
    try {
      if (courseMaterialId) {
        await api.put(`/course-materials/${courseMaterialId}`, data);
        alert("Material actualizado exitosamente");
      } else {
        await api.post("/course-materials", data);
        alert("Material creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (courseMaterialId) {
      const fetchMaterial = async () => {
        const response = await api.get(`/course-materials/${courseMaterialId}`);
        setMaterialData(response.data.data);
      };
      fetchMaterial();
    }
  }, [courseMaterialId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMaterialData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(materialData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{courseMaterialId ? "Actualizar Material" : "Registrar Material"}</h1>

      <label>ID Sección:</label>
      <input
        type="number"
        name="section_id"
        value={materialData.section_id}
        onChange={handleChange}
        required
      />

      <label>ID Publicado por:</label>
      <input
        type="number"
        name="published_by"
        value={materialData.published_by}
        onChange={handleChange}
        required
      />

      <label>Título:</label>
      <input
        type="text"
        name="title"
        maxLength={100}
        value={materialData.title}
        onChange={handleChange}
        required
      />

      <label>Descripción:</label>
      <textarea
        name="description"
        value={materialData.description || ""}
        onChange={handleChange}
        rows={3}
      />

      <label>Tipo:</label>
      <select
        name="type"
        value={materialData.type}
        onChange={handleChange}
        required
      >
        <option value="">Selecciona un tipo</option>
        <option value="video">Video</option>
        <option value="link">Enlace</option>
        <option value="document">Documento</option>
        {/* Agrega más tipos si los usas */}
      </select>

      <label>URL del Material:</label>
      <input
        type="url"
        name="url"
        value={materialData.url}
        onChange={handleChange}
        required
      />

      <label>Fecha de Publicación:</label>
      <input
        type="datetime-local"
        name="published_at"
        value={materialData.published_at || ""}
        onChange={handleChange}
      />

      <button type="submit">
        {courseMaterialId ? "Actualizar Material" : "Registrar Material"}
      </button>
    </form>
  );
}
