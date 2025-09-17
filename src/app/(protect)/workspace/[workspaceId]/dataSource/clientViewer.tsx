// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Database, FileText, Clock } from "lucide-react";
// import {
//   useGetSchemaRowsQuery,
//   useInsertSchemaRowMutation,
// } from "@/service/apiSlide/dataSourceApi";

// import { DataSourceHeader } from "@/components/data-sources/data-source-header";
// import { StatsCard } from "@/components/data-sources/stats-card";
// import { TabNavigation } from "@/components/data-sources/tab-navigation";
// import { DataTable } from "@/components/data-sources/data-table/data-table";
// import { EmptyState } from "@/components/data-sources/empty-state";
// import { SchemaDataViewer } from "@/components/data-sources/schema-data-viewer";
// import { ActivityLogs } from "@/components/data-sources/activity-logs";
// import { ScheduleReset } from "@/components/data-sources/schedule-reset";

// import type {
//   TabItem,
//   TabType,
//   LogItem,
//   LogAction,
//   SampleProduct,
// } from "@/types/dataSource";
// import type { DataSourceRecord } from "@/service/apiSlide/dataSourceApi";

// // helper: stable numeric id from uuid/string
// function hashToInt(input: unknown): number {
//   const s = String(input ?? "");
//   let h = 0;
//   for (let i = 0; i < s.length; i++) {
//     h = (h << 5) - h + s.charCodeAt(i);
//     h |= 0;
//   }
//   return Math.abs(h) + 1;
// }

// // API → UI mapper
// const mapRecordToProduct = (record: DataSourceRecord): SampleProduct => ({
//   id: typeof record.id === "number" ? record.id : hashToInt(record.id),
//   name: String((record as any).name ?? "Unknown"),
//   price: Number((record as any).price ?? 0),
//   created_date: String((record as any).created_at ?? ""),
// });

// type Props = {
//   workspaceId: string;
//   initialTab: TabType;
// };

// const CURRENT_USER = "You";
// const LS_KEYS = { activeTab: "ds_activeTab" } as const;

// function isValidTab(v: unknown): v is TabType {
//   return (
//     v === "database" || v === "real-data" || v === "logs" || v === "schedule"
//   );
// }

// export default function DataSourcesClient({ workspaceId, initialTab }: Props) {
//   const [activeTab, setActiveTab] = useState<TabType>(initialTab);
//   const [logs, setLogs] = useState<LogItem[]>([]);

//   const schemaName = "products"; // TODO: dynamic later
//   const userUuid = "user-123"; // TODO: pull from session

//   // Fetch rows from API
//   const { data, isLoading, isError, refetch } = useGetSchemaRowsQuery({
//     schemaName,
//     projectUuid: workspaceId,
//     userUuid,
//     page: 1,
//     limit: 10,
//     sort: "-created_at",
//   });

//   const [insertRow] = useInsertSchemaRowMutation();

//   // Extract rows safely
//   const rows: DataSourceRecord[] = data?.data ?? [];

//   // tabs persisted in LS
//   useEffect(() => {
//     const saved = localStorage.getItem(LS_KEYS.activeTab);
//     if (isValidTab(saved) && saved !== activeTab) setActiveTab(saved);
//   }, []);
//   useEffect(() => {
//     const url = new URL(window.location.href);
//     if (url.searchParams.get("tab") !== activeTab) {
//       url.searchParams.set("tab", activeTab);
//       window.history.replaceState(null, "", url.toString());
//     }
//     localStorage.setItem(LS_KEYS.activeTab, activeTab);
//   }, [activeTab]);

//   // Convert API rows → products
//   const mappedProducts: SampleProduct[] = useMemo(
//     () => (Array.isArray(rows) ? rows.map(mapRecordToProduct) : []),
//     [rows]
//   );

