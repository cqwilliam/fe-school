"use client";

import { useRouter, useSearchParams } from "next/navigation";

import EvaluationTypeBuilder from "@/modules/evaluations-types/components/evaluations-types-builder";

const EvaluationTypeCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const evaluationTypeId = searchParams.get("evaluationTypeId");

  const handleSubmit = () => {
    router.push("/evaluationsTypes");
  };

  return (
    <div>
      <EvaluationTypeBuilder
        evaluationTypeId={evaluationTypeId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default EvaluationTypeCreate;
