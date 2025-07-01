import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface AssignmentSubmissionData {
  assignment_id: number;
  student_user_id: number;
  file_url?: string;
  comment?: string;
  grade?: number;
  feedback?: string;
}

interface AssignmentSubmissionBuilderProps {
  assignmentSubmissionId?: string;
  afterSubmit?: () => void;
}

export default function AssignmentSubmissionBuilder({
  assignmentSubmissionId,
  afterSubmit,
}: AssignmentSubmissionBuilderProps) {
  const [submissionData, setSubmissionData] =
    useState<AssignmentSubmissionData>({
      assignment_id: 0,
      student_user_id: 0,
      file_url: "",
      comment: "",
      grade: undefined,
      feedback: "",
    });

  const onSubmit = async (data: AssignmentSubmissionData) => {
    try {
      if (assignmentSubmissionId) {
        await api.put(
          `/assignment-submissions/${assignmentSubmissionId}`,
          data
        );
        alert("Entrega actualizada exitosamente");
      } else {
        await api.post("/assignment-submissions", data);
        alert("Entrega registrada exitosamente");
      }
      afterSubmit?.();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
      console.error(error);
    }
  };

  useEffect(() => {
    if (assignmentSubmissionId) {
      const fetchSubmission = async () => {
        const response = await api.get(
          `/assignment-submissions/${assignmentSubmissionId}`
        );
        setSubmissionData(response.data.data);
      };
      fetchSubmission();
    }
  }, [assignmentSubmissionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setSubmissionData((prevData) => ({
      ...prevData,
      [name]: name === "grade" ? parseFloat(value) || undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>
        {assignmentSubmissionId
          ? "Actualizar Entrega de Asignación"
          : "Registrar Entrega de Asignación"}
      </h1>

      <label>ID Asignación:</label>
      <input
        type="number"
        name="assignment_id"
        value={submissionData.assignment_id}
        onChange={handleChange}
        required
      />

      <label>ID Usuario Estudiante:</label>
      <input
        type="number"
        name="student_user_id"
        value={submissionData.student_user_id}
        onChange={handleChange}
        required
      />

      <label>URL del Archivo:</label>
      <input
        type="url"
        name="file_url"
        value={submissionData.file_url || ""}
        onChange={handleChange}
      />

      <label>Comentario:</label>
      <textarea
        name="comment"
        value={submissionData.comment || ""}
        onChange={handleChange}
      />

      <label>Calificación (0-100):</label>
      <input
        type="number"
        name="grade"
        step="0.01"
        value={submissionData.grade ?? ""}
        onChange={handleChange}
      />

      <label>Retroalimentación:</label>
      <textarea
        name="feedback"
        value={submissionData.feedback || ""}
        onChange={handleChange}
      />

      <button type="submit">
        {assignmentSubmissionId ? "Actualizar Entrega" : "Registrar Entrega"}
      </button>
    </form>
  );
}
