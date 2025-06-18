"use client";

import { useRouter, useSearchParams } from "next/navigation";
import EnrollmentBuilder from "@/modules/enrollments/components/enrollments-builder";

const EnrollmentCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enrollmentId = searchParams.get("enrollmentId");

  const handleSubmit = () => {
    router.push("/enrollments");
  };

  return (
    <div>
      <EnrollmentBuilder
        enrollmentId={enrollmentId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default EnrollmentCreate;
