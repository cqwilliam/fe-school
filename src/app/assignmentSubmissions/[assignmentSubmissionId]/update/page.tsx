"use client";

import AssignmentSubmissionBuilder from "@/modules/assignment-submissions/components/assignment-submissions-builder";
import { useParams, useRouter } from "next/navigation";

const AssignmentSubmissionUpdate = () => {
  const { assignmentSubmissionId } = useParams();
  const router = useRouter();
  const handleSubmit = () => {
    router.push("/assignmentSubmissions");
  };

  return (
    <div>
      <AssignmentSubmissionBuilder
        assignmentSubmissionId={assignmentSubmissionId as string}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default AssignmentSubmissionUpdate;
