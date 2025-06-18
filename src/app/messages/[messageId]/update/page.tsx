'use client';

import MessageBuilder from "@/modules/message/components/messages-builder";
import { useParams, useRouter } from "next/navigation";


const MessageUpdate = () => {
    const { messageId } = useParams();
    const router = useRouter();

    const handleSubmit = () => {
        router.push('/messages');
    }
  return (
    <div>
     <MessageBuilder messageId={messageId as string} afterSubmit={handleSubmit} />
    </div>
  )
}

export default MessageUpdate