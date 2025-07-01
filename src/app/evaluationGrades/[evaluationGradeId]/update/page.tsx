"use client";

import EvaluationGradeBuilder from "@/modules/evaluation-grades/components/evaluation-grades-builder";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const EvaluationGradeUpdate = () => {
  const { evaluationGradeId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/evaluationGrades");
  };

  return (
    <EvaluationGradeBuilder
      evaluationGradeId={evaluationGradeId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default EvaluationGradeUpdate;
