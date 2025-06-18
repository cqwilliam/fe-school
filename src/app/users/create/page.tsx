"use client";

import UserBuilder from "@/modules/user/components/user-builder";
import { useRouter, useSearchParams } from "next/navigation";

const UserCreate = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const handleSubmit = () => {
      router.push("/users");
    }

  return <UserBuilder userId={userId ?? undefined} afterSubmit={handleSubmit} />;
};

export default UserCreate;
