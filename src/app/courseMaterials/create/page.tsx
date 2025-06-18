"use client";

import CourseMaterialsBuilder from "@/modules/course-materials/components/course-materials-builder";
import { useRouter, useSearchParams } from "next/navigation";

const CourseMaterialsCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseMaterialId = searchParams.get("courseMaterialId");

  const handleSubmit = () => {
    router.push("/courseMaterials");
  };

  return (
    <div>
      <CourseMaterialsBuilder
        courseMaterialId={courseMaterialId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default CourseMaterialsCreate;
