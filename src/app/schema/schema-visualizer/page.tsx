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

import DatabaseSchemaDemo from "@/components/database-schema-demo";

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
    (params: Connection) => setEdges(eds => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
