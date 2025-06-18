'use client';

import AnnouncementBuilder from "@/modules/announcements/components/announcements-builder";
import { useParams, useRouter } from "next/navigation";


const AnnouncementUpdate = () => {
    const { announcementId } = useParams();
    const router = useRouter();
    
    const handleSubmit = () => {
        router.push('/announcements');
    }

  return (
    <div>
     <AnnouncementBuilder announcementId={announcementId as string} afterSubmit={handleSubmit}/> 
    </div>
  )
}

export default AnnouncementUpdate
