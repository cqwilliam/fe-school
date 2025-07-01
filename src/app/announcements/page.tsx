"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface Announcement {
  id: number;
  title: string;
  content: string;
  target: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await api.get("/announcements");
        if (response.data.success) {
          setAnnouncements(response.data.data);
        } else {
          setError("No se pudo obtener la lista de anuncios.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar anuncios.");
      }
    };
    fetchAnnouncements();
  }, []);

  const handleShow = (id: number) => router.push(`/announcements/${id}`);
  const handleUpdate = (id: number) =>
    router.push(`/announcements/${id}/update`);
  const handleCreate = () => router.push("/announcements/create");

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
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Anuncios</h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : announcements.length === 0 ? (
        <p>Cargando anuncios...</p>
      ) : (
        announcements.map((announcement) => (
          <div
            key={announcement.id}
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
              {announcement.title}
            </strong>
            <p>{announcement.content}</p>
            <p>
              <strong>Target:</strong> {announcement.target}
            </p>
            <p>
              <strong>Publicado en:</strong>{" "}
              {new Date(announcement.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Publicado por (ID Usuario):</strong>{" "}
              {announcement.user_id}
            </p>

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
                onClick={() => handleShow(announcement.id)}
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
                onClick={() => handleUpdate(announcement.id)}
              >
                Editar
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
        Crear nuevo anuncio
      </button>
    </div>
  );
};

export default Announcements;
