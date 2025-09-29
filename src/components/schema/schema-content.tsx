"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";

interface SchemaContentProps {
  activeTable: string;
  projectUuid: string;
}

// Helper function to get color based on data type
const getTypeColor = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes("integer") || lowerType.includes("int")) {
    return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
  }
  if (lowerType.includes("uuid") || lowerType.includes("text")) {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  }
  if (lowerType.includes("bigint") || lowerType.includes("date")) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  }
  if (lowerType.includes("timestamp") || lowerType.includes("timestamptz")) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
  }
  if (lowerType.includes("boolean") || lowerType.includes("jsonb")) {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
  }
  return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
};

// Helper function to parse schema definition
const parseSchemaColumns = (schema: Record<string, string>) => {
  return Object.entries(schema).map(([name, definition]) => ({
    name,
    type: definition,
    color: getTypeColor(definition),
    isPrimary: name === "id",
  }));
};

export function SchemaContent({
  activeTable,
  projectUuid,
}: SchemaContentProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch schemas from API
  const {
    data: schemas,
    error,
    isLoading,
    refetch,
  } = useGetSchemasQuery(projectUuid);

  // find active schema
  const activeSchema = schemas?.find(
    schema => schema.schemaDocId === activeTable
  );

  const columns = useMemo(() => {
    if (!activeSchema?.columns) return [];
    return parseSchemaColumns(activeSchema.columns);
  }, [activeSchema]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };


  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      
      <div className="flex-1 px-6 py-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading schema...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load schema</p>
              <p className="text-sm text-muted-foreground">
                {error && "data" in error
                  ? String(error.data)
                  : "Unknown error"}
              </p>
            </div>
          </div>
        ) : !activeSchema ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Database className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No schema selected</p>
              <p className="text-sm text-muted-foreground mt-2">
                Select a schema from the sidebar to view its structure
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Schema Info */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-foreground mb-2">
                {activeSchema.schemaName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Schema ID: {activeSchema.schemaDocId}
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(activeSchema.updatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b border-border">
              <div>Column</div>
              <div>Type</div>
              <div>Constraints</div>
              <div>Definition</div>
            </div>

            {/* Column rows */}
            <div className="space-y-3">
              {columns.map(column => (
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
                        className="text-white text-xs rounded-xs px-1 py-0.5"
                      >
                        PK
                      </Badge>
                    )}
                  </div>
                  <div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs rounded-xs font-mono",
                        column.color
                      )}
                    >
                      {column.type.split(" ")[0]}{" "}
                      {/* Show just the base type */}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {column.isPrimary ? "PRIMARY KEY" : ""}
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    {column.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-border bg-gray-100 dark:bg-slate-950 flex justify-center">
        <button
          className="flex items-center gap-2 text-gray-600 bg-transparent"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
}