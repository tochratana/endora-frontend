// src/app/(protect)/workspace/[workspaceId]/dataSource/page.tsx

import type { TabType } from "@/types/dataSource";
import DataSourcesClient from "./clientViewer";

function isValidTab(v: unknown): v is TabType {
  return v === "database" || v === "real-data" || v === "logs" || v === "schedule";
}

export default function Page({
  params,
  searchParams,
}: {
  params: { workspaceId: string };
  searchParams?: { tab?: string };
}) {
  const initialTab: TabType = isValidTab(searchParams?.tab)
    ? (searchParams!.tab as TabType)
    : "database";

  return (
    <DataSourcesClient
      workspaceId={params.workspaceId}   // ✅ FIX: pass the param down
      initialTab={initialTab}
    />
  );
}
