
// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import type { RowSelectionState } from "@tanstack/react-table";
// import { TableHeader } from "./table-header";
// import { TableToolbar } from "./table-toolbar";
// import { TableModals } from "./table-modals";
// import { TableBody } from "./table-body";
// import { TableFooter } from "./table-footer";
// import { cn } from "@/lib/utils";                // ✅ IF you use cn here

// import type { LogAction } from "@/types/dataSource";
// import type { DataSourceRecord } from "@/service/apiSlide/dataSourceApi";
// import type { Schema } from "@/service/apiSlide/schemaApi";

// interface DataTableProps {
//   rows: DataSourceRecord[];        // ✅ real API data
//   schema: Schema | undefined;      // ✅ schema definition
//   workspaceId: string;
//   onLog?: (action: LogAction, title: string, description: string) => void;
// }

// export function DataTable({
//   rows,
//   schema,
//   workspaceId,
//   onLog,
// }: DataTableProps) {
//   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
//   const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
//   const [autoResetOpen, setAutoResetOpen] = useState(false);
//   const [importOpen, setImportOpen] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Reset selection whenever rows change
//   useEffect(() => {
//     setRowSelection({});
//     setSelectedIds([]);
//   }, [rows]);

//   const handleImport = (file: File, method: string) => {
//     onLog?.(
//       "IMPORT",
//       "Data Imported",
//       `Imported file "${file.name}" via ${method}`
//     );
//   };

//   const handleAddRow = (data: Record<string, unknown>) => {
//     onLog?.(
//       "CREATE",
//       "New Row Created",
//       `Added row with fields: ${Object.keys(data).join(", ")}`
//     );
//   };

//   const handleDeleteRow = (id: string | number) => {
//     onLog?.("DELETE", "Row Deleted", `Removed row with id ${id}`);
//     setRowSelection((prev) => {
//       const copy = { ...prev } as Record<string, boolean>;
//       delete copy[String(id)];
//       return copy;
//     });
//   };

//   const handleDeleteSelected = () => {
//     if (selectedIds.length === 0) return;
//     onLog?.(
//       "DELETE",
//       "Rows Deleted",
//       `Removed ${selectedIds.length} row(s)`
//     );
//     setRowSelection({});
//     setSelectedIds([]);
//   };

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     onLog?.("REFRESH", "Table Refreshed", "Reloaded row list");
//     setTimeout(() => setIsRefreshing(false), 800);
//   };

//   const total = useMemo(() => (rows ? rows.length : 0), [rows]);

//   return (
//     <div className="space-y-4">
//       <TableToolbar
//         selectedCount={selectedIds.length}
//         onDeleteSelected={handleDeleteSelected}
//         onOpenAutoReset={() => setAutoResetOpen(true)}
//         onOpenImport={() => setImportOpen(true)}
//       />

//       <TableHeader projectUuid={workspaceId} />

//       <TableModals
//         autoResetOpen={autoResetOpen}
//         importOpen={importOpen}
//         onCloseAutoReset={() => setAutoResetOpen(false)}
//         onCloseImport={() => setImportOpen(false)}
//         onImport={handleImport}
//       />

//       <TableBody
//         rows={rows ?? []}             // ✅ safe default
//         schema={schema}
//         rowSelection={rowSelection}
//         setRowSelection={setRowSelection}
//         onSelectedIdsChange={setSelectedIds}
//         onAddRow={handleAddRow}
//         onDeleteRow={handleDeleteRow}
//       />

//       <TableFooter
//         total={total}
//         selectedCount={selectedIds.length}
//         isRefreshing={isRefreshing}
//         onToggleAll={(checked) => {
//           setRowSelection((prev) => {
//             if (checked) {
//               const next: Record<string, boolean> = {};
//               rows.forEach((r) => (next[String(r.id)] = true));
//               return next;
//             }
//             return {};
//           });
//         }}
//         onRefresh={handleRefresh}
//       />
//     </div>
//   );
// }

