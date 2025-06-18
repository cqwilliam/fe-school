"use client";

import { useParams, useRouter } from "next/navigation";
import TeacherBuilder from "@/modules/teacher/components/teacher-builder";

const TeacherUpdate = () => {
  const { teacherId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/profile");
  };

  return (
    <TeacherBuilder
      teacherId={teacherId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default TeacherUpdate;
