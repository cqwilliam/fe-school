"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MenuItems from "../../components/MenuItems";
import { Profile } from "../profile/page";
import CoursesDash from "../coursesDash/page";
import AnnouncementDash from "../announcementDash/page";
import MessageDash from "../cardInfo/page";
import api from "../../lib/api";
import { logout } from "../../lib/auth";
import ScheduleDash from "../schedulesDash/page";
import AttendancesDash from "../attendancesDash/page";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface User {
  id: number;
  full_name: string;
  role_name: string;
  user_name: string;
  email: string;
  dni: string;
  age_name: number;
  photo_url: string;
  phone: string;
  address: string;
}

interface Course {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
}

interface StudentGuardian {
  student_user_id: number;
  guardian_user_id: number;
  relationship: string;
  student?: User;
  guardian?: User;
}

interface Califications {
  user_id: number;
  nombre: string;
}

const calificationsMock: Array<Califications> = [
  { user_id: 1, nombre: "Juan" },
  { user_id: 2, nombre: "Pedro" },
  { user_id: 3, nombre: "Maria" },
  { user_id: 4, nombre: "Jose" },
  { user_id: 5, nombre: "Luis" },
  { user_id: 6, nombre: "Ana" },
  { user_id: 7, nombre: "Carlos" },
  { user_id: 8, nombre: "Laura" },
  { user_id: 9, nombre: "Sofia" },
  { user_id: 10, nombre: "Diego" },
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [studentGuardians, setStudentGuardians] = useState<StudentGuardian[]>(
    []
  );
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState("perfil");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const menuItems: MenuItem[] = [
    { id: "perfil", label: "Perfil", icon: "/Home.png" },
    { id: "cursos", label: "Cursos", icon: "/Graduation.png" },
    { id: "asistencias", label: "Asistencia", icon: "/Calendar.png" },
    { id: "horarios", label: "Horarios", icon: "/Horario.png" },
    { id: "comunicados", label: "Comunicados", icon: "/Form.png" },
    { id: "mensajes", label: "Mensajes", icon: "/Message.png" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get<User>("/current-user");
        setUser(response.data);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        logout();
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchStudentGuardians = async () => {
      if (!user) return;

      try {
        const response = await api.get("/students-guardians");
        const data: StudentGuardian[] = response.data.data;

        if (user.role_name === "Estudiante") {
          const relations = data.filter(
            (rel) => rel.student_user_id === user.id
          );
          const guardianPromises = relations.map((rel) =>
            api.get(`/users/${rel.guardian_user_id}`)
          );
          const guardianResponses = await Promise.all(guardianPromises);

          const updatedRelations = relations.map((rel, index) => ({
            ...rel,
            guardian:
              guardianResponses[index].data.data ||
              guardianResponses[index].data,
          }));

          setStudentGuardians(updatedRelations);
        } else if (user.role_name === "Apoderado") {
          const relations = data.filter(
            (rel) => rel.guardian_user_id === user.id
          );
          const studentPromises = relations.map((rel) =>
            api.get(`/users/${rel.student_user_id}`)
          );
          const studentResponses = await Promise.all(studentPromises);

          const updatedRelations = relations.map((rel, index) => ({
            ...rel,
            student:
              studentResponses[index].data.data || studentResponses[index].data,
          }));

          setStudentGuardians(updatedRelations);
        }
      } catch (error) {
        console.error(
          "Error al obtener relaciones estudiante-apoderado:",
          error
        );
      }
    };

    fetchStudentGuardians();
  }, [user]);

  useEffect(() => {
    const fetchUserSectionsOrCourses = async () => {
      if (!user) return;

      try {
        if (user.role_name === "Estudiante") {
          const response = await api.get(`/students/${user.id}/sections`);
          setSections(response.data.data || response.data);
        } else if (
          user.role_name === "Docente" ||
          user.role_name === "Profesor"
        ) {
          const response = await api.get(`/teachers/${user.id}/courses`);
          setCourses(response.data.data || response.data);
        }
      } catch (error) {
        console.error("Error al obtener secciones/cursos del usuario:", error);
      }
    };

    fetchUserSectionsOrCourses();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handlePasswordChange = () => {
    console.log("Contraseña cambiada exitosamente");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "perfil":
        return (
          <Profile
            user={user!}
            studentGuardians={studentGuardians}
            courses={courses}
            sections={sections}
            onPasswordChange={handlePasswordChange}
          />
        );
      case "cursos":
        return <CoursesDash />;
      case "calificaciones":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Calificaciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calificationsMock.map((calification, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-900 font-medium">
                    {calification.nombre}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "comunicados":
        return <AnnouncementDash />;
      case "mensajes":
        return <MessageDash />;
      case "horarios":
        return <ScheduleDash />;
      case "asistencias":
        return <AttendancesDash />;
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Sección en desarrollo
            </h3>
            <p className="text-gray-600">
              La sección "{activeSection}" estará disponible próximamente.
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando usuario...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Usuario no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white shadow-lg fixed top-0 left-0 h-full ">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                src='/Logo.png'
                className="h-auto w-16 object-contain"
                alt="Logo Pedro Paulet"
              />
            </div>
            <h2 className="font-extrabold text-gray-900 text-3xl font-mono  text-center">
              PEDRO PAULET
              <br />
            </h2>
          </div>
        </div>

        <MenuItems
          items={menuItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Botón de Logout ahora en lugar de Upgrade */}
        <div className="absolute bottom-6 left-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            title="Cerrar sesión"
          >
            {/* Ícono de cerrar sesión (ejemplo con SVG, puedes usar un ícono de librería si tienes) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
              />
            </svg>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div
          className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 fixed top-0 right-0 z-30"
          style={{ marginLeft: "16rem", width: "calc(100% - 16rem)" }}
        >
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              {activeSection}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Bienvenido {user.full_name.split(" ")[0]}
              </span>
              <div className="relative">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt={user.full_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Círculo rojo en la esquina superior derecha de la imagen de perfil */}
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  title="Estado del usuario"
                >
                  <span className="text-white text-xs font-bold">●</span> {/* Punto rojo */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 mt-20 ml-64">{renderContent()}</div>
      </div>
    </div>
  );
}