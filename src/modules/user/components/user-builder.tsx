"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface UserData {
  first_name: string;
  last_name: string;
  user_name?: string;
  email: string;
  password?: string;
  dni: string;
  birth_date?: string;
  photo_url?: string;
  phone?: string;
  address?: string;
  role_id: number;
}

interface UserBuilderProps {
  userId?: string;
  afterSubmit?: () => void;
}

export default function UserBuilder({ userId, afterSubmit }: UserBuilderProps) {
  const [userData, setUserData] = useState<UserData>({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    password: "",
    dni: "",
    birth_date: "",
    photo_url: "",
    phone: "",
    address: "",
    role_id: 1,
  });

  const onSubmit = async (userData: UserData) => {
    try {
      if (userId) {
        await api.put(`/users/${userId}`, userData);
        alert("Usuario actualizado exitosamente");
      } else {
        await api.post("/users", userData);
        alert("Usuario creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        const response = await api.get(`/users/${userId}`);
        setUserData(response.data.data);
      };
      fetchUser();
    }
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(userData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1>{userId ? "Actualizar Usuario" : "Crear Usuario"}</h1>

      <label>Nombre:</label>
      <input
        type="text"
        name="first_name"
        value={userData.first_name}
        onChange={handleChange}
        required
      />

      <label>Apellido:</label>
      <input
        type="text"
        name="last_name"
        value={userData.last_name}
        onChange={handleChange}
        required
      />

      <label>Nombre de Usuario:</label>
      <input
        type="text"
        name="user_name"
        value={userData.user_name || ""}
        onChange={handleChange}
      />

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        required
      />

      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={userData.password || ""}
        onChange={handleChange}
      />

      <label>DNI:</label>
      <input
        type="text"
        name="dni"
        value={userData.dni}
        onChange={handleChange}
        required
      />

      <label>Fecha de Nacimiento:</label>
      <input
        type="date"
        name="birth_date"
        value={userData.birth_date || ""}
        onChange={handleChange}
      />

      <label>URL de Foto:</label>
      <input
        type="url"
        name="photo_url"
        value={userData.photo_url || ""}
        onChange={handleChange}
      />

      <label>Teléfono:</label>
      <input
        type="text"
        name="phone"
        value={userData.phone || ""}
        onChange={handleChange}
      />

      <label>Dirección:</label>
      <input
        type="text"
        name="address"
        value={userData.address || ""}
        onChange={handleChange}
      />

      <label>Rol:</label>
      <select name="role_id" value={userData.role_id} onChange={handleChange}>
        <option value={1}>Administrador</option>
        <option value={2}>Docente</option>
        <option value={3}>Estudiante</option>
        <option value={4}>Apoderado</option>
      </select>

      <button type="submit">
        {userId ? "Actualizar Usuario" : "Crear Usuario"}
      </button>
    </form>
  );
}
