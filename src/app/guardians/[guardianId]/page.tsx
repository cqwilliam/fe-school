"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Guardian {
  id: number;
  user_id: number;
}

const Guardian = () => {
  const { guardianId } = useParams();
  const [guardian, setGuardian] = useState<Guardian | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuardian = async () => {
      try {
        const response = await api.get<{ success: boolean; data: Guardian }>(
          `/guardians/${guardianId}`
        );
        if (response.data.success) {
          setGuardian(response.data.data);
        } else {
          setError("No se pudo obtener el apoderado.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error al cargar el apoderado."
        );
      }
    };

    if (guardianId) {
      fetchGuardian();
    }
  }, [guardianId]);

  if (error) {
    return <div style={{ padding: 24, color: "red" }}>Error: {error}</div>;
  }

  if (!guardian) {
    return <div style={{ padding: 24 }}>Cargando apoderado...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Apoderado</h1>
      <p>ID: {guardian.id}</p>
      <p>Usuario ID: {guardian.user_id}</p>
    </div>
  );
};

export default Guardian;
