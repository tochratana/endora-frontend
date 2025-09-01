"use client";

import { store } from "@/service/store/store";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";

interface ProvidersProps {
  children: React.ReactNode;
  session?: any;
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </SessionProvider>
  );
}
