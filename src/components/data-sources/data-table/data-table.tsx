"use client";

import { useMemo, useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { TableHeader } from "./table-header";
import { TableToolbar } from "./table-toolbar";
import { TableModals } from "./table-modals";
import { TableBody } from "./table-body";
import { TableFooter } from "./table-footer";
import type { LogAction } from "@/types/dataSource";
import { useGetSchemasQuery, type Schema } from "@/service/apiSlide/schemaApi";
import {
  useGetSchemaRowsQuery,
  useInsertSchemaRowMutation,
} from "@/service/apiSlide/dataSourceApi";
import { skipToken } from "@reduxjs/toolkit/query";

interface DataTableProps {
  projectUuid: string;
  schema: Schema | undefined;
  onLog?: (action: LogAction, title: string, description: string) => void;
  // onAddRow is no longer a prop, will define the logic here
  onDeleteRow: (id: string | number) => void;
}

export function DataTable({
  projectUuid,
  // schema,
  onLog,
  onDeleteRow,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [autoResetOpen, setAutoResetOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // active schema tab
  const [activeTable, setActiveTable] = useState<string>("");

  //fetch all schemas for this project
  const { data: schemas } = useGetSchemasQuery(projectUuid);

  //find currently active schema
  const activeSchema = useMemo(
    () => schemas?.find(s => s.schemaName == activeTable),
    [schemas, activeTable]
  );

  // fetch rows only if schema selected
  const { data: rowsData, refetch } = useGetSchemaRowsQuery(
    activeTable
      ? {
          schemaName: activeTable, // match schemaName from TableHeader
          projectUuid,
          userUuid: "user-123", // TODO: replace with session user
          page: 1,
          limit: 10,
        }
      : skipToken
  );

  // Debug only rowsData
  console.log("📡 rowsData from API:", rowsData);

  const rows = useMemo(() => rowsData?.data ?? [], [rowsData]);
  const total = rows.length;

  // Initialize the RTK Query mutation hook
  const [insertSchemaRow, { isLoading: isAddingRow, error: addRowError }] =
    useInsertSchemaRowMutation();

  // Define the handler to add a row
  const handleAddRow = async (data: Record<string, unknown>) => {
    const schemaName = activeTable;
    const userUuid = "user-123"; // TODO: get this from auth session

    if (!schemaName || !projectUuid || !userUuid) {
      onLog?.(
        "ERROR",
        "Add Row Failed",
        "Missing schema, project, or user UUID."
      );
      return;
    }

    try {
      await insertSchemaRow({
        schemaName,
        projectUuid,
        userUuid,
        data,
      }).unwrap();

      onLog?.("CREATE", "Row Added", "A new record was successfully created.");

      // Refetch the data to show the new row in the table
      refetch();
    } catch (err) {
      console.error("Failed to add row:", err);
      onLog?.(
        "ERROR",
        "Failed to Add Row",
        "There was an error creating the record."
      );
    }
  };

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
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar (auto reset, import) */}
      <TableToolbar
        selectedCount={selectedIds.length}
        onDeleteSelected={handleDeleteSelected}
        onOpenAutoReset={() => setAutoResetOpen(true)}
        onOpenImport={() => setImportOpen(true)}
      />

      {/* Header with schema tabs */}
      <TableHeader
        projectUuid={projectUuid}
        // projectUuid={workspaceId}
        activeTable={activeTable}
        onTableChange={setActiveTable}
      />

      {/* Table Body with active schema*/}
      <TableBody
        // schema={schema}
        schema={activeSchema}
        rows={rows}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onSelectedIdsChange={setSelectedIds}
        onAddRow={handleAddRow}
        onDeleteRow={onDeleteRow}
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
