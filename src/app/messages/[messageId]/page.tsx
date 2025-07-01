"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Message {
  id: number;
  sender_user_id: number;
  target_user_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

const Message = () => {
  const { messageId } = useParams();
  const [message, setMessage] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Message }>(
          `/messages/${messageId}`
        );

        if (response.data.success) {
          setMessage(response.data.data);
        } else {
          setError("No se pudo obtener el mensaje.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el mensaje.");
      }
    };

    if (messageId) {
      fetchMessage();
    }
  }, [messageId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!message) {
    return <div style={{ padding: 24 }}>Cargando mensaje...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Detalle del Mensaje</h1>
      <p>
        <strong>ID:</strong> {message.id}
      </p>
      <p>
        <strong>Remitente (ID):</strong> {message.sender_user_id}
      </p>
      <p>
        <strong>Destinatario (ID):</strong> {message.target_user_id}
      </p>
      <p>
        <strong>Contenido:</strong> {message.content}
      </p>
      <p>
        <strong>Enviado en:</strong>{" "}
        {new Date(message.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Leído:</strong> {message.is_read ? "Sí" : "No"}
      </p>
    </div>
  );
};

export default Message;
