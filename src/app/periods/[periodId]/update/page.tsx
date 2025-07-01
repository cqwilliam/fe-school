"use client";

import PeriodBuilder from "@/modules/period/components/period-builder";
import { useParams, useRouter } from "next/navigation";
const periodUpdate = () => {
  const { periodId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/periods");
  };

  return (
    <PeriodBuilder periodId={periodId as string} afterSubmit={handleSubmit} />
  );
};

export default periodUpdate;
