"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import UserBuilder from "@/modules/user/components/user-builder";

const UserUpdate = () => {
  const { userId } = useParams();
  const router = useRouter();

  const handleSubmit = () => {
      router.push("/profile");
  };

  return <UserBuilder userId={userId as string} afterSubmit={handleSubmit} />;
};

export default UserUpdate;
