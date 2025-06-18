"use client";

import { useRouter, useSearchParams } from "next/navigation";
import EvaluationBuilder from "@/modules/evaluations/components/evaluations-build";

const EvaluationCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const evaluationId = searchParams.get("evaluationId");

  const handleSubmit = () => {
    router.push("/evaluations"); // Ajusta la ruta según tu estructura
  };

  return (
    <div>
      <EvaluationBuilder
        evaluationId={evaluationId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default EvaluationCreate;
