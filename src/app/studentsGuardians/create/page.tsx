"use client";

import StudentGuardianBuilder from "@/modules/student-guardian/components/students-guardians-builder";
import { useRouter, useSearchParams } from "next/navigation";

const StudentGuardiansCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const relationId = searchParams.get("relationId");

  const handleSubmit = () => {
    router.push("/studentsGuardians");
  };

  return (
    <div>
      <StudentGuardianBuilder
        studentGuardianId={relationId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default StudentGuardiansCreate;
