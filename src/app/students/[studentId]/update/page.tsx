"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import StudentBuilder from "@/modules/student/components/student-builder";

const StudentUpdate = () => {
  const { studentId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/profile"); // Ajusta esta ruta si es necesario
  };

  return (
    <StudentBuilder
      studentId={studentId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default StudentUpdate;
