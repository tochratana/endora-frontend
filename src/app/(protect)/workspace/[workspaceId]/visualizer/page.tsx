"use client";

import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  ReactFlowProvider,
  addEdge,
  Connection,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DatabaseSchemaDemo from "@/components/database-schema-demo";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";

const nodeTypes = { dbNode: DatabaseSchemaDemo };

interface PageProps {
  params: {
    workspaceId: string;
  };
}

// Helper function to parse schema definition into expected format
const parseSchemaToColumns = (schema: Record<string, string>) => {
  return Object.entries(schema).map(([title, definition]) => {
    // Extract the base type (e.g., "SERIAL PRIMARY KEY" -> "serial")
    const type = definition.split(" ")[0].toLowerCase();
    return { title, type };
  });
};

export default function SchemaVisualizerPage({ params }: PageProps) {
  // Fetch schemas from API
  const {
    data: schemas,
    error,
    isLoading,
  } = useGetSchemasQuery(params.workspaceId);

  // Transform schemas into nodes
  const nodes = useMemo(() => {
    if (!schemas || schemas.length === 0) {
      return [];
    }

    return schemas.map((schema, index) => {
      const columns = parseSchemaToColumns(schema.schema);
      const xPos = (index % 3) * 350 + 50; // Arrange in grid
      const yPos = Math.floor(index / 3) * 300 + 50;

      return {
        id: schema.id,
        type: "dbNode",
        position: { x: xPos, y: yPos },
        data: {
          label: schema.schemaName,
          schema: columns,
        },
      };
    });
  }, [schemas]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    []
  );

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex justify-between items-center px-6 py-3 border-b border-border bg-card/50 dark:bg-slate-950">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Schema Visualizer
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 border-2 bg-teal-500/45 rounded-sm px-2 py-1 hover:bg-indigo-800/50 hover:text-white">
                Connect{" "}
                <ChevronDown className="flex items-center text-xs rounded-xs px-1 pt-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom" // ⬅️ open to the right of the trigger
              align="start"
              className="flex items-center bg-white dark:bg-gray-800 dark:text-gray-100"
            >
              <DropdownMenuItem className="block">
                <Image
                  src="/one_to_one.png"
                  width={100}
                  height={100}
                  alt="logo"
                  unoptimized
                />
                <div className="w-full text-center">
                  <span className="text-sm text-gray-400 ">One to One</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="block">
                <Image
                  src="/one_to_many.png"
                  width={100}
                  height={100}
                  alt="logo"
                  unoptimized
                />
                <div className="w-full text-center">
                  <span className="text-sm text-gray-400 ">One to Many</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="block">
                <Image
                  src="/many_to_one.png"
                  width={100}
                  height={100}
                  alt="logo"
                  unoptimized
                />
                <div className="w-full text-center">
                  <span className="text-sm text-gray-400 ">Many to One</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="block">
                <Image
                  src="/many_to_many.png"
                  width={100}
                  height={100}
                  alt="logo"
                  unoptimized
                />
                <div className="w-full text-center">
                  <span className="text-sm text-gray-400 ">Many to Many</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading schemas...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load schemas</p>
              <p className="text-sm text-muted-foreground">
                {error && "data" in error
                  ? String(error.data)
                  : "Unknown error"}
              </p>
            </div>
          </div>
        ) : nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No schemas found</p>
              <p className="text-sm text-muted-foreground">
                Create some schemas first to visualize them here
              </p>
            </div>
          </div>
        ) : (
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onConnect={onConnect}
              fitView
            >
              <Background className="dark:bg-slate-950"/>
            </ReactFlow>
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}
