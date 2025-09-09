"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import NotificationBar from "../NotificationBar";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  const hideShell =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/protected") ||
    pathname.startsWith("/auth");

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <>
      <NotificationBar />
      <Header />
      {children}
      <Footer />
    </>
  );
}
