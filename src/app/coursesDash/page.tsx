"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { logout } from "../../lib/auth";

interface User {
  id: number;
  full_name: string;
  role_name: string;
  user_name: string;
  email: string;
}

interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  section_id?: number;
  status?: string;
  academic_period?: {
    name: string;
  };
}

interface Section {
  code: string;
  classroom?: string;
  max_capacity: number;
}

interface Material {
  title: string;
  description?: string;
  type: string;
  url: string;
  published_at?: string;
}

interface Assignment {
  title: string;
  description: string;
  due_date: string;
  max_points: number;
}


const CoursesDash = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndCourses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        console.log("Fetching current user...");
        const userResponse = await api.get<User>("/current-user");
        const currentUser = userResponse.data;
        console.log("Current user:", currentUser);
        setUser(currentUser);

        let coursesData = [];
        
        if (currentUser.role_name === "Estudiante") {
          console.log(`Fetching courses for student ID: ${currentUser.id}`);
          const courseRes = await api.get(`/students/${currentUser.id}/courses`);
          console.log("Student courses response:", courseRes.data);
          
          const apiData = courseRes.data.data || [];
          console.log("Extracted courses data:", apiData);
          coursesData = Array.isArray(apiData) ? apiData : [];
          
        } else if (currentUser.role_name === "Docente") {
          console.log(`Fetching courses for teacher ID: ${currentUser.id}`);
          const courseRes = await api.get(`/teachers/${currentUser.id}/courses`);
          
          console.log("Teacher courses response:", courseRes.data);
          
          const apiData = courseRes.data.data || [];
          console.log("Extracted courses data:", apiData);
          coursesData = Array.isArray(apiData) ? apiData : [];
        }
        
        console.log("Final courses data:", coursesData);
        console.log("Courses length:", coursesData.length);
        setCourses(coursesData);
        
        if (coursesData.length === 0) {
          setError("No se encontraron cursos para este usuario.");
        }
        
      } catch (error) {
        console.error("Error fetching user and courses:", error);
        setError(`Error al cargar los datos: ${error}`);
        logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCourses();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard de Cursos</h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </div>

      {user ? (
        <div className="mb-4 p-4 bg-blue-50 rounded text-black">
          <p>
            Bienvenido, <strong>{user.full_name}</strong> ({user.role_name})
          </p>
          <p className="text-sm text-gray-600">ID: {user.id} | Email: {user.email}</p>
        </div>
      ) : (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <p>Cargando usuario...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-black">
          <p className="text-red-700 font-semibold">Error:</p>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="p-4 bg-gray-50 rounded">
          <p>Cargando cursos...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 font-semibold">No se encontraron cursos.</p>
          <p className="text-sm text-yellow-600 mt-2">
            Verifica la consola del navegador para más detalles sobre la respuesta de la API.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600 mb-4 font-semibold">
            ✅ Se encontraron {courses.length} curso(s)
          </p>
          {courses.map((course) => (
            <div 
              key={course.id} 
              onClick={() => setSelectedCourse(course)}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <CourseCard course={course} />
            </div>
          ))}
          
          {selectedCourse && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{selectedCourse.name}</h2>
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <CourseDetails course={selectedCourse} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div className="border p-4 rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
      <p className="text-gray-500 mb-2">
        <strong>Código:</strong> {course.code} | 
        <strong> Créditos:</strong> {course.credits}
      </p>
      <p className="text-xs text-gray-400">
        {course.academic_period?.name || 'Período no especificado'}
      </p>
    </div>
  );
};

const CourseDetails = ({ course }: CourseCardProps) => {
  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const sectionId = course.section_id;
      
      if (!sectionId) {
        console.warn("No section_id found for course:", course);
        return;
      }

      setLoadingDetails(true);
      console.log(`Fetching details for section ID: ${sectionId}`);
      
      try {
        // 1. Primero obtener la sección
        const sectionRes = await api.get(`/course-sections/${sectionId}`);
        console.log("Section response:", sectionRes.data);
        
        const sectionData = sectionRes.data.data || sectionRes.data;
        setSection(sectionData);

        // 2. Si la sección tiene course_id, obtener los detalles del curso
        if (sectionData.course_id) {
          console.log(`Fetching course details for course ID: ${sectionData.course_id}`);
          const courseDetailsRes = await api.get(`/courses/${sectionData.course_id}`);
          console.log("Course details response:", courseDetailsRes.data);
          
          const courseDetailsData = courseDetailsRes.data.data || courseDetailsRes.data;
          setCourseDetails(courseDetailsData);
        }

        // 3. Obtener materiales
        const materialsRes = await api.get(`/course-sections/${sectionId}/materials`);
        console.log("Materials response:", materialsRes.data);
        
        const materialsApiData = materialsRes.data.data || materialsRes.data;
        const materialsData = Array.isArray(materialsApiData) ? materialsApiData : [];
        setMaterials(materialsData);

        // 4. Obtener tareas
        const assignmentsRes = await api.get(`/course-sections/${sectionId}/assignments`);
        console.log("Assignments response:", assignmentsRes.data);
        
        const assignmentsApiData = assignmentsRes.data.data || assignmentsRes.data;
        const assignmentsData = Array.isArray(assignmentsApiData) ? assignmentsApiData : [];
        setAssignments(assignmentsData);
        
      } catch (error) {
        console.error("Error cargando detalles del curso", error);
        setError("Error al cargar los detalles del curso. Por favor intenta recargar la página.");
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [course.section_id]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">
        {courseDetails?.name || "Cargando nombre del curso..."}
      </h2>
      <p className="text-gray-700 mb-1">
        {courseDetails?.description || "Cargando descripción..."}
      </p>
      <p className="text-gray-500 mb-2">
        <strong>Código:</strong> {courseDetails?.code || "N/A"} | 
        <strong> Créditos:</strong> {courseDetails?.credits || "N/A"} | 
        <strong> Estado:</strong> {course.status} | 
        <strong> Período:</strong> {course.academic_period?.name}
      </p>
      <p className="text-xs text-gray-400">
        Enrollment ID: {course.id} | Section ID: {course.section_id}
        {courseDetails && ` | Course ID: ${courseDetails.id}`}
      </p>

      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-black">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {loadingDetails ? (
        <p className="text-sm text-gray-500">Cargando detalles...</p>
      ) : (
        <>
          {section && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <p><strong>Sección:</strong> {section.code}</p>
              {section.classroom && <p><strong>Aula:</strong> {section.classroom}</p>}
              <p><strong>Capacidad:</strong> {section.max_capacity}</p>
            </div>
          )}

          {materials.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-blue-800 mb-2">📚 Materiales:</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {materials.map((mat, idx) => (
                  <li key={idx}>
                    <a 
                      href={mat.url} 
                      className="text-blue-600 hover:text-blue-800 underline" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {mat.title}
                    </a>
                    <span className="text-gray-500 ml-2">({mat.type})</span>
                    {mat.description && (
                      <p className="text-gray-600 text-xs mt-1">{mat.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {assignments.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-green-800 mb-2">📝 Tareas:</h3>
              <ul className="list-disc pl-5 text-sm space-y-2">
                {assignments.map((assignment, idx) => (
                  <li key={idx} className="border-l-2 border-green-200 pl-2">
                    <div>
                      <strong className="text-green-700">{assignment.title}</strong>
                      <span className="text-gray-500 ml-2">
                        ({assignment.max_points} puntos)
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs">{assignment.description}</p>
                    <p className="text-red-600 text-xs">
                      <strong>Vence:</strong> {new Date(assignment.due_date).toLocaleDateString('es-ES')}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {materials.length === 0 && assignments.length === 0 && section && (
            <p className="text-gray-500 text-sm mt-4 italic">
              No hay materiales o tareas disponibles para este curso.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesDash;