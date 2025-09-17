"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
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

// ✅ align with your backend
interface Schema {
  schemaDocId: string;
  projectUuid: string;
  schemaName: string;
  columns?: Record<string, string>; // optional, sometimes missing
  relationships: [];
  updatedAt: string;
}

const nodeTypes = { dbNode: DatabaseSchemaDemo };

// ✅ safe parser
const parseSchemaToColumns = (columns?: Record<string, string>) => {
  if (!columns) return [];
  return Object.entries(columns).map(([title, definition]) => {
    const type = definition.split(" ")[0].toLowerCase();
    return { title, type };
  });
};

export default function SchemaVisualizerPage() {
  // 👇 supports /workspace/[workspaceId] and /table/project/[projectUuid]
  const params = useParams<{ workspaceId?: string; projectUuid?: string }>();
  const projectUuid = params?.projectUuid ?? params?.workspaceId;

  const {
    data: schemas,
    error,
    isLoading,
  } = useGetSchemasQuery(projectUuid!, {
    skip: !projectUuid,
  });

  // ✅ build nodes
  const nodes = useMemo(() => {
    if (!schemas || schemas.length === 0) return [];

    return schemas.map((schema: Schema, index: number) => {
      const columns = parseSchemaToColumns(schema.columns);
      return {
        id: schema.schemaDocId,
        type: "dbNode",
        position: {
          x: (index % 3) * 350 + 50,
          y: Math.floor(index / 3) * 300 + 50,
        },
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

  // ✅ handle states
  if (!projectUuid) {
    return (
      <p className="text-center text-red-500">No project UUID found in URL</p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading schemas…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load schemas</p>
          <p className="text-sm text-muted-foreground">
            {"data" in error ? String(error.data) : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No schemas found</p>
          <p className="text-sm text-muted-foreground">
            Create some schemas first to visualize them here
          </p>
        </div>
      </div>
    );
  }

  // ✅ render
  return (
    <div className="flex flex-col w-full h-screen">
      {/* Header */}
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
              side="bottom"
              align="start"
              className="flex items-center bg-white dark:bg-gray-800 dark:text-gray-100"
            >
              <DropdownMenuItem className="block">
                <Image
                  src="/one_to_one.png"
                  width={100}
                  height={100}
                  alt="One to One"
                  unoptimized
                />
                <div className="w-full text-center">
                  <span className="text-sm text-gray-400">One to One</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="block">
                <Image
                  src="/one_to_many.png"
                  width={100}
                  height={100}
                  alt="One to Many"
                  unoptimized
                />
                <div className="w-full text-center">
                  <span className="text-sm text-gray-400">One to Many</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="block">
                <Image
                  src="/many_to_one.png"
                  width={100}
                  height={100}
                  alt="Many to One"
                  unoptimized
                />
                <div className="w-full text-center">
                  <span className="text-sm text-gray-400">Many to One</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="block">
                <Image
                  src="/many_to_many.png"
                  width={100}
                  height={100}
                  alt="Many to Many"
                  unoptimized
                />
                <div className="w-full text-center">
                  <span className="text-sm text-gray-400">Many to Many</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            fitView
          >
            <Background className="dark:bg-slate-950" />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
