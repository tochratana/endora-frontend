"use client";

import { useState, use, useEffect } from "react";
import { SchemaSidebar } from "@/components/schema/schema-sidebar";
import { SchemaContent } from "@/components/schema/schema-content";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
import { Check, Database } from "lucide-react";

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

  const [endpointsGenerated, setEndpointsGenerated] = useState(false);
  const handleGenerateEndpoints = () => {
    setEndpointsGenerated(true);
    setTimeout(() => setEndpointsGenerated(false), 2000);
  };

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
        <div className="flex justify-between items-center px-6 py-2 border-b border-border bg-card/50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              Database Schema
            </h2>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground capitalize">
              {activeTable}
            </span>
          </div>
          <div className="px-6 py-4">
            <button
              className="flex items-center gap-2 border-2 border-indigo-900 rounded-sm px-2 py-1 hover:bg-indigo-800 hover:text-white"
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
            </button>
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
