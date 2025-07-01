import PeriodSectionBuilder from "@/modules/periods-sections/components/periods-sections-builder";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const PeriodSectionCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodSectionId = searchParams.get("periodSectionId");

  const handleSubmit = () => {
    router.push("/periodsSections");
  };
  return (
    <PeriodSectionBuilder
      periodSectionId={periodSectionId ?? undefined}
      afterSubmit={handleSubmit}
    />
  );
};

export default PeriodSectionCreate;