// export default DataTable;
// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import type { RowSelectionState } from "@tanstack/react-table";
// import { TableHeader } from "./table-header";
// import { TableToolbar } from "./table-toolbar";
// import { TableModals } from "./table-modals";
// import { TableBody } from "./table-body";
// import { TableFooter } from "./table-footer";
// import type { LogAction } from "@/types/dataSource";
// import type { Schema } from "@/service/apiSlide/schemaApi";

// interface DataTableProps {
//   projectUuid: string;
//   schema: Schema | undefined;
//   rows: Record<string, any>[];
//   onLog?: (action: LogAction, title: string, description: string) => void;
//   onAddRow: (row: Record<string, any>) => void;
//   onDeleteRow: (id: string | number) => void;
// }

// export function DataTable({
//   projectUuid,
//   schema,
//   rows: initialRows,
//   onLog,
//   onAddRow,
//   onDeleteRow,
// }: DataTableProps) {
//   const [rows, setRows] = useState<Record<string, any>[]>(initialRows);
//   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
//   const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
//   const [autoResetOpen, setAutoResetOpen] = useState(false);
//   const [importOpen, setImportOpen] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // sync when new rows come from API
//   useEffect(() => {
//     setRows(initialRows);
//     setRowSelection({});
//     setSelectedIds([]);
//   }, [initialRows]);

//   const commit = useCallback(
//     (next: Record<string, any>[]) => {
//       setRows(next);
//       // if you want to notify parent, do it here
//     },
//     []
//   );

//   const handleDeleteSelected = () => {
//     if (selectedIds.length === 0) return;
//     const next = rows.filter((r) => !selectedIds.includes(r.id));
//     commit(next);
//     onLog?.("DELETE", "Rows Deleted", `Removed ${selectedIds.length} record(s)`);
//     setRowSelection({});
//     setSelectedIds([]);
//   };

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     setRows(initialRows);
//     setRowSelection({});
//     setSelectedIds([]);
//     onLog?.("REFRESH", "Table Refreshed", "Reloaded records");
//     setTimeout(() => setIsRefreshing(false), 800);
//   };

//   const total = useMemo(() => rows.length, [rows]);

//   return (
//     <div className="space-y-4">

//       <TableToolbar
//         selectedCount={selectedIds.length}
//         onDeleteSelected={handleDeleteSelected}
//         onOpenAutoReset={() => setAutoResetOpen(true)}
//         onOpenImport={() => setImportOpen(true)}
//       />

//      <TableHeader
//   projectUuid={projectUuid}
//   activeTable={activeTable}
//   onTableChange={setActiveTable}
// />

//       {/* ✅ schema-aware table body */}
//       <TableBody
//         schema={schema}
//         rows={rows}
//         rowSelection={rowSelection}
//         setRowSelection={setRowSelection}
//         onSelectedIdsChange={setSelectedIds}
//         onAddRow={(row) => {
//           onAddRow(row);
//           commit([...rows, row]);
//         }}
//         onDeleteRow={(id) => {
//           onDeleteRow(id);
//           commit(rows.filter((r) => r.id !== id));
//         }}
//       />

//       <TableFooter
//         total={total}
//         selectedCount={selectedIds.length}
//         isRefreshing={isRefreshing}
//         onToggleAll={(checked) => {
//           setRowSelection((prev) => {
//             if (checked) {
//               const next: Record<string, boolean> = {};
//               rows.forEach((r) => (next[String(r.id)] = true));
//               return next;
//             }
//             return {};
//           });
//         }}
//         onRefresh={handleRefresh}
//       />

