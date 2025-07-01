"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface SectionData {
  name: string;
}

interface SectionBuilderProps {
  sectionId?: string;
  afterSubmit?: () => void;
}

export default function SectionBuilder({
  sectionId,
  afterSubmit,
}: SectionBuilderProps) {
  const [sectionData, setSectionData] = useState<SectionData>({
    name: "",
  });

  const onSubmit = async (sectionData: SectionData) => {
    try {
      if (sectionId) {
        await api.put(`/sections/${sectionId}`, sectionData);
        alert("Sección actualizada exitosamente");
      } else {
        await api.post("/sections", sectionData);
        alert("Sección creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (sectionId) {
      const fetchSection = async () => {
        const response = await api.get(`/sections/${sectionId}`);
        setSectionData(response.data.data);
      };
      fetchSection();
    }
  }, [sectionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSectionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(sectionData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1>{sectionId ? "Actualizar Sección" : "Crear Sección"}</h1>

      <label>Nombre de la Sección:</label>
      <input
        type="text"
        name="name"
        value={sectionData.name}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {sectionId ? "Actualizar Sección" : "Crear Sección"}
      </button>
    </form>
  );
}
