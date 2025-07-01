"use client";

import PeriodsSectionsUserBuilder from "@/modules/periods-sections-users/components/periods-sections-users-builder";
import { useRouter, useSearchParams } from "next/navigation";

const PeriodSectionUserCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodSectionUserId = searchParams.get("periodSectionUserId");

  const handleSubmit = () => {
    router.push("/periodsSectionsUsers");
  };

  return (
    <PeriodsSectionsUserBuilder
      periodSectionUserId={periodSectionUserId ?? undefined}
      afterSubmit={handleSubmit}
    />
  );
};

export default PeriodSectionUserCreate;
