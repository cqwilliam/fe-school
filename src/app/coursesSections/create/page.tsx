"use client";

import { useRouter, useSearchParams } from "next/navigation";
import CourseSectionBuilder from "@/modules/courses-sections/components/course-sections-builder";

const CourseSectionCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseSectionId = searchParams.get("courseSectionId");

  const handleSubmit = () => {
      router.push("/coursesSections");
  };

  return <CourseSectionBuilder courseSectionId={courseSectionId ?? undefined} afterSubmit={handleSubmit} />;
};

export default CourseSectionCreate;
