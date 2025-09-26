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
  
  // 🔑 State for the currently selected schema (start as null)
  const [activeSchemaName, setActiveSchemaName] = useState<string | null>(null);

  const userUuid = "user-123";

  // --- LOGGING AND LOCAL STORAGE HANDLERS ---
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


  // 1. Fetch Schemas
  const { data: schemas, isLoading: schemasLoading } = useGetSchemasQuery(workspaceId);

  // 🔑 FIX: Schema Selection Logic (Resets and selects first schema on project switch)
  useEffect(() => {
    if (schemas && schemas.length > 0) {
      // Check if the current schema exists in the NEW project's schema list.
      const currentSchemaExistsInNewProject = schemas.some(
        s => s.schemaName === activeSchemaName
      );

      if (!currentSchemaExistsInNewProject) {
        // If invalid or null, select the first one.
        setActiveSchemaName(schemas[0].schemaName);
      }
    } else if (!schemasLoading) {
      // If schemas loaded and the list is empty, reset the name to null.
      setActiveSchemaName(null);
    }
  }, [schemas, activeSchemaName, schemasLoading, workspaceId]);


  // 2. Fetch project-wide stats
  const { data: projectStats, isLoading: statsLoading } = useGetProjectStatsQuery(workspaceId);

  // 3. Conditional Fetch for table data
  const {
    data: rowsData,
    isLoading: rowsLoading,
    isError,
    refetch,
  } = useGetSchemaRowsQuery(
    activeSchemaName ? {
      schemaName: activeSchemaName,
      projectUuid: workspaceId,
      userUuid,
      page: 1,
      limit: 10,
      sort: "created_at",
    } : skipToken // Skips the query until activeSchemaName is set
  );

  const apiRows: DataSourceRecord[] = rowsData?.data ?? [];
  const activeSchema: Schema | undefined = schemas?.find(
    s => s.schemaName === activeSchemaName
  );

  const [insertRow] = useInsertSchemaRowMutation();

  // 4. Stat Calculation
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
    { id: "database", label: "Database", icon: <Database className="w-4 h-4" /> },
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
              (rowsLoading || statsLoading || schemasLoading || !activeSchemaName ? (
                <p className="text-slate-400">Loading data...</p>
              ) : isError ? (
                <p className="text-red-400">Failed to load data</p>
              ) : activeSchema ? ( //Render DataTable if schema is active (table headers show)
                <DataTable
                  projectUuid={workspaceId}
                  schema={activeSchema}
                  onLog={addLog}
                />
              ) : ( //Fallback: Only render EmptyState if NO schema is loaded
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
                dataSourceName={activeSchemaName || '—'}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}