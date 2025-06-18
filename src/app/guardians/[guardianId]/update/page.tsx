"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import GuardianBuilder from "@/modules/guardian/components/guardian-builder";

const GuardianUpdate = () => {
  const { guardianId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/guardians"); // o la ruta que uses para listar/ver
  };

  return (
    <GuardianBuilder
      guardianId={guardianId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default GuardianUpdate;
