"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import TeacherSectionBuilder from "@/modules/teacher-sections/components/teacher-sections-builder";

const TeacherSectionUpdate = () => {
  const { teacherSectionId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/teachersSections");
  };

  return (
    <TeacherSectionBuilder
      teacherSectionId={teacherSectionId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default TeacherSectionUpdate;
