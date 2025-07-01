import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface AttendanceData {
  class_session_id: number;
  student_user_id: number;
  teacher_user_id: number;
  status: "present" | "absent" | "late" | "justified";
  justification?: string;
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
    student_user_id: 0,
    teacher_user_id: 0,
    status: "present",
    justification: "",
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
    const { name, value } = e.target;

    setAttendanceData((prevData) => ({
      ...prevData,
      [name]:
        name === "class_session_id" ||
        name === "student_user_id" ||
        name === "teacher_user_id"
          ? parseInt(value)
          : value,
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
        name="student_user_id"
        value={attendanceData.student_user_id}
        onChange={handleChange}
        required
      />

      <label>ID del Profesor:</label>
      <input
        type="number"
        name="teacher_user_id"
        value={attendanceData.teacher_user_id}
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

      <label>Justificación:</label>
      <input
        type="text"
        name="justification"
        value={attendanceData.justification || ""}
        onChange={handleChange}
      />

      <button type="submit">
        {attendanceId ? "Actualizar Asistencia" : "Registrar Asistencia"}
      </button>
    </form>
  );
}
