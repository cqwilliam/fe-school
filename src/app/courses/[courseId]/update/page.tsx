"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import CourseBuilder from "@/modules/course/components/course-builder";

const CourseUpdate = () => {
  const { courseId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/courses");
  };

  return (
    <CourseBuilder courseId={courseId as string} afterSubmit={handleSubmit} />
  );
};

export default CourseUpdate;
