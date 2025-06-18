"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ClassSessionBuilder, {
  ClassSessionData,
} from "@/modules/class-sessions/components/class-sessions-builder"; // asegúrate de que esta ruta sea correcta

const ClassSessionCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classSessionId = searchParams.get("classSessionId");

  const handleSubmit = () => {
    router.push("/classSessions"); // ajusta según el flujo de tu app
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
