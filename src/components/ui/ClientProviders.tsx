"use client";

import { SessionProvider } from "next-auth/react";
import ProviderStore from "@/service/store/ProviderStore";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <ProviderStore>{children}</ProviderStore>
    </SessionProvider>
  );
}
