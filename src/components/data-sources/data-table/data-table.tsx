"use client";

import { useMemo, useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { useTheme } from "next-themes";
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
  useImportDataMutation,
} from "@/service/apiSlide/dataSourceApi";
import { skipToken } from "@reduxjs/toolkit/query";
// import { useCallback } from "react";
// import { isFetchBaseQueryError } from '@reduxjs/toolkit/query';

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

  //active schema tab
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
  const handleJsonEditorInsert = async (schemaName: string, data: any) => {
    try {
      const dataArray = Array.isArray(data) ? data : [data];

      // Insert each record
      for (const record of dataArray) {
        await insertSchemaRow({
          schemaName,
          projectUuid,
          userUuid: "user-123",
          data: record,
        }).unwrap();
      }

      onLog?.(
        "CREATE",
        "JSON Editor Insert",
        `Successfully inserted ${dataArray.length} record(s) into ${schemaName}`
      );

      refetch();
    } catch (error) {
      console.error("JSON Editor insert failed:", error);
      throw error; // Re-throw to let the sidebar handle the error notification
    }
  };

  // Debug only rowsData
  console.log("[rowsData] from API:", rowsData);

  const rows = useMemo(() => rowsData?.data ?? [], [rowsData]);
  const total = rows.length;

  // Initialize the RTK Query mutation hook
  // const [insertSchemaRow, { isLoading: isAddingRow, error: addRowError }] =
  //   useInsertSchemaRowMutation();
  const [insertSchemaRow] = useInsertSchemaRowMutation();
  const [deleteSchemaRow] = useDeleteSchemaRowMutation();
  const [updateSchemaRow] = useUpdateSchemaRowMutation();
  const [importData, { isLoading: isImporting }] = useImportDataMutation();

  // TODO json editor :
  const { resolvedTheme } = useTheme();

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
    // const displayId = name || id; // Use the name if available, otherwise use the ID

    if (!activeSchema) {
      console.error("No active schema to delete from.");
      return;
    }

    // Find the row object from the local state before deletion
    const rowToDelete = rows.find(row => row.id === id);

    // Determine the name for the log.
    const rowName = rowToDelete
      ? "name" in rowToDelete && typeof rowToDelete.name === "string"
        ? rowToDelete.name
        : "title" in rowToDelete && typeof rowToDelete.title === "string"
          ? rowToDelete.title
          : String(id)
      : String(id);
    const displayId = rowName; // Use the found name or the ID as the display name.

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
      onLog?.("DELETE", "Row Deleted", `Removed record ${displayId}`);

      refetch();
    } catch (err: unknown) {
      console.error(`Error deleting record ${id}:`, err);

      // Log the error action to the UI
      onLog?.(
        "ERROR",
        "Failed to Delete Row",
        `Failed to delete record ${displayId}.`
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

  const isFetchBaseQueryError = (
    error: unknown
  ): error is { status: number | string; data: unknown } => {
    return typeof error === "object" && error !== null && "status" in error;
  };
  //handle import action
  const handleImportFile = async (file: File, method: string) => {
    if (!activeSchema) return;

    try {
      await importData({
        projectUuid,
        schemaName: activeSchema.schemaName,
        importMethod: method,
        file,
      }).unwrap();

      onLog?.(
        "IMPORT",
        "Data Import Successful",
        `Imported ${file.name} using ${method} method.`
      );

      // Refresh the table after successful import
      refetch();
    } catch (error: unknown) {
      // Use unknown for type safety

      let displayMessage =
        "Import failed. Check network tab for error details.";

      // 🔑 FIX: Use the local type guard
      if (isFetchBaseQueryError(error)) {
        const status = error.status;

        // Now it's safe to check the data property if it exists
        if (error.data && typeof error.data === "object") {
          const dataObj = error.data as Record<string, unknown>;

          // Check for common backend message fields: 'error', 'message'
          if ("error" in dataObj && typeof dataObj.error === "string") {
            displayMessage = dataObj.error;
          } else if (
            "message" in dataObj &&
            typeof dataObj.message === "string"
          ) {
            displayMessage = dataObj.message;
          } else {
            displayMessage = `Server rejected request (Status: ${status}).`;
          }
        } else {
          displayMessage = `API Error (Status: ${status}).`;
        }
      } else if (error instanceof Error) {
        // General JavaScript error (e.g., network timeout)
        displayMessage = error.message;
      }

      // console.error("❌ File import failed:", displayMessage, error);

      onLog?.(
        "ERROR",
        "Import Failed",
        `Failed to import data: ${displayMessage}`
      );
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
        workspaceId={projectUuid}
        schemas={schemas}
        projectUuid={projectUuid}
        onInsertData={handleJsonEditorInsert}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
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
        updateSchemaRow={async args => {
          const result = await updateSchemaRow(args).unwrap();
          return { data: result };
        }}
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
        onImport={handleImportFile}
      />
    </div>
  );
}
