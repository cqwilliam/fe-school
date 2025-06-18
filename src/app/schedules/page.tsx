"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

interface Schedule {
  id: number;
  section_id: number;
  day_of_week: string;
  start_date: string;
  end_date: string;
  is_recurring: boolean;
  specific_date?: string | null;
}

const Schedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get("/schedules");
        if (response.data.success) {
          setSchedules(response.data.data);
        } else {
          setError("No se pudo obtener la lista de horarios.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Error al cargar horarios.");
      }
    };

    fetchSchedules();
  }, []);

  const handleShow = (id: number) => router.push(`/schedules/${id}`);
  const handleUpdate = (id: number) => router.push(`/schedules/${id}/update`);
  const handleCreate = () => router.push("/schedules/create");

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>
        Horarios de Secciones
      </h1>

      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : schedules.length === 0 ? (
        <p>Cargando horarios...</p>
      ) : (
        schedules.map((schedule) => (
          <div
            key={schedule.id}
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              backgroundColor: "#fafafa",
              color: "#000000",
            }}
          >
            <strong style={{ fontSize: "18px", marginBottom: "8px" }}>
              ID: {schedule.id}
            </strong>
            <p>Sección ID: {schedule.section_id}</p>
            <p>Día: {schedule.day_of_week}</p>
            <p>
              Hora: {schedule.start_date} - {schedule.end_date}
            </p>
            <p>¿Recurrente?: {schedule.is_recurring ? "Sí" : "No"}</p>
            {schedule.specific_date && (
              <p>Fecha específica: {schedule.specific_date}</p>
            )}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button
                onClick={() => handleShow(schedule.id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Ver
              </button>
              <button
                onClick={() => handleUpdate(schedule.id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#f59e0b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Actualizar
              </button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={handleCreate}
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
      >
        Crear Nuevo Horario
      </button>
    </div>
  );
};

export default Schedules;