//   // compute stats
//   const { totalFields, totalRecords, lastUpdate } = useMemo(() => {
//     const totalRecords = mappedProducts.length;
//     const totalFields =
//       totalRecords > 0 ? Object.keys(mappedProducts[0]).length : 0;
//     let lastUpdate = "—";
//     if (totalRecords > 0) {
//       const maxTs = Math.max(
//         ...mappedProducts.map(p => new Date(p.created_date).getTime())
//       );
//       lastUpdate = new Date(maxTs).toLocaleDateString(undefined, {
//         year: "numeric",
//         month: "short",
//         day: "2-digit",
//       });
//     }
//     return { totalFields, totalRecords, lastUpdate };
//   }, [mappedProducts]);

//   const addLog = (action: LogAction, title: string, description: string) => {
//     setLogs(prev => [
//       {
//         id: crypto.randomUUID(),
//         title,
//         description,
//         user: CURRENT_USER,
//         action,
//         timestamp: new Date().toISOString(),
//       },
//       ...prev,
//     ]);
//   };

//   // Insert sample row
//   const handleAddSample = async () => {
//     try {
//       const payload = {
//         name: "Shoes",
//         price: 11.25,
//         created_at: new Date().toISOString(),
//       };
//       await insertRow({
//         schemaName,
//         projectUuid: workspaceId,
//         userUuid,
//         data: payload,
//       }).unwrap();
//       addLog("IMPORT", "Product added", `Inserted ${payload.name}`);
//       await refetch();
//     } catch (err) {
//       console.error("Insert failed:", err);
//     }
//   };

//   const tabs: TabItem[] = [
//     {
//       id: "database",
//       label: "Database",
//       icon: <Database className="w-4 h-4" />,
//     },
//     {
//       id: "real-data",
//       label: "Schema Data",
//       icon: <Database className="w-4 h-4" />,
//     },
//     { id: "logs", label: "Logs", icon: <FileText className="w-4 h-4" /> },
//     { id: "schedule", label: "Schedule", icon: <Clock className="w-4 h-4" /> },
//   ];

//   return (
//     <div className="min-h-screen text-white p-6">
//       <div className="max-w-6xl mx-auto space-y-8">
//         <div className="flex justify-between items-center">
//           <DataSourceHeader />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <StatsCard
//             icon={<Database className="w-6 h-6 text-teal-400" />}
//             value={String(totalFields)}
//             label="Total Fields"
//           />
//           <StatsCard
//             icon={<FileText className="w-6 h-6 text-teal-400" />}
//             value={String(totalRecords)}
//             label="Total Records"
//           />
//           <StatsCard
//             icon={<Clock className="w-6 h-6 text-teal-400" />}
//             value={lastUpdate}
//             label="Last Update"
//           />
//         </div>

//         <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
//           <TabNavigation
//             tabs={tabs}
//             activeTab={activeTab}
//             onTabChange={setActiveTab}
//           />
//           <div className="p-8">
//             {activeTab === "database" &&
//               (isLoading ? (
//                 <p className="text-slate-400">Loading...</p>
//               ) : isError ? (
//                 <p className="text-red-400">Failed to load data</p>
//               ) : mappedProducts.length > 0 ? (
//                 // <DataTable
//                 //   products={mappedProducts}
//                 //   workspaceId={workspaceId}
//                 //   onProductsChange={() => {}}
//                 //   onLog={(action, title, description) =>
//                 //     addLog(action, title, description)
//                 //   }
//                 // />
//                 <DataTable
//                   rows={rows}
//                   schema={activeSchema}
//                   workspaceId={workspaceId}
//                   onLog={addLog}
//                 />
//               ) : (
//                 <EmptyState onAddSample={handleAddSample} />
//               ))}

//             {activeTab === "real-data" && (
//               <SchemaDataViewer
//                 rows={rows}
//                 projectUuid={workspaceId}
//                 userUuid={userUuid}
//               />
//             )}

