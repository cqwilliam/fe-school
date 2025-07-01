import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface AssignmentData {
  teacher_user_id: number;
  period_section_id: number;
  title: string;
  description?: string;
  due_date: string;
}

interface AssignmentBuilderProps {
  assignmentId?: string;
  afterSubmit?: () => void;
}

export default function AssignmentBuilder({
  assignmentId,
  afterSubmit,
}: AssignmentBuilderProps) {
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    teacher_user_id: 0,
    period_section_id: 0,
    title: "",
    description: "",
    due_date: "",
  });

  const onSubmit = async (data: AssignmentData) => {
    try {
      if (assignmentId) {
        await api.put(`/assignments/${assignmentId}`, data);
        alert("Asignación actualizada exitosamente");
      } else {
        await api.post("/assignments", data);
        alert("Asignación registrada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      const fetchAssignment = async () => {
        const response = await api.get(`/assignments/${assignmentId}`);
        setAssignmentData(response.data.data);
      };
      fetchAssignment();
    }
  }, [assignmentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setAssignmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(assignmentData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{assignmentId ? "Actualizar Asignación" : "Registrar Asignación"}</h1>

      <label>ID del Profesor:</label>
      <input
        type="number"
        name="teacher_user_id"
        value={assignmentData.teacher_user_id}
        onChange={handleChange}
        required
      />

      <label>ID de la Sección del Período:</label>
      <input
        type="number"
        name="period_section_id"
        value={assignmentData.period_section_id}
        onChange={handleChange}
        required
      />

      <label>Título:</label>
      <input
        type="text"
        name="title"
        value={assignmentData.title}
        onChange={handleChange}
        maxLength={100}
        required
      />

      <label>Descripción:</label>
      <textarea
        name="description"
        value={assignmentData.description || ""}
        onChange={handleChange}
      />

      <label>Fecha de Entrega:</label>
      <input
        type="datetime-local"
        name="due_date"
        value={assignmentData.due_date}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {assignmentId ? "Actualizar Asignación" : "Registrar Asignación"}
      </button>
    </form>
  );
}
