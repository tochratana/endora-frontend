"use client";

import { useState } from "react";
import Input from "@/components/ui/input";
import { Plus, Search, Table } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateSchemaDialog } from "@/components/create-schema-dialog";

const tables = [
  { id: "products", label: "Products", icon: Table },
  { id: "users", label: "Users", icon: Table },
];

interface SchemaSidebarProps {
  activeTable: string;
  onTableSelect: (tableId: string) => void;
}

export function SchemaSidebar({
  activeTable,
  onTableSelect,
}: SchemaSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTables = tables.filter((table) =>
    table.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleSaveSchema = (schema: unknown) => {
    console.log("Schema saved:", schema);
    // Handle the saved schema data here
  };

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
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
      <CreateSchemaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveSchema}
      />

      {/* Search */}
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search schema"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 py-2 bg-sidebar border-sidebar-border focus:ring-sidebar-ring transition-all duration-200"
          />
        </div>
      </div>

      {/* Tables List */}
      <div className="flex-1 p-2 space-y-1">
        {filteredTables.length > 0 ? (
          filteredTables.map((table) => {
            const Icon = table.icon;
            const isActive = activeTable === table.id;
            return (
              <button
                key={table.id}
                onClick={() => onTableSelect(table.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-200 text-left group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border-l-2 border-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:translate-x-1"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-sidebar-primary" : ""
                  )}
                />
                <span className="flex-1">{table.label}</span>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-sidebar-primary" />
                )}
              </button>
            );
          })
        ) : (
          <div className="px-3 py-2 text-sm text-muted-foreground text-center">
            No tables found
          </div>
        )}
      </div>
    </div>
  );
}
