"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import ClassSessionBuilder from "@/modules/class-sessions/components/class-sessions-builder";

const ClassSessionUpdate = () => {
  const { classSessionId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/class-sessions"); 
  };

  return (
    <ClassSessionBuilder
      classSessionId={classSessionId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default ClassSessionUpdate;
