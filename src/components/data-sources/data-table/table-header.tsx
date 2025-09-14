"use client";

import { useState } from "react";
import { Table2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Import schema API (already exists in your project)
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";

type TableHeaderProps = {
  projectUuid: string; // pass workspaceId here
};

export function TableHeader({ projectUuid }: TableHeaderProps) {
  const [activeTab, setActiveTab] = useState("");

  // ✅ Try fetching schemas from API
  const { data: schemas, isLoading, isError } = useGetSchemasQuery(projectUuid);

  // ✅ Fallback mock data (used until teammate’s code works or if API fails)
  const mockTabs = [
    { id: "users", label: "users", icon: Table2 },
    { id: "products", label: "products", icon: Table2 },
  ];

  // ✅ Prefer real schemas, fallback to mockTabs
  const tabs =
    schemas && schemas.length > 0
      ? schemas.map((s) => ({
          id: s.id,
          label: s.schemaName,
          icon: Table2,
        }))
      : mockTabs;

  return (
    <div className="w-full bg-slate-900 border border-slate-700 rounded-sm">
      <div className="flex items-center">
        {/* Logo/Brand icon */}
        <div className="flex items-center justify-center w-12 h-12 border-r border-slate-700">
          <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-medium">
            <ClipboardList size={14} />
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center">
          {isLoading ? (
            <span className="px-4 py-3 text-slate-400 text-sm">
              Loading schemas...
            </span>
          ) : isError ? (
            <span className="px-4 py-3 text-red-400 text-sm">
              Failed to load schemas
            </span>
          ) : (
            tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-r border-slate-700 transition-colors",
                    "hover:bg-slate-800",
                    activeTab === tab.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-400"
                  )}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
