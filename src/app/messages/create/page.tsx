"use client";

import MessageBuilder from "@/modules/message/components/messages-builder";
import { useRouter, useSearchParams } from "next/navigation";

const MessageCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageId = searchParams.get("messageId");

  const handleSubmit = () => {
    router.push("/home");
  };
  return (
    <div>
      <MessageBuilder
        messageId={messageId as string}
        afterSubmit={handleSubmit}
      />
    </div>
  );
};

export default MessageCreate;
