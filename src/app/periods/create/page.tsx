"use client";

import PeriodBuilder from "@/modules/period/components/period-builder";
import { useRouter, useSearchParams } from "next/navigation";

const PeriodCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodId = searchParams.get("periodId");

  const handleSubmit = () => {
    router.push("/periods");
  };

  return (
    <div>
      <PeriodBuilder
        periodId={periodId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default PeriodCreate;
