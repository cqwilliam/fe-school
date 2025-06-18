"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  age_name: number;
  email: string;
  dni: string;
  photo_url: string;
  phone: string;
  address: string;
  last_sign_in: string;
}

const User = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<{ success: boolean; data: User }>(`/users/${userId}`);
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setError("No se pudo obtener el usuario.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar el usuario.");
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!user) {
    return <div style={{ padding: 24 }}>Cargando usuario...</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Detalles del Usuario</h1>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Nombre:</strong> {user.first_name} </p>
      <p><strong>Apellido:</strong> {user.last_name} </p>
      <p><strong>Edad:</strong> {user.age_name}</p>
      <p><strong>Nombre de Usuario:</strong> {user.user_name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>DNI:</strong> {user.dni}</p>
      <p><strong>Foto:</strong> {user.photo_url}</p>
      <p><strong>Celular:</strong> {user.phone}</p>
      <p><strong>Direccion:</strong> {user.address}</p>

    </div>
  );
};

export default User;
