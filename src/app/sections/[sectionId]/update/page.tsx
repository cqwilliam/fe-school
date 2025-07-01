"use client";

import SectionBuilder from "@/modules/section/component/section-builder";
import { useParams, useRouter } from "next/navigation";

const SectionUpdate = () => {
  const { sectionId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/sections");
  };
  return (
    <SectionBuilder
      sectionId={sectionId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default SectionUpdate;