//       <TableModals
//         autoResetOpen={autoResetOpen}
//         importOpen={importOpen}
//         onCloseAutoReset={() => setAutoResetOpen(false)}
//         onCloseImport={() => setImportOpen(false)}
//         onImport={(file, method) =>
//           onLog?.("IMPORT", "Data Imported", `Imported ${file.name} via ${method}`)
//         }
//       />
//     </div>
//   );
// }
// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import type { RowSelectionState } from "@tanstack/react-table";
// import { TableHeader } from "./table-header";
// import { TableToolbar } from "./table-toolbar";
// import { TableModals } from "./table-modals";
// import { TableBody } from "./table-body";
// import { TableFooter } from "./table-footer";
// import type { LogAction } from "@/types/dataSource";
// import { useGetSchemasQuery } from "@/service/apiSlide/schemaApi";
// import { useGetSchemaRowsQuery } from "@/service/apiSlide/dataSourceApi";
// import type { Schema } from "@/service/apiSlide/schemaApi";
// import { skipToken } from "@reduxjs/toolkit/query";

// interface DataTableProps {
//   projectUuid: string;
//   onLog?: (action: LogAction, title: string, description: string) => void;
//   onAddRow?: (row: Record<string, any>) => void;
//   onDeleteRow?: (id: string | number) => void;
// }

// export function DataTable({
//   projectUuid,
//   onLog,
//   onAddRow,
//   onDeleteRow,
// }: DataTableProps) {
//   const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
//   const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
//   const [autoResetOpen, setAutoResetOpen] = useState(false);
//   const [importOpen, setImportOpen] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // 🔑 active schema tab
//   const [activeTable, setActiveTable] = useState<string>("");

//   // fetch schemas
//   const { data: schemas } = useGetSchemasQuery(projectUuid);

//   // fetch rows only for active schema
//   const { data: rowsData } = useGetSchemaRowsQuery(
//     activeTable
//       ? {
//           schemaName: activeTable,
//           projectUuid,
//           userUuid: "user-123", // TODO: from session
//           page: 1,
//           limit: 10,
//         }
//       : skipToken
//   );

//   const activeSchema: Schema | undefined = schemas?.find(
//     (s) => s.schemaDocId === activeTable
//   );

//   const rows = useMemo(() => rowsData?.data ?? [], [rowsData]);

//   const commit = useCallback(
//     (next: Record<string, any>[]) => {
//       // this updates local rows after add/delete
//       // (API will overwrite after refresh)
//     },
//     []
//   );

//   const handleDeleteSelected = () => {
//     if (selectedIds.length === 0) return;
//     onLog?.("DELETE", "Rows Deleted", `Removed ${selectedIds.length} record(s)`);
//     setRowSelection({});
//     setSelectedIds([]);
//   };

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     setRowSelection({});
//     setSelectedIds([]);
//     onLog?.("REFRESH", "Table Refreshed", "Reloaded records");
//     setTimeout(() => setIsRefreshing(false), 800);
//   };

//   const total = rows.length;

//   return (
//     <div className="space-y-4">
//       {/* 🔑 Schema Tabs */}
//       <TableHeader
//         projectUuid={projectUuid}
//         activeTable={activeTable}
//         onTableChange={setActiveTable}
//       />

//       {/* Toolbar (auto reset, import) */}
//       <TableToolbar
//         selectedCount={selectedIds.length}
//         onDeleteSelected={handleDeleteSelected}
//         onOpenAutoReset={() => setAutoResetOpen(true)}
//         onOpenImport={() => setImportOpen(true)}
//       />

//       {/* Table Body */}
//       <TableBody
//         schema={activeSchema}
//         rows={rows}
//         rowSelection={rowSelection}
//         setRowSelection={setRowSelection}
//         onSelectedIdsChange={setSelectedIds}
//         onAddRow={(row) => {
//           onAddRow?.(row);
//           commit([...rows, row]);
//         }}
//         onDeleteRow={(id) => {
//           onDeleteRow?.(id);
//           commit(rows.filter((r) => r.id !== id));
//         }}
//       />

//       {/* Footer */}
//       <TableFooter
//         total={total}
//         selectedCount={selectedIds.length}
//         isRefreshing={isRefreshing}
//         onToggleAll={(checked) => {
//           setRowSelection((prev) => {
//             if (checked) {
//               const next: Record<string, boolean> = {};
//               rows.forEach((r) => (next[String(r.id)] = true));
//               return next;
//             }
//             return {};
//           });
//         }}
//         onRefresh={handleRefresh}
//       />

