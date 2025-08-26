"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // Redirect authenticated users away from auth pages
    if (session && pathname.startsWith("/auth")) {
      router.replace("/dashboard");
      return;
    }

    // Redirect unauthenticated users away from protected pages
    if (!session && pathname.startsWith("/dashboard")) {
      router.replace("/auth/signin");
      return;
    }
  }, [session, status, router, pathname]);

  return { session, status };
}
