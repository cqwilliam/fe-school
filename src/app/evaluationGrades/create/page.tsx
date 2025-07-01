"use client";

import EvaluationGradeBuilder from "@/modules/evaluation-grades/components/evaluation-grades-builder";
import { useRouter, useSearchParams } from "next/navigation";

const EvaluationGradeCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const evaluationGradeId = searchParams.get("evaluationGradeId");

  const handleSubmit = () => {
    router.push("/evaluationGrades");
  };

  return (
    <EvaluationGradeBuilder
      evaluationGradeId={evaluationGradeId ?? undefined}
      afterSubmit={handleSubmit}
    />
  );
};

export default EvaluationGradeCreate;
