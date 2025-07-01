"use client";

import SectionCourseBuilder from "@/modules/sections-courses/components/section-course-builder";
import { useRouter, useSearchParams } from "next/navigation";

const SectionCourseCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionCourseId = searchParams.get("sectionCourseId");

  const handleSubmit = () => {
    router.push("/sectionsCourses");
  };

  return (
    <SectionCourseBuilder
      sectionCourseId={sectionCourseId ?? undefined}
      afterSubmit={handleSubmit}
    />
  );
};

export default SectionCourseCreate;