//             {activeTab === "logs" &&
//               (logs.length ? (
//                 <ActivityLogs logs={logs} />
//               ) : (
//                 <div className="text-center py-12">
//                   <p className="text-slate-400">
//                     Activity logs will appear here
//                   </p>
//                 </div>
//               ))}

//             {activeTab === "schedule" && (
//               <ScheduleReset
//                 rowCount={mappedProducts.length}
//                 lastUpdated={lastUpdate}
//                 dataSourceName={schemaName}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Database, FileText, Clock } from "lucide-react";
// import {
//   useGetSchemaRowsQuery,
//   useInsertSchemaRowMutation,
// } from "@/service/apiSlide/dataSourceApi";
// import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi"; // 👈 added

// import { DataSourceHeader } from "@/components/data-sources/data-source-header";
// import { StatsCard } from "@/components/data-sources/stats-card";
// import { TabNavigation } from "@/components/data-sources/tab-navigation";
// import { DataTable } from "@/components/data-sources/data-table/data-table";
// import { EmptyState } from "@/components/data-sources/empty-state";
// import { SchemaDataViewer } from "@/components/data-sources/schema-data-viewer";
// import { ActivityLogs } from "@/components/data-sources/activity-logs";
// import { ScheduleReset } from "@/components/data-sources/schedule-reset";

// import type { TabItem, TabType, LogItem, LogAction } from "@/types/dataSource";
// import type { DataSourceRecord } from "@/service/apiSlide/dataSourceApi";

//todo 5
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { Database, FileText, Clock } from "lucide-react";
// import {
//   useGetSchemaRowsQuery,
//   useInsertSchemaRowMutation,
// } from "@/service/apiSlide/dataSourceApi";
// import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";

// import { DataSourceHeader } from "@/components/data-sources/data-source-header";
// import { StatsCard } from "@/components/data-sources/stats-card";
// import { TabNavigation } from "@/components/data-sources/tab-navigation";
// import { DataTable } from "@/components/data-sources/data-table/data-table";
// import { EmptyState } from "@/components/data-sources/empty-state";
// import { SchemaDataViewer } from "@/components/data-sources/schema-data-viewer";
// import { ActivityLogs } from "@/components/data-sources/activity-logs";
// import { ScheduleReset } from "@/components/data-sources/schedule-reset";

// // ✅ No cn needed here
// import type { TabItem, TabType, LogItem, LogAction } from "@/types/dataSource";
// import type { DataSourceRecord } from "@/service/apiSlide/dataSourceApi";

// type Props = {
//   workspaceId: string;
//   initialTab: TabType;
// };

// export default function DataSourcesClient({ workspaceId, initialTab }: Props) {
//   const [activeTab, setActiveTab] = useState<TabType>(initialTab);
//   const [logs, setLogs] = useState<LogItem[]>([]);

//   const schemaName = "products"; // TODO: dynamic later
//   const userUuid = "user-123"; // TODO: pull from session

//   // ✅ fetch schemas
//   const { data: schemas } = useGetSchemasQuery(workspaceId);
//   const activeSchema = schemas?.find(s => s.schemaName === schemaName);

//   // ✅ fetch rows
//   const { data, isLoading, isError, refetch } = useGetSchemaRowsQuery({
//     schemaName,
//     projectUuid: workspaceId,
//     userUuid,
//     page: 1,
//     limit: 10,
//     sort: "-created_at",
//   });
//   const rows: DataSourceRecord[] = data?.data ?? [];

//   const [insertRow] = useInsertSchemaRowMutation();

//   const addLog = (action: LogAction, title: string, description: string) => {
//     setLogs(prev => [
//       {
//         id: crypto.randomUUID(),
//         title,
//         description,
//         user: "You",
//         action,
//         timestamp: new Date().toISOString(),
//       },
//       ...prev,
//     ]);
//   };

