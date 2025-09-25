"use client";

import { useMemo, useState } from "react";
import { Database, FileText, Clock } from "lucide-react";
import {
  useGetSchemaRowsQuery,
  useInsertSchemaRowMutation,
  useGetProjectStatsQuery,
} from "@/service/apiSlide/dataSourceApi";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
import { DataSourceHeader } from "@/components/data-sources/data-source-header";
import { StatsCard } from "@/components/data-sources/stats-card";
import { TabNavigation } from "@/components/data-sources/tab-navigation";
import { DataTable } from "@/components/data-sources/data-table/data-table";
import { EmptyState } from "@/components/data-sources/empty-state";
// import { SchemaDataViewer } from "@/components/data-sources/schema-data-viewer";
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
  const [activeSchemaName] = useState<string>("products");
  // const [activeSchemaName, setActiveSchemaName] = useState<string>("products");

  const userUuid = "user-123"; //pull from session

  // 1. Fetch ALL schemas to get the total count
  const { data: schemas } = useGetSchemasQuery(workspaceId);

  // 2. Fetch project-wide stats to get total records and last update
  const { data: projectStats, isLoading: statsLoading } =
    useGetProjectStatsQuery(workspaceId);

  // 3. Fetch rows for the CURRENT active schema only
  const { data, isLoading, isError, refetch } = useGetSchemaRowsQuery({
    schemaName: activeSchemaName, //Using activeSchemaName
    projectUuid: workspaceId,
    userUuid,
    page: 1,
    limit: 10,
    sort: "created_at",
  });

  const apiRows: DataSourceRecord[] = data?.data ?? [];
  const activeSchema: Schema | undefined = schemas?.find(
    s => s.schemaName === activeSchemaName
  );

  const [insertRow] = useInsertSchemaRowMutation();

  // compute stats from API data
  const { totalSchemas, totalRecords, lastUpdate } = useMemo(() => {
    // Get total schemas directly from the schemas API call
    const totalSchemas = schemas?.length ?? 0;

    // Get total records and last update from the new project stats API call
    const totalRecords = projectStats?.totalRecord ?? 0;
    const lastUpdate = projectStats?.lastUpdatedAt
      ? new Date(projectStats.lastUpdatedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "—";

    return { totalSchemas, totalRecords, lastUpdate };
  }, [schemas, projectStats]); //  Depend on schemas and projectStats

  const addLog = (action: LogAction, title: string, description: string) => {
    setLogs(prev => [
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

  const handleAddSample = async () => {
    try {
      const payload = {
        name: "Shoes",
        price: 11.25,
        created_at: new Date().toISOString(),
      };
      await insertRow({
        schemaName: activeSchemaName,
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
    {
      id: "database",
      label: "Database",
      icon: <Database className="w-4 h-4" />,
    },
    { id: "logs", label: "Logs", icon: <FileText className="w-4 h-4" /> },
    { id: "schedule", label: "Schedule", icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <DataSourceHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            icon={<Database className="w-6 h-6 text-teal-400" />}
            value={String(totalSchemas)} // Displays the real total schema count
            label="Total Schemas"
          />
          <StatsCard
            icon={<FileText className="w-6 h-6 text-teal-400" />}
            value={String(totalRecords)} //? No endpoint for total record
            label="Total Records"
          />
          <StatsCard
            icon={<Clock className="w-6 h-6 text-teal-400" />}
            value={lastUpdate} //? No endpoint for last update or create time
            label="Last Update"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border-1 border-gray-200 dark:border-slate-800">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="p-8 bg-white dark:bg-slate-900">
            {activeTab === "database" &&
              (isLoading || statsLoading ? (
                <p className="text-slate-400">Loading...</p>
              ) : isError ? (
                <p className="text-red-400">Failed to load data</p>
              ) : apiRows.length > 0 && activeSchema ? (
                <DataTable
                  projectUuid={workspaceId}
                  schema={activeSchema}
                  onLog={addLog}
                />
              ) : (
                <EmptyState onAddSample={handleAddSample} />
              ))}

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
                rowCount={apiRows.length}
                lastUpdated={"—"}
                dataSourceName={activeSchemaName}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
