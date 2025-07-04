"use client";

import StudentBuilder from "@/modules/student-guardian/components/students-guardians-builder";
import { useParams, useRouter } from "next/navigation";

const studentGuardianUpdate = () => {
  const { studentsGuardiansId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/studentsGuardians");
  };

  return (
    <StudentBuilder
      studentsGuardiansId={studentsGuardiansId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default studentGuardianUpdate;
