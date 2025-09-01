"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, Settings, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./button/Button";

const tableSchemas = {
  products: [
    {
      name: "id",
      type: "int8",
      color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
      isPrimary: true,
    },
    {
      name: "name",
      type: "text",
      color:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
    {
      name: "price",
      type: "numeric",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      name: "created_date",
      type: "timestamp",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    },
  ],
  users: [
    {
      name: "id",
      type: "int8",
      color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
      isPrimary: true,
    },
    {
      name: "email",
      type: "varchar",
      color:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
    {
      name: "username",
      type: "varchar",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    },
    {
      name: "created_at",
      type: "timestamp",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    },
  ],
};

const tabs = [
  { id: "table", label: "", icon: Database, active: true },
  { id: "settings", label: "", icon: Settings, active: false },
];

interface SchemaContentProps {
  activeTable: string;
}

export function SchemaContent({ activeTable }: SchemaContentProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [endpointsGenerated, setEndpointsGenerated] = useState(false);

  const columns =
    tableSchemas[activeTable as keyof typeof tableSchemas] ||
    tableSchemas.products;
  const tableName = activeTable.charAt(0).toUpperCase() + activeTable.slice(1);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleGenerateEndpoints = () => {
    setEndpointsGenerated(true);
    setTimeout(() => setEndpointsGenerated(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                  tab.active
                    ? "bg-background text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.id === "table" && <span>{tableName}</span>}
              </button>
            );
          })}
        </div>

        <button className="text-muted-foreground hover:text-foreground p-1 rounded">
          <Plus className="h-4 w-4 rotate-45" />
        </button>
      </div>

      <div className="px-6 py-4 border-b border-border bg-muted/20">
        <Button
          size="sm"
          className="gap-2 bg-transparent"
          onClick={handleGenerateEndpoints}
          disabled={endpointsGenerated}
        >
          {endpointsGenerated ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              Generated!
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Generate Endpoints
            </>
          )}
        </Button>
      </div>

      <div className="flex-1 px-6 py-4 overflow-auto">
        <div className="space-y-4">
          {/* Column headers */}
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b border-border">
            <div>Column</div>
            <div>Type</div>
            <div>Constraints</div>
            <div>Default</div>
          </div>

          {/* Column rows */}
          <div className="space-y-3">
            {columns.map((column, index) => (
              <div
                key={column.name}
                className="grid grid-cols-4 gap-4 items-center py-2 hover:bg-muted/30 rounded-lg px-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    {column.name}
                  </span>
                  {column.isPrimary && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5"
                    >
                      PK
                    </Badge>
                  )}
                </div>
                <div>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs font-mono", column.color)}
                  >
                    {column.type}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {column.isPrimary ? "NOT NULL" : ""}
                </div>
                <div className="text-sm text-muted-foreground">
                  {column.isPrimary ? "nextval(...)" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-border bg-muted/10 flex justify-center">
        <Button
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
}
