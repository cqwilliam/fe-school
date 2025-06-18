"use client";

import AssignmentBuilder from "@/modules/assignments/components/assignments-builder";
import { useParams, useRouter } from "next/navigation";

const AssignmentUpdate = () => {
  const { assignmentId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/assignments");
  };

  return (
    <div>
      <AssignmentBuilder
        assignmentId={assignmentId as string}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default AssignmentUpdate;
