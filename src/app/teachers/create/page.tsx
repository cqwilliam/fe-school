"use client";

import TeacherBuilder from "@/modules/teacher/components/teacher-builder";
import { useRouter, useSearchParams } from "next/navigation";

const TeacherCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teacherId = searchParams.get("teacherId");

  const handleSubmit = () => {
    router.push("/profile");
  };
  return (
    <div>
      <TeacherBuilder
        teacherId={teacherId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default TeacherCreate;
