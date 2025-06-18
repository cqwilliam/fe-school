"use client";

import CourseSectionBuilder from "@/modules/courses-sections/components/course-sections-builder";
import { useParams, useRouter } from "next/navigation";

const CourseSectionUpdate = () => {
  const { courseSectionId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/coursesSections");
  };

  return (
    <CourseSectionBuilder
      courseSectionId={courseSectionId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default CourseSectionUpdate;
