import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface AnnouncementData {
  title: string;
  content: string;
  target: string;
  section_id?: number | null;
  published_by: number;
}

interface AnnouncementBuilderProps {
  announcementId?: string;
  afterSubmit?: () => void;
}

export default function AnnouncementBuilder({
  announcementId,
  afterSubmit,
}: AnnouncementBuilderProps) {
  const [announcementData, setAnnouncementData] = useState<AnnouncementData>({
    title: "",
    content: "",
    target: "",
    section_id: null,
    published_by: 0,
  });

  const onSubmit = async (data: AnnouncementData) => {
    try {
      if (announcementId) {
        await api.put(`/announcements/${announcementId}`, data);
        alert("Anuncio actualizado exitosamente");
      } else {
        await api.post("/announcements", data);
        alert("Anuncio creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (announcementId) {
      const fetchAnnouncement = async () => {
        const response = await api.get(`/announcements/${announcementId}`);
        setAnnouncementData(response.data.data);
      };
      fetchAnnouncement();
    }
  }, [announcementId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAnnouncementData((prev) => ({
      ...prev,
      [name]: name === "section_id" && value === "" ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(announcementData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{announcementId ? "Editar Anuncio" : "Crear Anuncio"}</h1>

      <label>Título:</label>
      <input
        type="text"
        name="title"
        value={announcementData.title}
        onChange={handleChange}
        required
      />

      <label>Contenido:</label>
      <textarea
        name="content"
        value={announcementData.content}
        onChange={handleChange}
        required
      />

      <label>Target (audiencia objetivo):</label>
      <input
        type="text"
        name="target"
        value={announcementData.target}
        onChange={handleChange}
        required
      />

      <label>ID de Sección (opcional):</label>
      <input
        type="number"
        name="section_id"
        value={announcementData.section_id ?? ""}
        onChange={handleChange}
      />

      <label>Publicado por (ID Usuario):</label>
      <input
        type="number"
        name="published_by"
        value={announcementData.published_by}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {announcementId ? "Actualizar Anuncio" : "Crear Anuncio"}
      </button>
    </form>
  );
}
