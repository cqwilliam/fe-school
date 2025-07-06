"use client";

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

interface User {
  id: number;
  full_name: string;
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

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: MessageData) => {
    setError(null);
    setSuccessMessage(null);
    try {
      if (messageId) {
        await api.put(`/messages/${messageId}`, data);
        setSuccessMessage("Mensaje actualizado exitosamente");
      } else {
        await api.post("/messages", data);
        setSuccessMessage("Mensaje enviado exitosamente");
        setMessageData({
          sender_user_id: 0,
          target_user_id: 0,
          content: "",
          is_read: false,
        });
      }
      afterSubmit?.();
    } catch (err: any) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        setUsers(response.data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error al cargar usuarios. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    if (messageId) {
      const fetchMessage = async () => {
        try {
          const response = await api.get(`/messages/${messageId}`);
          setMessageData(response.data.data);
        } catch (err) {
          console.error("Error fetching message:", err);
          setError("Error al cargar el mensaje. Intenta de nuevo más tarde.");
        }
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
      [name]:
        name === "is_read"
          ? value === "true"
          : name === "sender_user_id" || name === "target_user_id"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(messageData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div className="">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {messageId ? "Actualizar Mensaje" : "Nuevo Mensaje"}
            </h1>
            <p className="text-slate-600">
              {messageId ? "Modifica los detalles del mensaje" : "Envía un mensaje a otro usuario"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="sender_user_id" className="block text-sm font-semibold text-slate-700">
                  Remitente
                </label>
                <select
                  id="sender_user_id"
                  name="sender_user_id"
                  value={messageData.sender_user_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                >
                  <option value="">Seleccione un remitente</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.id} {user.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="target_user_id" className="block text-sm font-semibold text-slate-700">
                  Destinatario
                </label>
                <select
                  id="target_user_id"
                  name="target_user_id"
                  value={messageData.target_user_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                >
                  <option value="">Seleccione un destinatario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.id} {user.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-semibold text-slate-700">
                Contenido del mensaje
              </label>
              <textarea
                id="content"
                name="content"
                value={messageData.content}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 resize-y min-h-[100px] max-h-[200px]"
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            {messageId && (
              <div className="space-y-2">
                <label htmlFor="is_read" className="block text-sm font-semibold text-slate-700">
                  Estado de lectura
                </label>
                <select
                  id="is_read"
                  name="is_read"
                  value={String(messageData.is_read)}
                  onChange={handleChange}
                  className="w-full md:w-auto px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                >
                  <option value="false">No leído</option>
                  <option value="true">Leído</option>
                </select>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {messageId ? "Actualizar Mensaje" : "Enviar Mensaje"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}