"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api"; // Asegúrate de que 'api' esté configurado correctamente

// --- Interfaces ---
interface StudentGuardian {
  id: number;
  student_user_id: number;
  guardian_user_id: number;
  relationship: string | null;
  student_full_name?: string;
  guardian_full_name?: string;
}

const StudentsGuardians = () => {
  const router = useRouter();
  const [relations, setRelations] = useState<StudentGuardian[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null); // Para manejar el estado de eliminación

  const fetchRelations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/students-guardians");

      if (response.data.success) {
        setRelations(response.data.data);
      } else {
        setError(
          response.data.message || "No se pudo obtener la lista de relaciones."
        );
      }
    } catch (err: any) {
      console.error("Error al obtener relaciones:", err);
      setError(
        err.response?.data?.message ||
          "Error al cargar relaciones. Intente de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelations();
  }, []);

  const handleShow = (id: number) => router.push(`/studentsGuardians/${id}`);
  const handleUpdate = (id: number) =>
    router.push(`/studentsGuardians/${id}/update`);
  const handleCreate = () => router.push("/studentsGuardians/create");

  // --- Nueva función para eliminar relación ---
  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar esta relación de estudiante-apoderado?"
      )
    ) {
      return; // Si el usuario cancela, no hacemos nada
    }

    setDeletingId(id); // Indica que estamos intentando eliminar este ID
    try {
      const response = await api.delete(`/students-guardians/${id}`);

      if (response.data.success) {
        // Si la eliminación fue exitosa, actualiza la lista de relaciones
        setRelations(relations.filter((relation) => relation.id !== id));
        alert("Relación eliminada correctamente.");
      } else {
        setError(
          response.data.message || "No se pudo eliminar la relación."
        );
      }
    } catch (err: any) {
      console.error("Error al eliminar relación:", err);
      setError(
        err.response?.data?.message ||
          "Error al eliminar la relación. Intente de nuevo más tarde."
      );
    } finally {
      setDeletingId(null); // Restablece el estado de eliminación
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl font-sans text-gray-800">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
          Relaciones Estudiante - Apoderado
        </h1>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Crear Nueva Relación
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Cargando relaciones...</p>
          </div>
        </div>
      ) : error ? (
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
      ) : relations.length === 0 ? (
        <p className="text-center text-lg text-gray-500 py-8">
          No se encontraron relaciones estudiante-apoderado.
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
                  ID Estudiante
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID Apoderado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Relación
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
              {relations.map((relation) => (
                <tr
                  key={relation.id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {relation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {relation.student_user_id}
                    {/* Si tu API retorna el nombre completo, podrías mostrarlo aquí: */}
                    {/* {relation.student_full_name && ` (${relation.student_full_name})`} */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {relation.guardian_user_id}
                    {/* Si tu API retorna el nombre completo, podrías mostrarlo aquí: */}
                    {/* {relation.guardian_full_name && ` (${relation.guardian_full_name})`} */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {relation.relationship || "No especificada"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShow(relation.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleUpdate(relation.id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(relation.id)}
                        className={`px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
                          deletingId === relation.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={deletingId === relation.id}
                      >
                        {deletingId === relation.id ? "Eliminando..." : "Eliminar"}
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

export default StudentsGuardians;