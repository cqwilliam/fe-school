"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface CourseMaterialData {
  course_id: number;
  title: string;
  description?: string;
  type: string;
  url: string;
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
    course_id: 0,
    title: "",
    description: "",
    type: "",
    url: "",
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setMaterialData((prev) => ({
      ...prev,
      [name]: name === "course_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(materialData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{courseMaterialId ? "Actualizar Material" : "Registrar Material"}</h1>

      <label>ID del Curso:</label>
      <input
        type="number"
        name="course_id"
        value={materialData.course_id}
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
      </select>

      <label>URL del Material:</label>
      <input
        type="url"
        name="url"
        value={materialData.url}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {courseMaterialId ? "Actualizar Material" : "Registrar Material"}
      </button>
    </form>
  );
}
