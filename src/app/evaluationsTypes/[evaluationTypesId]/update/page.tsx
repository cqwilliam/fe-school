"use client";

import { useParams, useRouter } from "next/navigation";
import EvaluationTypeBuilder from "@/modules/evaluations-types/components/evaluations-types-builder";

const EvaluationTypeUpdate = () => {
  const { evaluationTypesId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/evaluationsTypes");
  };

  return (
    <EvaluationTypeBuilder
      evaluationTypeId={evaluationTypesId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default EvaluationTypeUpdate;
