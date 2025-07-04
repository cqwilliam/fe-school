"use client";

import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import MessageCreate from "../messages/create/page";

interface Message {
  sender_user_id: number;
  target_user_id: number;
  content: string;
  is_read?: boolean;
  created_at?: string;
  updated_at?: string;
  sender?: {
    full_name: string;
    photo_url?: string;
  };
  target?: {
    full_name: string;
    photo_url?: string;
  };
}

const MessageDash: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; full_name: string } | null>(
    null
  );
  const router = useRouter();

  // Cargar información del usuario
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get("/current-user");
        setUser({
          id: response.data.id,
          full_name: response.data.full_name || "Usuario",
        });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        logout();
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await api.get(`/users/${user.id}/messages`);

        // Solo obtenemos los datos básicos sin información adicional de usuarios
        setMessages(response.data.data || response.data);
      } catch (err: any) {
        let errorMessage = "Error al cargar los mensajes.";
        if (err.response) {
          errorMessage =
            err.response.data?.message ||
            `Error del servidor: ${err.response.status} ${err.response.statusText}`;
        } else if (err.request) {
          errorMessage =
            "Error de conexión. Verifica tu red e intenta nuevamente.";
        } else {
          errorMessage = `Error al configurar la solicitud: ${err.message}`;
        }

        setError(errorMessage);
        console.error("Detalles del error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha desconocida";
    }
  };

  // Función para obtener el nombre seguro
  const getSafeName = (name?: string) => {
    if (!name) return "Desconocido";
    const parts = name.split(" ");
    return `${parts[0]}${parts[1] ? " " + parts[1].charAt(0) + "." : ""}`;
  };

  // Función para obtener la inicial segura
  const getSafeInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-600">Cargando información del usuario...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-100 rounded p-4">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 text-red-400">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
        <MessageCreate/>
        <p className="text-gray-600 mt-1">Todos tus mensajes aparecerán aquí</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay mensajes
          </h3>
          <p className="text-gray-500">
            No has recibido ningún mensaje todavía.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-sm border ${
                message.is_read ? "border-gray-200" : "border-blue-200"
              } p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {getSafeInitial("Remitente")}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {message.sender?.full_name ||
                        getSafeName(`Usuario ${message.sender_user_id}`)}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Para:{" "}
                      {user.id === message.target_user_id
                        ? "Ti"
                        : message.target?.full_name ||
                          `Usuario ${message.target_user_id}`}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(message.created_at || "")}
                </span>
              </div>

              <div className="text-gray-700 mb-4">{message.content}</div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Estado:</span>{" "}
                  {message.is_read ? "Leído" : "No leído"}
                </div>
                {!message.is_read && (
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Marcar como leído
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function logout() {
  localStorage.removeItem("token");
}

export default MessageDash;