//   const handleAddSample = async () => {
//     try {
//       const payload = {
//         name: "Shoes",
//         price: 11.25,
//         created_at: new Date().toISOString(),
//       };
//       await insertRow({
//         schemaName,
//         projectUuid: workspaceId,
//         userUuid,
//         data: payload,
//       }).unwrap();
//       addLog("IMPORT", "Product added", `Inserted ${payload.name}`);
//       await refetch();
//     } catch (err) {
//       console.error("Insert failed:", err);
//     }
//   };

//   const tabs: TabItem[] = [
//     {
//       id: "database",
//       label: "Database",
//       icon: <Database className="w-4 h-4" />,
//     },
//     {
//       id: "real-data",
//       label: "Schema Data",
//       icon: <Database className="w-4 h-4" />,
//     },
//     { id: "logs", label: "Logs", icon: <FileText className="w-4 h-4" /> },
//     { id: "schedule", label: "Schedule", icon: <Clock className="w-4 h-4" /> },
//   ];

//   return (
//     <div className="min-h-screen text-white p-6">
//       <div className="max-w-6xl mx-auto space-y-8">
//         <DataSourceHeader />

//         <div className="bg-white dark:bg-slate-900 rounded-lg border-1 border-gray-200 dark:border-slate-800">
//           <TabNavigation
//             tabs={tabs}
//             activeTab={activeTab}
//             onTabChange={setActiveTab}
//           />

//           <div className="p-8 bg-white dark:bg-slate-900 ">
//             {activeTab === "database" &&
//               (isLoading ? (
//                 <p className="text-slate-400">Loading...</p>
//               ) : isError ? (
//                 <p className="text-red-400">Failed to load data</p>
//               ) : rows.length > 0 && activeSchema ? (
//                 <DataTable
//                   projectUuid={workspaceId} // 👈 this becomes projectUuid
//                   schema={undefined} // (we’ll wire later)
//                   onLog={addLog}
//                   onAddRow={row => console.log("add", row)}
//                   onDeleteRow={id => console.log("delete", id)}
//                 />
//               ) : (
//                 <EmptyState onAddSample={handleAddSample} />
//               ))}

//             {activeTab === "real-data" && activeSchema && (
//               <SchemaDataViewer
//                 rows={rows}
//                 projectUuid={workspaceId}
//                 userUuid={userUuid}
//               />
//             )}

//             {activeTab === "logs" &&
//               (logs.length ? (
//                 <ActivityLogs logs={logs} />
//               ) : (
//                 <p className="text-slate-400 text-center py-12">
//                   Activity logs will appear here
//                 </p>
//               ))}

//             {activeTab === "schedule" && (
//               <ScheduleReset
//                 rowCount={rows.length}
//                 lastUpdated={"—"}
//                 dataSourceName={schemaName}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import { Database, FileText, Clock } from "lucide-react";
import {
  useGetSchemaRowsQuery,
  useInsertSchemaRowMutation,
} from "@/service/apiSlide/dataSourceApi";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";

import { DataSourceHeader } from "@/components/data-sources/data-source-header";
import { StatsCard } from "@/components/data-sources/stats-card";
import { TabNavigation } from "@/components/data-sources/tab-navigation";
import { DataTable } from "@/components/data-sources/data-table/data-table";
import { EmptyState } from "@/components/data-sources/empty-state";
import { SchemaDataViewer } from "@/components/data-sources/schema-data-viewer";
import { ActivityLogs } from "@/components/data-sources/activity-logs";
import { ScheduleReset } from "@/components/data-sources/schedule-reset";

import type { TabItem, TabType, LogItem, LogAction } from "@/types/dataSource";
import type { DataSourceRecord } from "@/service/apiSlide/dataSourceApi";
import type { Schema } from "@/service/apiSlide/schemaApi";

type Props = {
  workspaceId: string;
  initialTab: TabType;
};

