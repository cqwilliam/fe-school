"use client";

import PeriodSectionBuilder from "@/modules/periods-sections/components/periods-sections-builder";
import { useParams, useRouter } from "next/navigation";

const PeriodSectionUpdate = () => {
  const { periodSectionId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/periodsSections");
  };

  return (
    <PeriodSectionBuilder
      periodSectionId={periodSectionId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default PeriodSectionUpdate;
