"use client";

import PeriodsSectionsUserBuilder from "@/modules/periods-sections-users/components/periods-sections-users-builder";
import { useParams, useRouter } from "next/navigation";

const PeriodSectionUserUpdate = () => {
  const { periodSectionUserId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/periodsSectionsUsers");
  };

  return (
    <PeriodsSectionsUserBuilder
      periodSectionUserId={periodSectionUserId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default PeriodSectionUserUpdate;