export default function DataSourcesClient({ workspaceId, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [logs, setLogs] = useState<LogItem[]>([]);

  const schemaName = "products"; // TODO: make dynamic later
  const userUuid = "user-123"; // TODO: pull from session

  // ✅ fetch schemas
  const { data: schemas } = useGetSchemasQuery(workspaceId);
  const activeSchema: Schema | undefined = schemas?.find(
    (s) => s.schemaName === schemaName
  );

  // ✅ fetch rows from API
  const { data, isLoading, isError, refetch } = useGetSchemaRowsQuery({
    schemaName,
    projectUuid: workspaceId,
    userUuid,
    page: 1,
    limit: 10,
    sort: "-created_at",
  });

  const apiRows: DataSourceRecord[] = data?.data ?? [];

  // ✅ mock rows state
  const [mockRows, setMockRows] = useState<DataSourceRecord[]>([]);

  // ✅ merged rows
  const rows: DataSourceRecord[] = [...apiRows, ...mockRows];

  const [insertRow] = useInsertSchemaRowMutation();

  const addLog = (action: LogAction, title: string, description: string) => {
    setLogs((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        description,
        user: "You",
        action,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // ✅ Add row handler (mock mode for now)
  const handleAddRow = (row: Record<string, any>) => {
    const newRow: DataSourceRecord = {
      ...row,
      id: row.id ?? crypto.randomUUID(),
      created_at: row.created_at ?? new Date().toISOString(),
      schema_name: schemaName,
      project_uuid: workspaceId,
    };
    setMockRows((prev) => [...prev, newRow]);
    addLog("CREATE", "Row Added", `Inserted new row into ${schemaName}`);
  };

  // ✅ Delete row handler (mock + API rows)
  const handleDeleteRow = (id: string | number) => {
    setMockRows((prev) => prev.filter((r) => r.id !== id));
    addLog("DELETE", "Row Deleted", `Removed row ${id}`);
  };

  const handleAddSample = async () => {
    try {
      const payload = {
        name: "Shoes",
        price: 11.25,
        created_at: new Date().toISOString(),
      };
      await insertRow({
        schemaName,
        projectUuid: workspaceId,
        userUuid,
        data: payload,
      }).unwrap();
      addLog("IMPORT", "Product added", `Inserted ${payload.name}`);
      await refetch();
    } catch (err) {
      console.error("Insert failed:", err);
    }
  };

  const tabs: TabItem[] = [
    { id: "database", label: "Database", icon: <Database className="w-4 h-4" /> },
    { id: "real-data", label: "Schema Data", icon: <Database className="w-4 h-4" /> },
    { id: "logs", label: "Logs", icon: <FileText className="w-4 h-4" /> },
    { id: "schedule", label: "Schedule", icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <DataSourceHeader />

        <div className="bg-white dark:bg-slate-900 rounded-lg border-1 border-gray-200 dark:border-slate-800">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-8 bg-white dark:bg-slate-900">
            {activeTab === "database" &&
              (isLoading ? (
                <p className="text-slate-400">Loading...</p>
              ) : isError ? (
                <p className="text-red-400">Failed to load data</p>
              ) : rows.length > 0 && activeSchema ? (
                <DataTable
                  projectUuid={workspaceId}
                  schema={activeSchema}
                  onLog={addLog}
                  onAddRow={handleAddRow}   // ✅ add rows locally
                  onDeleteRow={handleDeleteRow} // ✅ delete rows locally
                />
              ) : (
                <EmptyState onAddSample={handleAddSample} />
              ))}

            {activeTab === "real-data" && activeSchema && (
              <SchemaDataViewer
                rows={rows}
                projectUuid={workspaceId}
                userUuid={userUuid}
              />
            )}

            {activeTab === "logs" &&
              (logs.length ? (
                <ActivityLogs logs={logs} />
              ) : (
                <p className="text-slate-400 text-center py-12">
                  Activity logs will appear here
                </p>
              ))}

            {activeTab === "schedule" && (
              <ScheduleReset
                rowCount={rows.length}
                lastUpdated={"—"}
                dataSourceName={schemaName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
