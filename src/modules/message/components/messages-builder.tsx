import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface MessageData {
  sender_user_id: number;
  target_user_id: number;
  content: string;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface MessageBuilderProps {
  messageId?: string;
  afterSubmit?: () => void;
}

export default function MessageBuilder({
  messageId,
  afterSubmit,
}: MessageBuilderProps) {
  const [messageData, setMessageData] = useState<MessageData>({
    sender_user_id: 0,
    target_user_id: 0,
    content: "",
    is_read: false,
  });

  const onSubmit = async (messageData: MessageData) => {
    try {
      if (messageId) {
        await api.put(`/messages/${messageId}`, messageData);
        alert("Mensaje actualizado exitosamente");
      } else {
        await api.post("/messages", messageData);
        alert("Mensaje enviado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (messageId) {
      const fetchMessage = async () => {
        const response = await api.get(`/messages/${messageId}`);
        setMessageData(response.data.data);
      };
      fetchMessage();
    }
  }, [messageId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setMessageData((prevData) => ({
      ...prevData,
      [name]: name === "is_read" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(messageData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{messageId ? "Actualizar Mensaje" : "Enviar Mensaje"}</h1>

      <label>Remitente (ID):</label>
      <input
        type="number"
        name="sender_user_id"
        value={messageData.sender_user_id}
        onChange={handleChange}
        required
      />

      <label>Destinatario (ID):</label>
      <input
        type="number"
        name="target_user_id"
        value={messageData.target_user_id}
        onChange={handleChange}
        required
      />

      <label>Contenido:</label>
      <textarea
        name="content"
        value={messageData.content}
        onChange={handleChange}
        required
      />

      {messageId && (
        <>
          <label>¿Leído?:</label>
          <select
            name="is_read"
            value={String(messageData.is_read)}
            onChange={handleChange}
          >
            <option value="false">No</option>
            <option value="true">Sí</option>
          </select>
        </>
      )}

      <button type="submit">
        {messageId ? "Actualizar Mensaje" : "Enviar Mensaje"}
      </button>
    </form>
  );
}
