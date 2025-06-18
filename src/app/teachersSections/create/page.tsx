"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TeacherSectionBuilder from "@/modules/teacher-sections/components/teacher-sections-builder";

const TeacherSectionCreate = () => {
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/teacherSections");
  };

  return <TeacherSectionBuilder afterSubmit={handleSubmit} />;
};

export default TeacherSectionCreate;
