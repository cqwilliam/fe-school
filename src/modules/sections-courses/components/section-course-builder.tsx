"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface SectionCourseData {
  course_id: number;
  section_id: number;
}

interface Course {
  id: number;
  name: string; // Suponiendo que hay un nombre para el curso
}

interface Section {
  id: number;
  name: string; // Suponiendo que hay un nombre para la sección
}

interface SectionCourseBuilderProps {
  sectionCourseId?: string;
  afterSubmit?: () => void;
}

export default function SectionCourseBuilder({
  sectionCourseId,
  afterSubmit,
}: SectionCourseBuilderProps) {
  const [sectionCourseData, setSectionCourseData] = useState<SectionCourseData>({
    course_id: 0,
    section_id: 0,
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const onSubmit = async (data: SectionCourseData) => {
    try {
      if (sectionCourseId) {
        await api.put(`/sections-courses/${sectionCourseId}`, data);
        alert("Relación Sección-Curso actualizada exitosamente");
      } else {
        await api.post("/sections-courses", data);
        alert("Relación Sección-Curso creada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchCoursesAndSections = async () => {
      try {
        const coursesResponse = await api.get("/courses");
        const sectionsResponse = await api.get("/sections");
        setCourses(coursesResponse.data.data);
        setSections(sectionsResponse.data.data);
      } catch (error) {
        console.error("Error fetching courses or sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndSections();

    if (sectionCourseId) {
      const fetchSectionCourse = async () => {
        const response = await api.get(`/sections-courses/${sectionCourseId}`);
        setSectionCourseData(response.data.data);
      };
      fetchSectionCourse();
    }
  }, [sectionCourseId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSectionCourseData((prevData) => ({
      ...prevData,
      [name]: Number(value), // Asegurarse que sean números
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(sectionCourseData);
  };

  if (loading) {
    return <div>Cargando cursos y secciones...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1>
        {sectionCourseId ? "Actualizar Sección-Curso" : "Crear Sección-Curso"}
      </h1>

      <label>Seleccione Curso:</label>
      <select
        name="course_id"
        value={sectionCourseData.course_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione un curso</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name} (ID: {course.id})
          </option>
        ))}
      </select>

      <label>Seleccione Sección:</label>
      <select
        name="section_id"
        value={sectionCourseData.section_id}
        onChange={handleChange}
        required
      >
        <option value="">Seleccione una sección</option>
        {sections.map((section) => (
          <option key={section.id} value={section.id}>
            {section.name} (ID: {section.id})
          </option>
        ))}
      </select>

      <button type="submit">{sectionCourseId ? "Actualizar" : "Crear"}</button>
    </form>
  );
}
