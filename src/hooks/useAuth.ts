"use client";

import { useGetCurrentUserQuery } from "@/app/store/api/authApi";
import { useSession } from "next-auth/react";
// import { useGetCurrentUserQuery } from "@/store/api/authApi";

export function useAuth() {
  const { data: session, status } = useSession();
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery(
    undefined,
    { skip: !session }
  );

  return {
    user: user || session?.user,
    session,
    isLoading: status === "loading" || isUserLoading,
    isAuthenticated: !!session,
  };
}
