"use client";

import { useParams, useRouter } from "next/navigation";
import EvaluationBuilder from "@/modules/evaluations/components/evaluations-build";

const EvaluationUpdate = () => {
  const { evaluationsId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/evaluations");
  };

  return (
    <EvaluationBuilder
      evaluationId={evaluationsId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default EvaluationUpdate;
