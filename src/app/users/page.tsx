"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  age_name:number;
  user_name:string;
  email: string;
  dni: string;
  photo_url: string;
  phone: string;
  address: string;
  role_name:string;
}

const Users = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");

        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          setError("No se pudo obtener la lista de usuarios.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar usuarios.");
      }
    };

    fetchUsers();
  }, []);

  const handleShow = (id: number) => router.push(`/users/${id}`);
  const handleUpdate = (id: number) => router.push(`/users/${id}/update`);
  const handleCreate = () => router.push("/users/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Usuarios</h1>

      {error ? (
        <p style={{ color: "red" }}>Error al cargar usuarios: {error}</p>
      ) : users.length === 0 ? (
        <p>Cargando usuarios...</p>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fafafa",
              color : "#000000",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px", color: "#000000" }}>
              {user.id} {user.first_name} {user.last_name} {user.age_name} {user.role_name}
            </strong>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                
                onClick={() => handleShow(user.id)}
              >
                Ver
              </button>
              <button
                
                onClick={() => handleUpdate(user.id)}
              >
                Actualizar
              </button>
            </div>
          </div>
        ))
      )}

      <button
        style={{
          marginTop: "32px",
          width: "100%",
          padding: "14px 0",
          backgroundColor: "#9333ea",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "18px",
          transition: "background-color 0.3s ease",
        }}
        onClick={handleCreate}
      >
        Crear Nuevo Usuario
      </button>
    </div>
  );
};

export default Users;
