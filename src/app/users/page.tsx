"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import UserCreate from "./create/page"; 

interface User {
  id: number;
  first_name: string;
  last_name: string;
  age_name: number;
  user_name: string;
  email: string;
  dni: string;
  photo_url: string;
  phone: string;
  address: string;
  role_name: string;
}

type UserRole =
  | "all"
  | "administrador"
  | "docente"
  | "estudiante"
  | "apoderado";

const Users = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<UserRole>("all");
  const [deletingId, setDeletingId] = useState<number | null>(null); 

  // Función para obtener los usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/users");

      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError(
          response.data.message || "No se pudo obtener la lista de usuarios."
        );
      }
    } catch (err: any) {
      console.error("Error al obtener usuarios:", err);
      setError(
        err.response?.data?.message ||
          "Error al cargar usuarios. Intente de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (filterRole === "all") {
      return users;
    }
    return users.filter((user) => user.role_name.toLowerCase() === filterRole);
  }, [users, filterRole]);

  const handleShow = (id: number) => router.push(`/users/${id}`); // No se usa en el renderizado actual, pero se mantiene.
  const handleUpdate = (id: number) => router.push(`/users/${id}/update`);
  const handleCreate = () => router.push("/users/create"); // Descomentado en tu original, puedes volver a usarlo.
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRole(e.target.value as UserRole);
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar este usuario?")
    ) {
      return; // Si el usuario cancela, no hacemos nada
    }

    setDeletingId(id); // Indica que estamos intentando eliminar este ID
    try {
      const response = await api.delete(`/users/${id}`);

      if (response.data.success) {
        // Si la eliminación fue exitosa, actualiza la lista de usuarios
        setUsers(users.filter((user) => user.id !== id));
        alert("Usuario eliminado correctamente.");
      } else {
        setError(response.data.message || "No se pudo eliminar el usuario.");
      }
    } catch (err: any) {
      console.error("Error al eliminar usuario:", err);
      setError(
        err.response?.data?.message ||
          "Error al eliminar el usuario. Intente de nuevo más tarde."
      );
    } finally {
      setDeletingId(null); // Restablece el estado de eliminación
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl font-sans text-gray-800">
      <div className="flex justify-end items-center mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex content-end items-center gap-2">
            <label htmlFor="roleFilter" className="font-semibold text-gray-600">
              Filtrar por Rol:
            </label>
            <select
              id="roleFilter"
              value={filterRole}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 ease-in-out min-w-[150px]"
            >
              <option value="all">Todos</option>
              <option value="administrador">Administrador</option>
              <option value="docente">Docente</option>
              <option value="estudiante">Estudiante</option>
              <option value="apoderado">Apoderado</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-500 py-8">
          Cargando usuarios...
        </p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center font-medium mb-6">
          <p>Error: {error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <p className="text-center text-lg text-gray-500 py-8">
          No se encontraron usuarios que coincidan con el filtro.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nombre Completo
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rol
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Edad
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <span
                      className={`
                        ${
                          user.role_name.toLowerCase() === "docente"
                            ? "text-blue-600"
                            : ""
                        }
                        ${
                          user.role_name.toLowerCase() === "administrador"
                            ? "text-gray-600"
                            : ""
                        }
                        ${
                          user.role_name.toLowerCase() === "estudiante"
                            ? "text-green-600"
                            : ""
                        }
                        ${
                          user.role_name.toLowerCase() === "apoderado"
                            ? "text-orange-600"
                            : ""
                        }
                      `}
                    >
                      {user.role_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.age_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(user.id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className={`px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
                          deletingId === user.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={deletingId === user.id}
                      >
                        {deletingId === user.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
