"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api"; // Asegúrate de que esta ruta sea correcta

export interface CourseData {
  id?: number;
  code: string;
  name: string;
  description?: string;
}

interface CourseBuilderProps {
  courseId?: string;
  afterSubmit?: () => void;
}

export default function CourseBuilder({
  courseId,
  afterSubmit,
}: CourseBuilderProps) {
  const [courseData, setCourseData] = useState<CourseData>({
    code: "",
    name: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: CourseData) => {
    setError(null);
    setSuccessMessage(null);
    try {
      if (courseId) {
        await api.put(`/courses/${courseId}`, data);
        setSuccessMessage("Curso actualizado exitosamente");
      } else {
        await api.post("/courses", data);
        setSuccessMessage("Curso creado exitosamente");
        // Opcional: limpiar el formulario después de crear un curso
        setCourseData({
          code: "",
          name: "",
          description: "",
        });
      }
      afterSubmit?.();
    } catch (err: any) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
      console.error(err);
    }
  };

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const response = await api.get(`/courses/${courseId}`);
          setCourseData(response.data.data);
        } catch (err) {
          console.error("Error fetching course:", err);
          setError("Error al cargar el curso. Intenta de nuevo más tarde.");
        } finally {
          setLoading(false);
        }
      };
      fetchCourse();
    } else {
      setLoading(false); // Si no hay courseId, no necesitamos cargar un curso existente
    }
  }, [courseId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(courseData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando curso...</p>
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
              {courseId ? "Actualizar Curso" : "Crear Nuevo Curso"}
            </h1>
            <p className="text-slate-600">
              {courseId
                ? "Modifica los detalles del curso existente."
                : "Completa los campos para crear un nuevo curso."}
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
            <div className="grid grid-cols-1 gap-6"> {/* Ajustado a una sola columna para los campos del curso */}
              <div className="space-y-2">
                <label
                  htmlFor="code"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Código del Curso:
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={courseData.code}
                  onChange={handleChange}
                  maxLength={20}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. CS101"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Nombre del Curso:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={courseData.name}
                  onChange={handleChange}
                  maxLength={100}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Ej. Introducción a la Programación"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Descripción:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={courseData.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-slate-300"
                  placeholder="Una breve descripción del curso..."
                />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {courseId ? "Actualizar Curso" : "Crear Curso"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}