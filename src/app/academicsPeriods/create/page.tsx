"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PeriodBuilder from "@/modules/academic-period/components/academic-periods-builder";

const AcademicPeriodsCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodId = searchParams.get("periodId");

  const handleSubmit = () => {
    router.push("/academicsPeriods"); // o cambia esta ruta según la navegación deseada
  };

  return (
    <PeriodBuilder
      periodId={periodId ?? undefined}
      afterSubmit={handleSubmit}
    />
  );
};

export default AcademicPeriodsCreate;
