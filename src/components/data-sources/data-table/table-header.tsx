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
    <div className="w-full">
      {/* Schema indicator - responsive text */}
      <div className="flex items-center gap-2 py-2">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-300 truncate">
          Schema: <span className="font-medium">{activeLabel}</span>
        </p>
        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
      </div>

      <div className="w-full dark:bg-slate-900 border dark:border-slate-700 rounded overflow-hidden">
        <div className="flex items-center">
          {/* Left brand/logo - responsive sizing */}
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 border-r dark:border-slate-700 flex-shrink-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full dark:bg-slate-600 bg-secondary flex items-center justify-center text-white text-xs font-medium">
              <ClipboardList size={12} className="sm:hidden" />
              <ClipboardList size={14} className="hidden sm:block" />
            </div>
          </div>

          {/* Scrollable Navigation tabs */}
          <div className="flex items-center divide-x dark:divide-slate-700 flex-1 overflow-x-auto scrollbar-hide">
            {isLoading && (
              <span className="px-3 sm:px-4 py-3 text-slate-400 text-xs sm:text-sm whitespace-nowrap">
                Loading schemas...
              </span>
            )}

            {shouldShowError && (
              <span className="px-3 sm:px-4 py-3 text-red-400 text-xs sm:text-sm whitespace-nowrap">
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
                    onClick={() => onTableChange(tab.id)}
                    className={cn(
                      "relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                      "dark:hover:bg-slate-800/50 hover:bg-gray-300/50",
                      isActive
                        ? "dark:bg-slate-800 bg-gray-300/50 dark:text-white text-gray-600"
                        : "text-gray-400"
                    )}
                  >
                    <Icon size={14} className="sm:size-4 flex-shrink-0" />
                    <span className="truncate max-w-[100px] sm:max-w-[120px] md:max-w-none">{tab.label}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}