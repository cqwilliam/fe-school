import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface AssignmentData {
  section_id: number;
  title: string;
  description?: string;
  published_at?: string;
  due_date: string;
  published_by: number;
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
    section_id: 0,
    title: "",
    description: "",
    published_at: "",
    due_date: "",
    published_by: 0,
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

      <label>ID de la Sección:</label>
      <input
        type="number"
        name="section_id"
        value={assignmentData.section_id}
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

      <label>Fecha de Publicación:</label>
      <input
        type="datetime-local"
        name="published_at"
        value={assignmentData.published_at || ""}
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

      <label>ID del Publicador (Usuario):</label>
      <input
        type="number"
        name="published_by"
        value={assignmentData.published_by}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {assignmentId ? "Actualizar Asignación" : "Registrar Asignación"}
      </button>
    </form>
  );
}
