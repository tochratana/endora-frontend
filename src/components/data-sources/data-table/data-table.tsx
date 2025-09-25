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
  useDeleteSchemaRowMutation,
  useUpdateSchemaRowMutation,
} from "@/service/apiSlide/dataSourceApi";
import { skipToken } from "@reduxjs/toolkit/query";

interface DataTableProps {
  projectUuid: string;
  schema: Schema | undefined;
  onLog?: (action: LogAction, title: string, description: string) => void;
}

export function DataTable({ projectUuid, onLog }: DataTableProps) {
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
  const userUuid = "user-123";
  const { data: rowsData, refetch } = useGetSchemaRowsQuery(
    activeTable
      ? {
          schemaName: activeTable, // match schemaName from TableHeader
          projectUuid,
          userUuid, // replace with session user
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
  // const [insertSchemaRow, { isLoading: isAddingRow, error: addRowError }] =
  //   useInsertSchemaRowMutation();
  const [insertSchemaRow] = useInsertSchemaRowMutation();
  const [deleteSchemaRow] = useDeleteSchemaRowMutation();
  const [updateSchemaRow] = useUpdateSchemaRowMutation();

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

  //Define the handler for deleting a row
  const handleDeleteRow = async (id: string | number) => {
    if (!activeSchema) {
      console.error("No active schema to delete from.");
      return;
    }
    try {
      await deleteSchemaRow({
        schemaName: activeSchema.schemaName,
        projectUuid,
        userUuid: "user-123", //replace with session user
        id,
      }).unwrap();

      // Log a success message to the browser console
      console.log(`DELETE Record ${id} deleted successfully.`);

      // Log the action to the UI's activity log
      onLog?.("DELETE", "Row Deleted", `Removed record ${id}`);

      // Refetch data to update the table immediately
      refetch();
    } catch (err: unknown) {
      console.error(`Error deleting record ${id}:`, err);

      // Log the error action to the UI
      onLog?.(
        "ERROR",
        "Failed to Delete Row",
        `Failed to delete record ${id}.`
      );
    }
  };

  // delete all selected rows
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    //Loop through each selected ID and call the delete handler
    for (const id of selectedIds) {
      await handleDeleteRow(id);
    }

    onLog?.(
      "DELETE",
      "Rows Deleted",
      `Removed ${selectedIds.length} record(s)`
    );
    // After deletion, reset the selection state
    setRowSelection({});
    setSelectedIds([]);
  };

  //refresh
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

  // const handleSaveEdit = async () => {
  //   if (!editingRow || !activeSchema) return;
  //   try {
  //     await updateSchemaRow({
  //       schemaName: activeSchema.schemaName,
  //       projectUuid,
  //       userUuid: "user-123",
  //       id: editingRow,
  //       data: editData,
  //     }).unwrap();

  //     onLog?.("UPDATE", "Row Updated", `Updated record ${editingRow}`);
  //     setEditingRow(null); // Exit edit mode
  //     setEditData({}); // Clear edit data
  //     refetch(); // Refetch to show the updated data
  //   } catch (err: any) {
  //     console.error("Failed to update row:", err);
  //     onLog?.(
  //       "ERROR",
  //       "Failed to Update Row",
  //       "There was an error updating the record."
  //     );
  //   }
  // };

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
        schema={activeSchema}
        rows={rows}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onSelectedIdsChange={setSelectedIds}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        updateSchemaRow={updateSchemaRow}
        // updateMutation={updateSchemaRow}
        projectUuid={projectUuid}
        refetch={refetch}
        onLog={onLog}
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
