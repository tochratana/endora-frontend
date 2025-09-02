"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  addEdge,
  Connection,
  Edge,
  Node,
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

const nodeTypes = { dbNode: DatabaseSchemaDemo };

export default function SchemaVisualizerPage() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "products",
      type: "dbNode",
      position: { x: 50, y: 50 },
      data: {
        label: "Products",
        schema: [
          { title: "id", type: "uuid" },
          { title: "name", type: "varchar" },
          { title: "description", type: "varchar" },
          { title: "warehouse_id", type: "uuid" },
          { title: "supplier_id", type: "uuid" },
          { title: "price", type: "money" },
          { title: "quantity", type: "int4" },
        ],
      },
    },
    {
      id: "warehouses",
      type: "dbNode",
      position: { x: 350, y: 50 },
      data: {
        label: "Warehouses",
        schema: [
          { title: "id", type: "uuid" },
          { title: "name", type: "varchar" },
          { title: "address", type: "varchar" },
          { title: "capacity", type: "int4" },
        ],
      },
    },
    {
      id: "suppliers",
      type: "dbNode",
      position: { x: 350, y: 250 },
      data: {
        label: "Suppliers",
        schema: [
          { title: "id", type: "uuid" },
          { title: "name", type: "varchar" },
          { title: "description", type: "varchar" },
          { title: "country", type: "varchar" },
        ],
      },
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    {
      id: "e1-2",
      source: "products",
      sourceHandle: "warehouse_id",
      target: "warehouses",
      targetHandle: "id",
    },
    {
      id: "e1-3",
      source: "products",
      sourceHandle: "supplier_id",
      target: "suppliers",
      targetHandle: "id",
    },
  ]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex justify-between items-center px-6 py-3 border-b border-border bg-card/50">
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
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            fitView
          >
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
