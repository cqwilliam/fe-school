"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AttendanceBuilder from "@/modules/attendances/components/attendances-builder";

const AttendanceCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attendanceId = searchParams.get("attendanceId");

  const handleAfterSubmit = () => {
    router.push("/atttendances");
  };

  return (
    <div>
      <AttendanceBuilder
        attendanceId={attendanceId ?? undefined}
        afterSubmit={handleAfterSubmit}
      />
    </div>
  );
};

export default AttendanceCreate;
