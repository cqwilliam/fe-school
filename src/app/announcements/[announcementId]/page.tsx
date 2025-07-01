"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Announcement {
  id: number;
  title: string;
  content: string;
  target: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

const AnnouncementDetail = () => {
  const { announcementId } = useParams();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          data: Announcement;
        }>(`/announcements/${announcementId}`);
        if (response.data.success) {
          setAnnouncement(response.data.data);
        } else {
          setError("No se pudo obtener el anuncio.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el anuncio.");
      }
    };

    if (announcementId) {
      fetchAnnouncement();
    }
  }, [announcementId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!announcement) {
    return <div style={{ padding: 24 }}>Cargando anuncio...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalle del Anuncio</h1>
      <p>
        <strong>ID:</strong> {announcement.id}
      </p>
      <p>
        <strong>Título:</strong> {announcement.title}
      </p>
      <p>
        <strong>Contenido:</strong> {announcement.content}
      </p>
      <p>
        <strong>Target:</strong> {announcement.target}
      </p>
      <p>
        <strong>Publicado en:</strong>{" "}
        {new Date(announcement.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Publicado por (ID Usuario):</strong> {announcement.user_id}
      </p>
    </div>
  );
};

export default AnnouncementDetail;
