"use client";

import AssignmentSubmissionBuilder from "@/modules/assignment-submissions/components/assignment-submissions-builder";
import { useRouter, useSearchParams } from "next/navigation";

const AssignmentSubmissionCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentSubmissionId = searchParams.get("assignmentSubmissionId");

  const handleSubmit = () => {
    router.push("/assignmentSubmissions");
  };
  return (
    <div>
      <AssignmentSubmissionBuilder
        assignmentSubmissionId={assignmentSubmissionId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default AssignmentSubmissionCreate;
