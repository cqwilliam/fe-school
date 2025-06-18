"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface Message {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  sent_at: string;
  is_read: boolean;
  read_at: string | null;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/messages");

        if (response.data.success) {
          setMessages(response.data.data);
        } else {
          setError("No se pudo obtener la lista de mensajes.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar mensajes.");
      }
    };
    fetchMessages();
  }, []);

  const handleShow = (id: number) => router.push(`/messages/${id}`);
  const handleUpdate = (id: number) => router.push(`/messages/${id}/update`);
  const handleCreate = () => router.push("/messages/create");

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
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Mensajes</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar mensajes: {error}</p>
      ) : messages.length === 0 ? (
        <p>Cargando mensajes...</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
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
              Mensaje ID: {msg.id}
            </strong>
            <p>De (usuario): {msg.sender_id}</p>
            <p>Para (usuario): {msg.recipient_id}</p>
            <p>Contenido: {msg.content}</p>
            <p>Enviado: {new Date(msg.sent_at).toLocaleString()}</p>
            <p>Leído: {msg.is_read ? "Sí" : "No"}</p>
            {msg.read_at && <p>Fecha de lectura: {new Date(msg.read_at).toLocaleString()}</p>}

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
                onClick={() => handleShow(msg.id)}
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
                onClick={() => handleUpdate(msg.id)}
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
        Enviar Nuevo Mensaje
      </button>
    </div>
  );
};

export default Messages;
