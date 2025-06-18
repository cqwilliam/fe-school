import { useEffect, useState } from "react";
import api from "../../../lib/api";

export interface AssignmentSubmissionData {
  assignment_id: number;
  student_id: number;
  file_url?: string;
  comment?: string;
  submitted_at?: string;
  grade?: number;
  feedback?: string;
  graded_by?: number;
}

interface AssignmentSubmissionBuilderProps {
  assignmentSubmissionId?: string;
  afterSubmit?: () => void;
}

export default function AssignmentSubmissionBuilder({
  assignmentSubmissionId,
  afterSubmit,
}: AssignmentSubmissionBuilderProps) {
  const [submissionData, setSubmissionData] = useState<AssignmentSubmissionData>({
    assignment_id: 0,
    student_id: 0,
    file_url: "",
    comment: "",
    submitted_at: "",
    grade: undefined,
    feedback: "",
    graded_by: undefined,
  });

  const onSubmit = async (data: AssignmentSubmissionData) => {
    try {
      if (assignmentSubmissionId) {
        await api.put(`/assignment-submissions/${assignmentSubmissionId}`, data);
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
        const response = await api.get(`/assignment-submissions/${assignmentSubmissionId}`);
        setSubmissionData(response.data.data);
      };
      fetchSubmission();
    }
  }, [assignmentSubmissionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { name, value } = e.target;

    if (name === "submitted_at" && value.length === 16) {
      value = value + ":00";
    }

    setSubmissionData((prevData) => ({
      ...prevData,
      [name]: value,
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

      <label>ID Estudiante:</label>
      <input
        type="number"
        name="student_id"
        value={submissionData.student_id}
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

      <label>Fecha de Entrega:</label>
      <input
        type="datetime-local"
        name="submitted_at"
        value={submissionData.submitted_at || ""}
        onChange={handleChange}
      />

      <label>Calificación:</label>
      <input
        type="number"
        //step="0.01"
        name="grade"
        value={submissionData.grade ?? ""}
        onChange={handleChange}
      />

      <label>Retroalimentación:</label>
      <textarea
        name="feedback"
        value={submissionData.feedback || ""}
        onChange={handleChange}
      />

      <label>Calificado por (ID Usuario):</label>
      <input
        type="number"
        name="graded_by"
        value={submissionData.graded_by ?? ""}
        onChange={handleChange}
      />

      <button type="submit">
        {assignmentSubmissionId ? "Actualizar Entrega" : "Registrar Entrega"}
      </button>
    </form>
  );
}
