"use client";

import CourseMaterialsBuilder from "@/modules/course-materials/components/course-materials-builder";
import { useParams, useRouter } from "next/navigation";

const CourseMaterialUpdate = () => {
  const { courseMaterialId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/courseMaterials");
  };

  return (
    <div>
      <CourseMaterialsBuilder
        courseMaterialId={courseMaterialId as string}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default CourseMaterialUpdate;
