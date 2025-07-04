"use client";

import StudentGuardianBuilder from "@/modules/student-guardian/components/students-guardians-builder";
import { useRouter, useSearchParams } from "next/navigation";

const StudentGuardiansCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentsGuardiansId = searchParams.get("studentsGuardiansId");

  const handleSubmit = () => {
    router.push("/studentsGuardians");
  };

  return (
    <div>
      <StudentGuardianBuilder
        studentsGuardiansId={studentsGuardiansId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default StudentGuardiansCreate;
