"use client";

import CourseBuilder from "@/modules/course/components/course-builder";
import { useRouter, useSearchParams } from "next/navigation";

const CourseCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const handleSubmit = () => {
    router.push("/courses");
  };

  return (
    <CourseBuilder
      courseId={courseId ?? undefined}
      afterSubmit={handleSubmit}
    />
  );
};

export default CourseCreate;