//       {/* Modals */}
//       <TableModals
//         autoResetOpen={autoResetOpen}
//         importOpen={importOpen}
//         onCloseAutoReset={() => setAutoResetOpen(false)}
//         onCloseImport={() => setImportOpen(false)}
//         onImport={(file, method) =>
//           onLog?.("IMPORT", "Data Imported", `Imported ${file.name} via ${method}`)
//         }
//       />
//     </div>
//   );
// }

"use client";

import {  useMemo, useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { TableHeader } from "./table-header";
import { TableToolbar } from "./table-toolbar";
import { TableModals } from "./table-modals";
import { TableBody } from "./table-body";
import { TableFooter } from "./table-footer";
import type { LogAction } from "@/types/dataSource";
import type { Schema } from "@/service/apiSlide/schemaApi";
import { useGetSchemaRowsQuery } from "@/service/apiSlide/dataSourceApi";
import { skipToken } from "@reduxjs/toolkit/query";

interface DataTableProps {
  projectUuid: string;
  schema: Schema | undefined;
  onLog?: (action: LogAction, title: string, description: string) => void;
  onAddRow: (row: Record<string, any>) => void;
  onDeleteRow: (id: string | number) => void;
}

export function DataTable({
  projectUuid,
  schema,
  onLog,
  onAddRow,
  onDeleteRow,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [autoResetOpen, setAutoResetOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔑 active schema tab
  const [activeTable, setActiveTable] = useState<string>("");

  // fetch rows for active schema
  const { data: rowsData, refetch } = useGetSchemaRowsQuery(
    activeTable
      ? {
          schemaName: activeTable, // 🔑 must match schemaName from TableHeader
          projectUuid,
          userUuid: "user-123", // TODO: from session
          page: 1,
          limit: 10,
        }
      : skipToken
  );

  const rows = useMemo(() => rowsData?.data ?? [], [rowsData]);

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    onLog?.(
      "DELETE",
      "Rows Deleted",
      `Removed ${selectedIds.length} record(s)`
    );
    setRowSelection({});
    setSelectedIds([]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRowSelection({});
    setSelectedIds([]);
    onLog?.("REFRESH", "Table Refreshed", "Reloaded records");
    // setTimeout(() => setIsRefreshing(false), 800);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const total = rows.length;

  return (
    <div className="space-y-4">

      {/* Toolbar (auto reset, import) */}
      <TableToolbar
        selectedCount={selectedIds.length}
        onDeleteSelected={handleDeleteSelected}
        onOpenAutoReset={() => setAutoResetOpen(true)}
        onOpenImport={() => setImportOpen(true)}
      />

      <TableHeader
        projectUuid={projectUuid}
        activeTable={activeTable}
        onTableChange={setActiveTable}
      />

      {/* Table Body */}
      <TableBody
        schema={schema}
        rows={rows}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onSelectedIdsChange={setSelectedIds}
        onAddRow={row => onAddRow(row)}
        onDeleteRow={id => onDeleteRow(id)}
      />

      {/* Footer */}
      <TableFooter
        total={total}
        selectedCount={selectedIds.length}
        isRefreshing={isRefreshing}
        onToggleAll={checked => {
          if (checked) {
            setSelectedIds(rows.map(r => String(r.id)));
          } else {
            setSelectedIds([]);
          }
        }}
        onRefresh={handleRefresh}
      />

      {/* Modals */}
      <TableModals
        autoResetOpen={autoResetOpen}
        importOpen={importOpen}
        onCloseAutoReset={() => setAutoResetOpen(false)}
        onCloseImport={() => setImportOpen(false)}
        onImport={(file, method) =>
          onLog?.(
            "IMPORT",
            "Data Imported",
            `Imported ${file.name} via ${method}`
          )
        }
      />
    </div>
  );
}
