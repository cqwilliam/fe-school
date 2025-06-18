"use client";

import GradeBuilder from "@/modules/grades/components/grades-build";
import { useRouter, useSearchParams } from "next/navigation";

const GradeCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gradesId = searchParams.get("gradesId"); // opcional, por si quieres precargar algo

  const handleSubmit = () => {
    router.push("/grades");
  };

  return (
    <GradeBuilder gradesId={gradesId as string} afterSubmit={handleSubmit} />
  );
};

export default GradeCreate;
