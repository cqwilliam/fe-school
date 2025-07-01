"use client";

import { useParams, useRouter } from "next/navigation";
import AttendanceBuilder from "@/modules/attendances/components/attendances-builder";

const AttendanceUpdate = () => {
  const { attendanceId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/attendances");
  };

  return (
    <AttendanceBuilder
      attendanceId={attendanceId as string}
      afterSubmit={handleSubmit}
    />
  );
};

export default AttendanceUpdate;
