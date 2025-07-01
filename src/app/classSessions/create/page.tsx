"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ClassSessionBuilder from "@/modules/class-sessions/components/class-sessions-builder";

const ClassSessionCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classSessionId = searchParams.get("classSessionId");

  const handleSubmit = () => {
    router.push("/classSessions");
  };

  return (
    <div>
      <ClassSessionBuilder
        classSessionId={classSessionId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default ClassSessionCreate;
