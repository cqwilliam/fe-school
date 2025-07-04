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
  // Estados principales
  const [user, setUser] = useState<User | null>(null);
  const [studentGuardians, setStudentGuardians] = useState<StudentGuardian[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState("perfil");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const menuItems: MenuItem[] = [
    { id: "perfil", label: "Perfil", icon: "👤" },
    { id: "cursos", label: "Cursos", icon: "📚" },
    { id: "calificaciones", label: "Calificaciones", icon: "📊" },
    { id: "horarios", label: "Horarios", icon: "⏰" },
    { id: "comunicados", label: "Comunicados", icon: "📢" },
    { id: "mensajes", label: "Mensajes", icon: "✉️" }, // ¡Agregado!
  ];

  // Cargar información del usuario
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

  // Cargar relaciones estudiante-apoderado
  useEffect(() => {
    const fetchStudentGuardians = async () => {
      if (!user) return;

      try {
        const response = await api.get("/students-guardians");
        const data: StudentGuardian[] = response.data.data;

        if (user.role_name === "Estudiante") {
          const relations = data.filter(rel => rel.student_user_id === user.id);
          const guardianPromises = relations.map(rel =>
            api.get(`/users/${rel.guardian_user_id}`)
          );
          const guardianResponses = await Promise.all(guardianPromises);

          const updatedRelations = relations.map((rel, index) => ({
            ...rel,
            guardian: guardianResponses[index].data.data || guardianResponses[index].data,
          }));

          setStudentGuardians(updatedRelations);
        } else if (user.role_name === "Apoderado") {
          const relations = data.filter(rel => rel.guardian_user_id === user.id);
          const studentPromises = relations.map(rel =>
            api.get(`/users/${rel.student_user_id}`)
          );
          const studentResponses = await Promise.all(studentPromises);

          const updatedRelations = relations.map((rel, index) => ({
            ...rel,
            student: studentResponses[index].data.data || studentResponses[index].data,
          }));

          setStudentGuardians(updatedRelations);
        }
      } catch (error) {
        console.error("Error al obtener relaciones estudiante-apoderado:", error);
      }
    };

    fetchStudentGuardians();
  }, [user]);

  // Cargar cursos o secciones según el rol
  useEffect(() => {
    const fetchUserSectionsOrCourses = async () => {
      if (!user) return;

      try {
        if (user.role_name === "Estudiante") {
          const response = await api.get(`/students/${user.id}/sections`);
          setSections(response.data.data || response.data);
        } else if (user.role_name === "Docente" || user.role_name === "Profesor") {
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
    // Refrescar datos del usuario si es necesario
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
            <h3 className="text-lg font-semibold text-gray-900">Calificaciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calificationsMock.map((calification, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-900 font-medium">{calification.nombre}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "comunicados":
        return <AnnouncementDash />;
      case "mensajes": // ¡Nuevo case para Mensajes!
        return <MessageDash />;
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
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {user.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.full_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.full_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h2 className="font-bold text-gray-900 text-lg">
                {user.full_name.split(" ")[0]} {user.full_name.split(" ")[1] || ""}
              </h2>
              <p className="text-sm text-gray-500">{user.role_name}</p>
            </div>
          </div>
        </div>

        <MenuItems
          items={menuItems}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="absolute bottom-6 left-6">
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Upgrade
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
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
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.full_name.charAt(0)}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  title="Cerrar sesión"
                >
                  <span className="text-white text-xs">×</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}