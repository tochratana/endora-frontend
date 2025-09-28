"use client";

import { useState } from "react";
import Input from "@/components/ui/input";
import { Plus, Search, Table } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateSchemaDialog } from "@/components/schema/create-schema-dialog";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
import ReuseSchema from "./reuseSchema";

interface SchemaSidebarProps {
  activeTable: string;
  onTableSelect: (tableId: string) => void;
  projectUuid: string;
}

export function SchemaSidebar({
  activeTable,
  onTableSelect,
  projectUuid,
}: SchemaSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch schemas from API
  const { data: schemas, error, isLoading } = useGetSchemasQuery(projectUuid);

  // Filter schemas based on search query
  const filteredSchemas =
    schemas?.filter(schema =>
      schema.schemaName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleSaveSchema = (schema: unknown) => {
    console.log("Schema saved:", schema);
    // Handle the saved schema data here
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-lg font-semibold text-sidebar-foreground">
          Schema
        </h1>
      </div>

      {/* New Schema Button */}
      <div className="p-2">
        <button
          className="w-full flex items-center gap-2 border-2 border-indigo-900 rounded-sm px-2 py-1 hover:bg-indigo-800 hover:text-white"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Schema
        </button>
      </div>
      <div className="p-2">
        <ReuseSchema
          projectUuid={projectUuid}
        />
      </div>

      <CreateSchemaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        projectUuid={projectUuid}
        onSave={handleSaveSchema}
      />

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schema"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 py-2 bg-slate-800 border-slate-600 focus:ring-sidebar-ring transition-all duration-200"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="p-2 text-center text-sm text-muted-foreground">
          Loading schemas...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-2 text-center text-sm text-red-500">
          Failed to load schemas
        </div>
      )}

      {/* Schemas List */}
      <div className="flex-1 p-2 space-y-1">
        {!isLoading && !error && filteredSchemas.length > 0 ? (
          filteredSchemas.map(schema => {
            const key = schema.schemaDocId || schema.schemaName;
            const isActive = activeTable === key;
            return (
              <button
                key={key}
                onClick={() => onTableSelect(key)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 text-left group",
                  isActive
                    ? "bg-slate-800 text-sidebar-accent-foreground shadow-sm border-l-2 border-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-1"
                )}
              >
                <Table
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-sidebar-primary" : ""
                  )}
                />
                <span className="flex-1">{schema.schemaName}</span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-sidebar-primary" />
                )}
              </button>
            );
          })
        ) : !isLoading && !error ? (
          <div className="px-3 py-2 text-sm text-muted-foreground text-center">
            No schemas found
          </div>
        ) : null}
      </div>
    </div>
  );
}
