"use client";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast, Toaster } from "sonner";
import ReactFlow, {
  Background,
  ReactFlowProvider,
  addEdge,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DatabaseSchemaDemo from "@/components/schema/database-schema-demo";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import {
  useGetSchemasQuery,
  useCreateSchemaRelationshipMutation,
} from "@/service/apiSlide/schemaApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface Relationship {
  foreignKeyColumn: string;
  referencedTable: string;
  referencedColumn: string;
  relationshipType: string;
  onDelete: string;
  onUpdate: string;
}

interface Schema {
  schemaDocId: string;
  projectUuid: string;
  schemaName: string;
  columns?: Record<string, string>;
  relationships: Relationship[];
  updatedAt: string;
}
type BackendError = FetchBaseQueryError & {
  data?: { message?: string };
};

const nodeTypes = { dbNode: DatabaseSchemaDemo };

const parseSchemaToColumns = (columns?: Record<string, string>) => {
  if (!columns) return [];
  return Object.entries(columns).map(([title, definition]) => {
    const type = definition.split(" ")[0].toLowerCase();
    return { title, type };
  });
};

const getRelationshipLabel = (type: string): string => {
  switch (type.toLowerCase()) {
    case "one-to-one":
      return "One to One";
    case "one-to-many":
      return "One to Many";
    case "many-to-many":
      return "Many to Many";
    default:
      return type;
  }
};

export default function SchemaVisualizerPage() {
  const params = useParams<{ workspaceId?: string; projectUuid?: string }>();
  const projectUuid = params?.projectUuid ?? params?.workspaceId;

  const {
    data: schemas,
    error,
    isLoading,
  } = useGetSchemasQuery(projectUuid!, {
    skip: !projectUuid,
  });

  const [createRelationship] = useCreateSchemaRelationshipMutation();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [canConnect, setCanConnect] = useState(false);
  const [selectedRelationship, setSelectedRelationship] = useState<
    string | null
  >(null);

  const onConnect = useCallback(
    async (params: Connection) => {
      if (!selectedRelationship) {
        toast.error("Please select a relationship type before connecting.");
        return;
      }

      setEdges(eds => addEdge({ ...params, animated: true }, eds));

      if (projectUuid && schemas) {
        const sourceSchema = schemas.find(s => s.schemaDocId === params.source);
        const targetSchema = schemas.find(s => s.schemaDocId === params.target);

        if (sourceSchema && targetSchema) {
          const foreignKeyColumn = `${targetSchema.schemaName.toLowerCase()}_id`;

          try {
            await createRelationship({
              projectUuid,
              schemaName: sourceSchema.schemaName,
              foreignKeyColumn,
              referencedTable: targetSchema.schemaName.toLowerCase(),
              referencedColumn: "id",
              relationshipType: selectedRelationship,
              onDelete: "RESTRICT",
              onUpdate: "CASCADE",
            }).unwrap();

            toast.success(
              `Relationship created: added column ${foreignKeyColumn} in ${sourceSchema.schemaName} → ${targetSchema.schemaName}.id`
            );
          } catch (err) {
            const error = err as BackendError;
            const raw =
              typeof error.data === "object" && error.data?.message
                ? error.data.message
                : "";

            let userMessage = "Could not create relationship.";
            if (raw.includes("bad SQL grammar")) {
              userMessage =
                "The database rejected this relationship. Please check that the new foreign key column can be created.";
            } else if (raw.includes("Invalid table name")) {
              userMessage =
                "The table name is invalid. Please check your schema names.";
            }

            toast.error(userMessage);
            setEdges(eds =>
              eds.filter(
                e => e.source !== params.source || e.target !== params.target
              )
            );
          }
        }
      }
    },
    [selectedRelationship, createRelationship, projectUuid, schemas, setEdges]
  );

  // Build initial nodes/edges from schemas
  useEffect(() => {
    if (schemas) {
      const initialNodes = schemas.map((schema: Schema, index: number) => ({
        id: schema.schemaDocId,
        type: "dbNode",
        position: {
          x: (index % 3) * 350 + 50,
          y: Math.floor(index / 3) * 300 + 50,
        },
        data: {
          label: schema.schemaName,
          schema: parseSchemaToColumns(schema.columns),
        },
      }));
      setNodes(initialNodes);

      const initialEdges: Edge[] = [];
      const schemaMap = new Map<string, Schema>();
      schemas.forEach((s: Schema) => schemaMap.set(s.schemaName, s));

      schemas.forEach((s: Schema) => {
        s.relationships.forEach((r: Relationship) => {
          const targetSchema = schemaMap.get(r.referencedTable);
          if (targetSchema) {
            initialEdges.push({
              id: `e-${s.schemaDocId}-${targetSchema.schemaDocId}-${r.foreignKeyColumn}`,
              source: s.schemaDocId,
              target: targetSchema.schemaDocId,
              label: getRelationshipLabel(r.relationshipType),
              animated: true,
            });
          }
        });
      });
      setEdges(initialEdges);
    }
  }, [schemas, setNodes, setEdges]);

  if (!projectUuid) {
    return (
      <p className="text-center text-red-500">No project UUID found in URL</p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading schemas…</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to load schemas</p>;
  }

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-6 border-b border-border bg-card/50 dark:bg-slate-950">
        <h2 className="text-lg font-semibold">Schema Visualizer</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 border-2 bg-teal-500/45 rounded-sm px-2 py-1 hover:bg-indigo-800/50 hover:text-white">
              {" "}
              Connect{" "}
              <ChevronDown className="flex items-center text-xs rounded-xs px-1 pt-0.5" />{" "}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                setSelectedRelationship("one-to-one");
                setCanConnect(true);
              }}
            >
              <Image
                src="/one_to_one.png"
                width={80}
                height={80}
                alt="One to One"
              />
              <span className="ml-2">One to One</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setSelectedRelationship("one-to-many");
                setCanConnect(true);
              }}
            >
              <Image
                src="/one_to_many.png"
                width={80}
                height={80}
                alt="One to Many"
              />
              <span className="ml-2">One to Many</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedRelationship("many-to-many");
                setCanConnect(true);
              }}
            >
              <Image
                src="/many_to_many.png"
                width={80}
                height={80}
                alt="One to Many"
              />
              <span className="ml-2">Many to Many</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlowProvider>
          <ReactFlow
            nodeTypes={nodeTypes}
            fitView
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodesConnectable={canConnect}
            edgesUpdatable={false}
          >
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
