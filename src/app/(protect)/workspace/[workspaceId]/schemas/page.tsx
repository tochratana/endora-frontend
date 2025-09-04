"use client";

import { useState } from "react";
import { SchemaSidebar } from "@/components/schema-sidebar";
import { SchemaContent } from "@/components/schema-content";

interface PageProps {
  params: {
    workspaceId: string;
  };
}

export default function SchemaManager({ params }: PageProps) {
  const [activeTable, setActiveTable] = useState("products");

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <SchemaSidebar
        activeTable={activeTable}
        onTableSelect={setActiveTable}
        projectUuid={params.workspaceId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center px-6 py-3 border-b border-border bg-card/50">
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
          <SchemaContent
            activeTable={activeTable}
            projectUuid={params.workspaceId}
          />
        </div>
      </div>
    </div>
  );
}
