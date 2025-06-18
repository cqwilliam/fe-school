"use client";

import { useParams, useRouter } from "next/navigation";
import EnrollmentBuilder from "@/modules/enrollments/components/enrollments-builder";

const EnrollmentUpdate = () => {
  const { enrollmentId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/enrollments");
  };

  return (
    <EnrollmentBuilder
      enrollmentId={enrollmentId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default EnrollmentUpdate;
