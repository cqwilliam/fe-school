"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api"; // Asegúrate de que esta ruta sea correcta

export interface UserData {
  first_name: string;
  last_name: string;
  user_name?: string;
  email: string;
  password?: string;
  dni: string;
  birth_date?: string;
  photo_url?: string;
  phone?: string;
  address?: string;
  role_id: number;
}

interface UserBuilderProps {
  userId?: string;
  afterSubmit?: () => void;
}

export default function UserBuilder({ userId, afterSubmit }: UserBuilderProps) {
  const [userData, setUserData] = useState<UserData>({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    password: "",
    dni: "",
    birth_date: "",
    photo_url: "",
    phone: "",
    address: "",
    role_id: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: UserData) => {
    setError(null);
    setSuccessMessage(null);
    try {
      if (userId) {
        await api.put(`/users/${userId}`, data);
        setSuccessMessage("Usuario actualizado exitosamente");
      } else {
        await api.post("/users", data);
        setSuccessMessage("Usuario creado exitosamente");
        // Opcional: limpiar el formulario después de crear un usuario
        setUserData({
          first_name: "",
          last_name: "",
          user_name: "",
          email: "",
          password: "",
          dni: "",
          birth_date: "",
          photo_url: "",
          phone: "",
          address: "",
          role_id: 1,
        });
      }
      afterSubmit?.();
    } catch (err: any) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/users/${userId}`);
          setUserData(response.data.data);
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Error al cargar el usuario. Intenta de nuevo más tarde.");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false); // Si no hay userId, no necesitamos cargar un usuario existente
    }
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(userData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent mb-2">
              {userId ? "Actualizar Usuario" : "Crear Nuevo Usuario"}
            </h1>
            <p className="text-slate-600">
              {userId
                ? "Modifica los detalles del usuario existente."
                : "Completa los campos para crear un nuevo usuario."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
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
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 font-medium">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Nombre:
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. Juan"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Apellido:
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. Pérez"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="user_name"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Nombre de Usuario:
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={userData.user_name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. juan.perez"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. correo@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Contraseña:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password || ""}
                  onChange={handleChange}
                  required={!userId}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder={
                    userId ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"
                  }
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="dni"
                  className="block text-sm font-semibold text-slate-700"
                >
                  DNI:
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={userData.dni}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. 12345678"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="birth_date"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Fecha de Nacimiento:
                </label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={userData.birth_date || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. 2000-01-01"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="photo_url"
                  className="block text-sm font-semibold text-slate-700"
                >
                  URL de Foto:
                </label>
                <input
                  type="url"
                  id="photo_url"
                  name="photo_url"
                  value={userData.photo_url || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. https://ejemplo.com/foto.jpg"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Teléfono:
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={userData.phone || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. +51 987654321"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Dirección:
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={userData.address || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. Av. Principal 123"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="role_id"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Rol:
                </label>
                <select
                  id="role_id"
                  name="role_id"
                  value={userData.role_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Estudiante</option>
                  <option value={3}>Docente</option>
                  <option value={4}>Apoderado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {userId ? "Actualizar Usuario" : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}