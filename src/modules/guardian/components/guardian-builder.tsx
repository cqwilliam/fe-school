"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface GuardianData {
  user_id: number;
}

interface GuardianBuilderProps {
  guardianId?: string;
  afterSubmit?: () => void;
}

export default function GuardianBuilder({
  guardianId,
  afterSubmit,
}: GuardianBuilderProps) {
  const [guardianData, setGuardianData] = useState<GuardianData>({
    user_id: 0,
  });

  const onSubmit = async (guardianData: GuardianData) => {
    try {
      if (guardianId) {
        await api.put(`/guardians/${guardianId}`, guardianData);
        alert("Apoderado actualizado exitosamente");
      } else {
        await api.post("/guardians", guardianData);
        alert("Apoderado creado exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (guardianId) {
      const fetchGuardian = async () => {
        const response = await api.get(`/guardians/${guardianId}`);
        setGuardianData(response.data.data);
      };
      fetchGuardian();
    }
  }, [guardianId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setGuardianData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(guardianData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{guardianId ? "Actualizar Apoderado" : "Crear Apoderado"}</h1>

      <label>ID de Usuario:</label>
      <input
        type="number"
        name="user_id"
        value={guardianData.user_id}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {guardianId ? "Actualizar Apoderado" : "Crear Apoderado"}
      </button>
    </form>
  );
}
