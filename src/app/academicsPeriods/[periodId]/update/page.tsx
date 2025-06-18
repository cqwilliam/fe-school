"use client";

import PeriodBuilder from "@/modules/academic-period/components/academic-periods-builder";
import { useParams, useRouter } from "next/navigation";

const AcademicPeriodUpdate = () => {
  const { periodId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/academicsPeriods"); // o cambia esta ruta según la navegación deseada
  };

  return (
    <PeriodBuilder periodId={periodId as string} afterSubmit={handleSubmit} />
  );
};

export default AcademicPeriodUpdate;
