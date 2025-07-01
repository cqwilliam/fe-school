"use client";

import SectionCourseBuilder from "@/modules/sections-courses/components/section-course-builder";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const SectionCourseUpdate = () => {
  const { sectionCourseId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/sectionsCourses");
  };

  return (
    <SectionCourseBuilder
      sectionCourseId={sectionCourseId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default SectionCourseUpdate;
