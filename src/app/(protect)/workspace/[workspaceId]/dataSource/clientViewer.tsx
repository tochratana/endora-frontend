"use client";

import { useMemo, useState, useEffect } from "react";
import { Database, FileText, Clock } from "lucide-react";
import {
  useGetSchemaRowsQuery,
  useInsertSchemaRowMutation,
  useGetProjectStatsQuery,
} from "@/service/apiSlide/dataSourceApi";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
import { skipToken } from "@reduxjs/toolkit/query";

import { DataSourceHeader } from "@/components/data-sources/data-source-header";
import { StatsCard } from "@/components/data-sources/stats-card";
import { TabNavigation } from "@/components/data-sources/tab-navigation";
import { DataTable } from "@/components/data-sources/data-table/data-table";
import { EmptyState } from "@/components/data-sources/empty-state";
import { ActivityLogs } from "@/components/data-sources/activity-logs";
import { ScheduleReset } from "@/components/data-sources/schedule-reset";

import type { TabItem, TabType, LogItem, LogAction } from "@/types/dataSource";
import type { DataSourceRecord } from "@/service/apiSlide/dataSourceApi";
import type { Schema } from "@/service/apiSlide/schemaApi";

type Props = {
  workspaceId: string;
  initialTab: TabType;
};

const LOCAL_STORAGE_KEY = "activityLogs";

export default function DataSourcesClient({ workspaceId, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [logs, setLogs] = useState<LogItem[]>([]);

  const [activeSchemaName, setActiveSchemaName] = useState<string | null>(null);

  const userUuid = "user-123";

  //loggin and local storage handler
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs) as LogItem[]);
      }
    } catch (error) {
      console.error("Error reading from Local Storage:", error);
      setLogs([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error("Error writing to Local Storage:", error);
    }
  }, [logs]);

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

  const handleDeleteLog = (logId: string) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
  };

  // Fetch Schemas
  const { data: schemas, isLoading: schemasLoading } =
    useGetSchemasQuery(workspaceId);

  //Schema Selection Logic
  useEffect(() => {
    if (schemas && schemas.length > 0) {
      const currentSchemaExistsInNewProject = schemas.some(
        s => s.schemaName === activeSchemaName
      );

      if (!currentSchemaExistsInNewProject) {
        setActiveSchemaName(schemas[0].schemaName);
      }
    } else if (!schemasLoading) {
      // If no schemas were loaded, reset activeSchemaName to null
      setActiveSchemaName(null);
    }
  }, [schemas, activeSchemaName, schemasLoading, workspaceId]);

  // Fetch project-wide stats
  const { data: projectStats, isLoading: statsLoading } =
    useGetProjectStatsQuery(workspaceId);

  // Conditional Fetch for table data
  const {
    data: rowsData,
    isLoading: rowsLoading,
    isError,
    refetch,
  } = useGetSchemaRowsQuery(
    activeSchemaName
      ? {
          schemaName: activeSchemaName,
          projectUuid: workspaceId,
          userUuid,
          page: 1,
          limit: 10,
          sort: "created_at",
        }
      : skipToken
  );

  const apiRows: DataSourceRecord[] = rowsData?.data ?? [];
  const activeSchema: Schema | undefined = schemas?.find(
    s => s.schemaName === activeSchemaName
  );

  const [insertRow] = useInsertSchemaRowMutation();

  // Stat Calculation
  const { totalSchemas, totalRecords, lastUpdate } = useMemo(() => {
    const totalSchemas = schemas?.length ?? 0;
    const totalRecords = projectStats?.data.total ?? 0;
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

  const handleAddSample = async () => {
    try {
      const payload = {
        name: "Shoes",
        price: 11.25,
        created_at: new Date().toISOString(),
      };
      await insertRow({
        schemaName: activeSchemaName!,
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
            value={lastUpdate}
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
              // Only show loading if an API call is active
              (rowsLoading || statsLoading || schemasLoading ? (
                <p className="text-slate-400">Loading data...</p>
              ) : isError ? (
                <p className="text-red-400">Failed to load data</p>
              ) : activeSchema ? (
                // Renders DataTable if schema is active, regardless of rows
                <DataTable
                  projectUuid={workspaceId}
                  schema={activeSchema}
                  onLog={addLog}
                />
              ) : (
                // FALLBACK: Only render EmptyState if no schema was found (schemas.length === 0)
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
                dataSourceName={activeSchemaName || "—"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
