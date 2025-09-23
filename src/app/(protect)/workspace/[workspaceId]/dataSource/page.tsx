// // src/app/(protect)/workspace/[workspaceId]/dataSource/page.tsx

// import type { TabType } from "@/types/dataSource";
// import DataSourcesClient from "./clientViewer";

// function isValidTab(v: unknown): v is TabType {
//   return v === "database" || v === "real-data" || v === "logs" || v === "schedule";
// }

// export default function Page({
//   params,
//   searchParams,
// }
// : {
//   params: { workspaceId: string };
//   searchParams?: { tab?: string };
// }

// ) 

// {
//   const initialTab: TabType = isValidTab(searchParams?.tab)
//     ? (searchParams!.tab as TabType)
//     : "database";

//   return (
//     <DataSourcesClient
//       workspaceId={params.workspaceId}   // ✅ FIX: pass the param down
//       initialTab={initialTab}
//     />
//   );
// }

// src/app/(protect)/workspace/[workspaceId]/dataSource/page.tsx
//todo
// import type { TabType } from "@/types/dataSource";
// import DataSourcesClient from "./clientViewer";

// // ✅ No cn needed here

// function isValidTab(v: unknown): v is TabType {
//   // return v === "database" || v === "real-data" || v === "logs" || v === "schedule";
//   return v === "database" || v === "logs" || v === "schedule";
// }

// export default function Page({
//   params,
//   searchParams,
// }: {
//   params: { workspaceId: string };
//   searchParams?: { tab?: string };
// }) {
//   const initialTab: TabType = isValidTab(searchParams?.tab)
//     ? (searchParams!.tab as TabType)
//     : "database";

//   return (
//     <DataSourcesClient
//       workspaceId={params.workspaceId}
//       initialTab={initialTab}
//     />
//   );
// }

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
    <DataSourcesClient
      workspaceId={workspaceId}
      initialTab={initialTab}
    />
  );
}
