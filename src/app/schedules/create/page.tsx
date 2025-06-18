"use client";

import { useRouter, useSearchParams } from "next/navigation";

import ScheduleBuilder from "@/modules/schedules/components/schedules-builder";

const ScheduleCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");

  const handleSubmit = () => {
    router.push("/schedules");
  };

  return (
    <div style={{ padding: 24 }}>
      <ScheduleBuilder
        scheduleId={scheduleId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default ScheduleCreate;
