"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
}

const Courses = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/courses");

        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          setError("No se pudo obtener la lista de cursos.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar cursos.");
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShow = (id: number) => router.push(`/courses/${id}`);
  const handleUpdate = (id: number) => router.push(`/courses/${id}/update`);

  // --- Nueva función para manejar la eliminación ---
  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este curso?")) {
      try {
        const response = await api.delete(`/courses/${id}`);
        if (response.data.success) {
          // Si la eliminación fue exitosa, actualiza el estado de los cursos
          setCourses(courses.filter((course) => course.id !== id));
        } else {
          setError(
            response.data.message || "No se pudo eliminar el curso."
          );
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al eliminar el curso.");
      }
    }
  };
  // --- Fin de la nueva función ---

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl font-sans">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
        Listado de Cursos
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar cursos por nombre..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error ? (
        <p className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 text-center shadow-sm">
          Error al cargar cursos: {error}
        </p>
      ) : filteredCourses.length === 0 && courses.length > 0 ? (
        <p className="text-gray-600 text-lg text-center">
          No se encontraron cursos con ese nombre.
        </p>
      ) : courses.length === 0 ? (
        <p className="text-gray-600 text-lg text-center">Cargando cursos...</p>
      ) : (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700 text-sm uppercase tracking-wider">
            <div className="col-span-2">Nombre del Curso</div>
            <div className="hidden md:block">Código</div>
            <div className="text-right">Acciones</div>
          </div>

          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`grid grid-cols-1 md:grid-cols-4 gap-4 items-center px-6 py-4 
                border-b border-gray-200 last:border-b-0 hover:bg-gray-100 transition-colors duration-200`}
            >
              <div className="col-span-2">
                <p className="text-lg font-semibold text-gray-800">
                  {course.name}
                </p>
                {course.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {course.description}
                  </p>
                )}
              </div>
              <div className="text-gray-700 text-base hidden md:block">
                {course.code}
              </div>
              <div className="flex justify-end space-x-3 mt-3 md:mt-0">
                <button
                  onClick={() => handleUpdate(course.id)}
                  className="px-4 py-2 bg-yellow-500 text-gray-900 text-sm rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-colors duration-200 font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors duration-200 font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;