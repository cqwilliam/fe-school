import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface AttendanceData {
  class_session_id: number;
  student_id: number;
  status: "present" | "absent" | "late" | "justified";
  recorded_time?: string;
  justification?: string;
  recorded_by: number;
}

interface AttendanceBuilderProps {
  attendanceId?: string;
  afterSubmit?: () => void;
}

export default function AttendanceBuilder({
  attendanceId,
  afterSubmit,
}: AttendanceBuilderProps) {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    class_session_id: 0,
    student_id: 0,
    status: "present",
    recorded_time: "",
    justification: "",
    recorded_by: 0,
  });

  const onSubmit = async (attendanceData: AttendanceData) => {
    try {
      if (attendanceId) {
        await api.put(`/attendances/${attendanceId}`, attendanceData);
        alert("Asistencia actualizada exitosamente");
      } else {
        await api.post("/attendances", attendanceData);
        alert("Asistencia registrada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (attendanceId) {
      const fetchAttendance = async () => {
        const response = await api.get(`/attendances/${attendanceId}`);
        setAttendanceData(response.data.data);
      };
      fetchAttendance();
    }
  }, [attendanceId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;

    if (name === "recorded_time") {
      value = value + ":00";
    }

    setAttendanceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(attendanceData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{attendanceId ? "Actualizar Asistencia" : "Registrar Asistencia"}</h1>

      <label>ID de Clase:</label>
      <input
        type="number"
        name="class_session_id"
        value={attendanceData.class_session_id}
        onChange={handleChange}
        required
      />

      <label>ID del Estudiante:</label>
      <input
        type="number"
        name="student_id"
        value={attendanceData.student_id}
        onChange={handleChange}
        required
      />

      <label>Estado:</label>
      <select
        name="status"
        value={attendanceData.status}
        onChange={handleChange}
        required
      >
        <option value="present">Presente</option>
        <option value="absent">Ausente</option>
        <option value="late">Tarde</option>
        <option value="justified">Justificado</option>
      </select>

      <label>Hora Registrada (HH:MM:SS):</label>
      <input
        type="time"
        name="recorded_time"
        value={attendanceData.recorded_time || ""}
        onChange={handleChange}
      />

      <label>Justificación:</label>
      <input
        type="text"
        name="justification"
        value={attendanceData.justification || ""}
        onChange={handleChange}
      />

      <label>Registrado por (ID Usuario):</label>
      <input
        type="number"
        name="recorded_by"
        value={attendanceData.recorded_by}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {attendanceId ? "Actualizar Asistencia" : "Registrar Asistencia"}
      </button>
    </form>
  );
}
