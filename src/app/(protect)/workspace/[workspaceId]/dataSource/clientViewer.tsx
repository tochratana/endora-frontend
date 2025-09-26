"use client";

import { useMemo, useState, useEffect } from "react";
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

// Define the Local Storage key
const LOCAL_STORAGE_KEY = "activityLogs";

export default function DataSourcesClient({ workspaceId, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [activeSchemaName, setActiveSchemaName] = useState<string>("products");

  const userUuid = "user-123"; //pull from session

  //todo: adding local storage for logs
  // Load logs from Local Storage on initial mount
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedLogs) {
        // Parse the JSON string back into a LogItem[] array
        setLogs(JSON.parse(storedLogs) as LogItem[]);
      }
    } catch (error) {
      console.error("Error reading from Local Storage:", error);
      // Fallback to empty array if reading fails
      setLogs([]);
    }
  }, []);

  // Save logs to Local Storage whenever the 'logs' state changes
  useEffect(() => {
    try {
      // Stringify the logs array to store it as a string
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error("Error writing to Local Storage:", error);
    }
  }, [logs]);

  //todo: Fetch ALL schemas to get the total count
  const { data: schemas } = useGetSchemasQuery(workspaceId);

  // Fetch project-wide stats to get total records and last update
  const { data: projectStats, isLoading: statsLoading } =
    useGetProjectStatsQuery(workspaceId);

  // Fetch rows for the CURRENT active schema only
  const {
    data: rowsData,
    isLoading,
    isError,
    refetch,
  } = useGetSchemaRowsQuery({
    schemaName: activeSchemaName,
    projectUuid: workspaceId,
    userUuid,
    page: 1,
    limit: 10,
    sort: "created_at",
  });

  const apiRows: DataSourceRecord[] = rowsData?.data ?? [];
  const activeSchema: Schema | undefined = schemas?.find(
    s => s.schemaName === activeSchemaName
  );

  const [insertRow] = useInsertSchemaRowMutation();

  // compute stats from API data
  const { totalSchemas, totalRecords, lastUpdate } = useMemo(() => {
    const totalSchemas = schemas?.length ?? 0;
    const totalRecords = projectStats?.data.total ?? 0;
    //? Not yet work
    const lastUpdate = projectStats?.data.lastUpdatedAt
      ? new Date(projectStats.data.lastUpdatedAt).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }
        )
      : "—";
    return { totalSchemas, totalRecords, lastUpdate };
  }, [schemas, projectStats]);

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

  //handle log deletion
  const handleDeleteLog = (logId: string) => {
    // Filter out the log with the matching ID
    setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
    // The useEffect above will handle saving this updated state to Local Storage
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
          {/* Displays the real total schemas, records count */}
          <StatsCard
            icon={<Database className="w-6 h-6 text-teal-400" />}
            value={String(totalSchemas)}
            label="Total Schemas"
          />
          <StatsCard
            icon={<FileText className="w-6 h-6 text-teal-400" />}
            value={String(totalRecords)}
            label="Total Records"
          />
          <StatsCard
            icon={<Clock className="w-6 h-6 text-teal-400" />}
            value={lastUpdate} //? Not yet work
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
                <ActivityLogs logs={logs} onDelete={handleDeleteLog} />
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
