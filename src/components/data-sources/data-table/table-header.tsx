"use client";

import { Table2, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";

type TableHeaderProps = {
  projectUuid: string;
  activeTable: string;
  onTableChange: (id: string) => void;
};

export function TableHeader({
  projectUuid,
  activeTable,
  onTableChange,
}: TableHeaderProps) {
  const { data: schemas, isLoading, isError } = useGetSchemasQuery(projectUuid);

  const fallbackTabs = [
    { id: "users", label: "Users", icon: Table2 },
    { id: "products", label: "Products", icon: Table2 },
  ];

  const tabs = schemas?.length
    ? schemas.map(s => ({
        id: s.schemaName, // important: match schemaName for rows query
        label: s.schemaName,
        icon: Table2,
      }))
    : fallbackTabs;

  const activeLabel =
    tabs.find(tab => tab.id === activeTable)?.label ?? "Select a schema";

  const shouldShowError = isError && (!schemas || schemas.length === 0);

  return (
    <div>
      <div className="flex items-center gap-2 py-2">
        <p className="text-sm text-gray-500 dark:text-slate-300">
          Schema: {activeLabel}
        </p>{" "}
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>

      <div className="w-full dark:bg-slate-900 border dark:border-slate-700 rounded-[5px]">
        <div className="flex items-center">
          {/* Left brand/logo */}
          <div className="flex items-center justify-center w-12 h-12 border-r dark:border-slate-700">
            <div className="w-6 h-6 rounded-full dark:bg-slate-600 bg-secondary flex items-center justify-center text-white text-xs font-medium">
              <ClipboardList size={14} />
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center divide-x darK:divide-slate-700">
            {isLoading && (
              <span className="px-4 py-3 text-slate-400 text-sm">
                Loading schemas...
              </span>
            )}

            {shouldShowError && (
              <span className="px-4 py-3 text-red-400 text-sm">
                Failed to load schemas
              </span>
            )}

            {!isLoading &&
              !shouldShowError &&
              tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTable === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onTableChange(tab.id)} // use parent handler
                    className={cn(
                      "relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200",
                      "dark:hover:bg-slate-800/50 hover:bg-gray-300/50",
                      isActive
                        ? "dark:bg-slate-800 bg-slate-200 dark:text-white text-gray-600"
                        : "text-gray-400"
                    )}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
