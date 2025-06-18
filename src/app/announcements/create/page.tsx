"use client";

import AnnouncementBuilder from "@/modules/announcements/components/announcements-builder";
import { useRouter, useSearchParams } from "next/navigation";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const announcementId = searchParams.get("announcementId");

  const handleSubmit = () => {
    router.push("/announcements");
  };
  return (
    <div>
      <AnnouncementBuilder
        announcementId={announcementId ?? undefined}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default page;
 