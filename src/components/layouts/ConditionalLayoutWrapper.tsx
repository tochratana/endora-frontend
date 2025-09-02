"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function ConditionalLayoutWrapper({ children }: Props) {
  const pathname = usePathname();

  // Hide global header/footer when inside the dashboard or workspace area
  const hideShell =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/workspace") ||
    pathname?.startsWith("/protected");

  return <>{children}</>;
}
