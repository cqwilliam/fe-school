"use client";

import AssignmentBuilder from "@/modules/assignments/components/assignments-builder";
import { useRouter, useSearchParams } from "next/navigation";

const AssignmentCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("assignmentId");

  const handleSubmit = () => {
    router.push("/assignments");
  };
  return (
    <div>
      <AssignmentBuilder
        assignmentId={assignmentId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default AssignmentCreate;
