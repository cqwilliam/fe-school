"use client";

import SectionBuilder from "@/modules/section/component/section-builder";
import { useRouter, useSearchParams } from "next/navigation";

const SectionCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("sectionId");

  const handleSubmit = () => {
    router.push("/sections");
  };

  return (
    <SectionBuilder
      sectionId={sectionId ?? undefined}
      afterSubmit={handleSubmit}
    />
  );
};

export default SectionCreate;
