import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import { logout } from "../lib/auth";

interface User {
  //id: number;
  full_name: string;
  role_name: string;
  //email: string;
  user_name: string;
  age_name: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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
        logout();
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>
            Bienvenido
            {[user.full_name, user.user_name, user.role_name, user.age_name]}
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
          {user.role_name === "Administrador" &&
            <a href="/crearUsuario">nuevo</a>}
        </div>
      ) : (
        <p>Cargando usuario...</p>
      )}
    </div>
  );
}
