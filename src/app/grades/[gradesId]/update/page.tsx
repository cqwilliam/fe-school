"use client";

import { useParams, useRouter } from "next/navigation";
import GradeBuilder from "@/modules/grades/components/grades-build";

const GradeCreate = () => {
  const { gradesId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/grades");
  };

  return (
    <div>
      <GradeBuilder gradesId={gradesId as string} afterSubmit={handleSubmit} />
    </div>
  );
};

export default GradeCreate;
