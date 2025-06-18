"use client";

import { useParams, useRouter } from "next/navigation";

import ScheduleBuilder from "@/modules/schedules/components/schedules-builder";

const ScheduleUpdate = () => {
  const { scheduleId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
    router.push("/schedules");
  };

  return (
    <div style={{ padding: 24 }}>
      <ScheduleBuilder
        scheduleId={scheduleId as string}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default ScheduleUpdate;
