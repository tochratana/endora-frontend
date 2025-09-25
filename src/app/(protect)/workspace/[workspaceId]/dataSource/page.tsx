import type { TabType } from "@/types/dataSource";
import DataSourcesClient from "./clientViewer";

function isValidTab(v: unknown): v is TabType {
  return v === "database" || v === "logs" || v === "schedule";
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { workspaceId } = await params;
  const { tab } = (await searchParams) || {};

  const initialTab: TabType = isValidTab(tab) ? (tab as TabType) : "database";

  return (
    <DataSourcesClient workspaceId={workspaceId} initialTab={initialTab} />
  );
}
