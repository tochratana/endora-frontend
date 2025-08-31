

"use client";

import { useEffect, useMemo, useState } from "react";
import { Database, FileText, Clock } from "lucide-react";

import { DataSourceHeader } from "@/components/data-sources/data-source-header";
import { StatsCard } from "@/components/data-sources/stats-card";
import { TabNavigation } from "@/components/data-sources/tab-navigation";
import { EmptyState } from "@/components/data-sources/empty-state";
import { DataTable } from "@/components/data-sources/data-table";
import { ActivityLogs } from "@/components/data-sources/activity-logs";
import { ScheduleReset } from "@/components/data-sources/schedule-reset";

import type {
  SampleData,
  TabItem,
  TabType,
  LogItem,
  SampleProduct,
  LogAction,
} from "@/types/dataSource";

const CURRENT_USER = "You";

const LS_KEYS = {
  activeTab: "ds_activeTab",
  sampleData: "ds_sampleData",
} as const;

function isValidTab(v: unknown): v is TabType {
  return v === "database" || v === "logs" || v === "schedule";
}

function todayLocalISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
}

function getInitialState(): { tab: TabType; sample: SampleData } {
  let tab: TabType = "database";
  let sample: SampleData = { products: [], logs: [], hasData: false };

  if (typeof window !== "undefined") {
    const urlTab = new URLSearchParams(window.location.search).get("tab");
    if (isValidTab(urlTab)) tab = urlTab;

    const saved = localStorage.getItem(LS_KEYS.sampleData);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        sample = {
          products: Array.isArray(parsed?.products) ? parsed.products : [],
          logs: Array.isArray(parsed?.logs) ? parsed.logs : [],
          hasData: (parsed?.products?.length ?? 0) > 0,
        };
      } catch {}
    }

    const savedTab = localStorage.getItem(LS_KEYS.activeTab);
    if (isValidTab(savedTab)) tab = savedTab;
  }

  return { tab, sample };
}

export default function Page() {
  const { tab: initialTab, sample: initialSample } = getInitialState();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [sampleData, setSampleData] = useState<SampleData>(initialSample);

  // keep tab in URL
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("tab") !== activeTab) {
      url.searchParams.set("tab", activeTab);
      window.history.replaceState(null, "", url.toString());
    }
    localStorage.setItem(LS_KEYS.activeTab, activeTab);
  }, [activeTab]);

  // persist state
  useEffect(() => {
    localStorage.setItem(LS_KEYS.sampleData, JSON.stringify(sampleData));
  }, [sampleData]);

  const tabs: TabItem[] = [
    { id: "database", label: "Database", icon: <Database className="w-4 h-4" /> },
    { id: "logs", label: "Logs", icon: <FileText className="w-4 h-4" /> },
    { id: "schedule", label: "Schedule", icon: <Clock className="w-4 h-4" /> },
  ];

  // header stats
  const { totalFields, totalRecords, lastUpdate } = useMemo(() => {
    const totalRecords = sampleData.products.length;
    const totalFields =
      totalRecords > 0 ? Object.keys(sampleData.products[0]).length : 0;

    let lastUpdate = "—";
    if (totalRecords > 0) {
      const maxTs = Math.max(
        ...sampleData.products.map((p) => new Date(p.created_date).getTime())
      );
      lastUpdate = new Date(maxTs).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
    return { totalFields, totalRecords, lastUpdate };
  }, [sampleData.products]);

  // logging
  const addLog = (
    action: LogAction,
    title: string,
    description: string,
    user = CURRENT_USER
  ) => {
    const entry: LogItem = {
      id: crypto.randomUUID(),
      title,
      description,
      user,
      action,
      timestamp: new Date().toISOString(),
    };
    setSampleData((prev) => ({ ...prev, logs: [entry, ...prev.logs] }));
  };

  const handleProductsChange = (next: SampleProduct[]) => {
    setSampleData((prev) => ({
      ...prev,
      products: next,
      hasData: next.length > 0,
    }));
  };

  const handleAddSample = () => {
    const products: SampleProduct[] = [
      { id: 1, name: "Shoes", price: 11.25, created_date: "2025-08-15" },
      { id: 2, name: "Shirt", price: 12.0, created_date: "2025-08-16" },
      { id: 3, name: "Skirt", price: 25.99, created_date: "2025-08-16" },
    ];
    setSampleData({ products, logs: [], hasData: true });
    addLog("IMPORT", "Sample data imported", `Imported ${products.length} products`);
    setActiveTab("database");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <DataSourceHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard icon={<Database className="w-6 h-6 text-teal-400" />} value={String(totalFields)} label="Total Fields" />
          <StatsCard icon={<FileText className="w-6 h-6 text-teal-400" />} value={String(totalRecords)} label="Total Records" />
          <StatsCard icon={<Clock className="w-6 h-6 text-teal-400" />} value={lastUpdate} label="Last Update" />
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-800">
          <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="p-8">
            {activeTab === "database" &&
              (sampleData.products.length > 0 ? (
                <DataTable
                  products={sampleData.products}
                  onProductsChange={handleProductsChange}
                  onLog={(action, title, description) => addLog(action, title, description)}
                />
              ) : (
                <EmptyState onAddSample={handleAddSample} />
              ))}

            {activeTab === "logs" &&
              (sampleData.logs.length ? (
                <ActivityLogs logs={sampleData.logs} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400">Activity logs will appear here</p>
                </div>
              ))}

            {activeTab === "schedule" && (
              <ScheduleReset
                rowCount={sampleData.products.length}
                lastUpdated={lastUpdate}
                dataSourceName="products"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
