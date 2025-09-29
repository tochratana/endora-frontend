"use client";

import { useState, use, useEffect } from "react";
import { SchemaSidebar } from "@/components/ui/schema-sidebar";
import { SchemaContent } from "@/components/ui/schema-content";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";

interface PageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default function SchemaManager({ params }: PageProps) {
  const { workspaceId } = use(params);
  const [activeTable, setActiveTable] = useState("");
  const { data: schemas } = useGetSchemasQuery(workspaceId);

  useEffect(() => {
    if (schemas && schemas.length > 0 && !activeTable) {
      setActiveTable(schemas[0].schemaName);
    }
  }, [schemas, activeTable]);


  console.log("This is data",schemas);

  

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <SchemaSidebar
        activeTable={activeTable}
        onTableSelect={setActiveTable}
        projectUuid={workspaceId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              Database Schema
            </h2>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground capitalize">
              {activeTable}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <SchemaContent activeTable={activeTable} projectUuid={workspaceId} />
        </div>
      </div>
    </div>
  );
}
