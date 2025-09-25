"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  ColumnDef,
  RowSelectionState,
  CellContext,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit, Check, X } from "lucide-react";
import { AddRowForm } from "./add-row-form";
import { Badge } from "@/components/ui/badge";

import type {
  DataSourceRecord,
  UpdateDataRequest,
} from "@/service/apiSlide/dataSourceApi";
import type { Schema } from "@/service/apiSlide/schemaApi";
import type { LogAction } from "@/types/dataSource";

// Utility: map SQL types → color-coded badge classes
const getTypeColor = (type: string) => {
  const lower = type.toLowerCase();
  if (lower.includes("serial") || lower.includes("int"))
    return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300";
  if (lower.includes("varchar") || lower.includes("text"))
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (lower.includes("numeric") || lower.includes("decimal"))
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  if (lower.includes("timestamp") || lower.includes("date"))
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
  if (lower.includes("boolean"))
    return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
  return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
};

export function TableBody({
  rows,
  schema,
  rowSelection,
  setRowSelection,
  onSelectedIdsChange,
  onAddRow,
  onDeleteRow,
  updateSchemaRow,
  projectUuid,
  refetch,
  onLog,
}: {
  rows: DataSourceRecord[];
  schema: Schema | undefined;
  rowSelection: RowSelectionState;
  setRowSelection: (
    updater: RowSelectionState | ((p: RowSelectionState) => RowSelectionState)
  ) => void;
  onSelectedIdsChange: (ids: (string | number)[]) => void;
  onAddRow: (data: Record<string, unknown>) => void;
  onDeleteRow: (id: string | number) => void;
  updateSchemaRow: (args: UpdateDataRequest) => Promise<any>;
  projectUuid: string;
  refetch: () => void;
  onLog?: (action: LogAction, title: string, description: string) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRow, setEditingRow] = useState<string | number | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});
  const userUuid = "user-123";

  // All editing handlers and state
  const handleEditRow = useCallback((row: DataSourceRecord) => {
    setEditingRow(row.id);
    setEditData(row);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingRow || !editData || !schema) return;
    try {
      await updateSchemaRow({
        schemaName: schema.schemaName,
        projectUuid,
        userUuid,
        id: editingRow,
        data: editData,
      }).unwrap();

      if (onLog) {
        onLog("UPDATE", "Row Updated", `Updated record ${editingRow}`);
      }

      setEditingRow(null);
      setEditData({});
      refetch();
    } catch (err: any) {
      console.error("Failed to save edit:", err);
      if (onLog) {
        onLog(
          "ERROR",
          "Failed to Update Row",
          "There was an error updating the record."
        );
      }
    }
  }, [
    editingRow,
    editData,
    schema,
    projectUuid,
    userUuid,
    updateSchemaRow,
    onLog,
    refetch,
  ]);

  const handleCancelEdit = useCallback(() => {
    setEditingRow(null);
    setEditData({});
  }, []);

  /**
   * --- Table columns ---
   * Dynamically built from schema, but always ensure:
   *  1. Checkbox select column is first
   *  2. "id" column is forced to appear before other schema fields
   *  3. Actions (edit/delete) column is last
   */

  const columns = useMemo<ColumnDef<DataSourceRecord>[]>(() => {
    // 1. Row select checkbox columns
    const selectCol: ColumnDef<DataSourceRecord> = {
      id: "_select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={v => table.toggleAllRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={v => row.toggleSelected(!!v)}
        />
      ),
      size: 48,
    };

    // 2. Schema-driven columns
    const schemaCols: ColumnDef<DataSourceRecord>[] = [];

    // force "id" column first if present
    if (schema?.columns?.id) {
      schemaCols.push({
        accessorKey: "id",
        header: () => (
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
              id
            </span>
            <Badge
              variant="secondary"
              className={`text-xs rounded-xs font-mono ${getTypeColor(
                schema.columns["id"]
              )} hidden sm:inline-flex`}
            >
              {schema.columns["id"].split(" ")[0]}
            </Badge>
          </div>
        ),
        cell: ({ getValue }) => (
          <span className="font-mono text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            {String(getValue() ?? "")}
          </span>
        ),
      });
    }

    // render all other schema columns
    Object.keys(schema?.columns ?? {})
      .filter(c => c !== "id")
      .forEach(colName => {
        schemaCols.push({
          accessorKey: colName,
          header: () => (
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">
                {colName}
              </span>
              {schema?.columns?.[colName] && (
                <Badge
                  variant="secondary"
                  className={`text-xs rounded-xs font-mono ${getTypeColor(
                    schema.columns[colName]
                  )} hidden sm:inline-flex`}
                >
                  {schema.columns[colName].split(" ")[0]}
                </Badge>
              )}
            </div>
          ),
          cell: (ctx: CellContext<DataSourceRecord, unknown>) => {
            const value = ctx.getValue();
            const row = ctx.row;

            if (editingRow === row.original.id) {
              let inputType = "text";
              const colType = schema?.columns?.[colName]?.toLowerCase();
              if (
                colType?.includes("decimal") ||
                colType?.includes("numeric")
              ) {
                inputType = "number";
              } else if (
                colType?.includes("timestamp") ||
                colType?.includes("date")
              ) {
                inputType = "date";
              } else if (colType?.includes("boolean")) {
                // Note: You might want to use a checkbox component here
                inputType = "text";
              }

              return (
                <input
                  //Use the dynamically determined inputType
                  // type={inputType}
                  value={(editData[colName] as string | number) ?? ""}
                  onChange={e =>
                    setEditData(prev => ({
                      ...prev,
                      [colName]: e.target.value,
                    }))
                  }
                  step={inputType === "number" ? "0.01" : undefined}
                  className="w-full bg-transparent border border-slate-400 rounded px-1 sm:px-2 py-1 text-xs sm:text-sm"
                />
              );
            }

            if (colName === "price") {
              const v = Number(value);
              return (
                <span className="dark:text-gray-200 text-gray-600 text-xs sm:text-sm">
                  {`$${Number.isFinite(v) ? v.toFixed(2) : "0.00"}`}
                </span>
              );
            }

            return (
              <span
                className="dark:text-gray-200 text-gray-600 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none"
                title={String(value ?? "")}
              >
                {String(value ?? "")}
              </span>
            );
          },
        });
      });

    // 3. Actions column (edit/delete)
    const actionsCol: ColumnDef<DataSourceRecord> = {
      id: "_actions",
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          {editingRow === row.original.id ? (
            <>
              <button
                className="text-slate-500 hover:text-green-400 p-0.5 sm:p-1 rounded"
                title="Save"
                onClick={handleSaveEdit}
              >
                <Check size={12} className="sm:hidden" />
                <Check size={14} className="hidden sm:block" />
              </button>
              <button
                className="text-slate-500 hover:text-gray-400 p-0.5 sm:p-1 rounded"
                title="Cancel"
                onClick={handleCancelEdit}
              >
                <X size={12} className="sm:hidden" />
                <X size={14} className="hidden sm:block" />
              </button>
            </>
          ) : (
            <>
              <button
                className="text-slate-500 hover:text-blue-400 p-0.5 sm:p-1 rounded"
                title="Edit"
                onClick={() => handleEditRow(row.original)}
              >
                <Edit size={12} className="sm:hidden" />
                <Edit size={14} className="hidden sm:block" />
              </button>
              <button
                className="text-slate-500 hover:text-red-400 p-0.5 sm:p-1 rounded"
                title="Delete"
                onClick={() => onDeleteRow(row.original.id)}
              >
                <Trash2 size={12} className="sm:hidden" />
                <Trash2 size={14} className="hidden sm:block" />
              </button>
            </>
          )}
        </div>
      ),
      size: 80,
    };

    return [selectCol, ...schemaCols, actionsCol];
  }, [
    schema,
    editingRow,
    editData,
    onDeleteRow,
    handleSaveEdit,
    handleCancelEdit,
    handleEditRow,
  ]);

  // React Table setup
  const table = useReactTable({
    data: rows ?? [],
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => String(row.id),
    enableRowSelection: true,
  });

  // Sync selected row IDs back to parent component
  useEffect(() => {
    const ids = table.getSelectedRowModel().rows.map(r => r.original.id);
    onSelectedIdsChange(ids);
  }, [rowSelection, table, onSelectedIdsChange]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-gray-800 dark:text-white">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
              {table.getFlatHeaders().map((header, i) => (
                <th
                  key={header.id}
                  className={
                    "p-2 sm:p-3 " +
                    (i === 0 || i === table.getFlatHeaders().length - 1
                      ? "w-10 sm:w-12 "
                      : "") +
                    "border-r border-slate-200 dark:border-slate-600 text-left text-slate-700 dark:text-slate-300 font-medium"
                  }
                >
                  {header.id === "_actions" ? (
                    // Right-side "Add row" button
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="float-right text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 p-0.5 sm:p-1 rounded transition-colors"
                      title="Add new row"
                    >
                      <Plus size={14} className="sm:hidden" />
                      <Plus size={16} className="hidden sm:block" />
                    </button>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Real API rows */}
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600
                  ${row.getIsSelected() ? "bg-slate-100 dark:bg-slate-600" : ""}
                  ${editingRow === row.original.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="p-2 sm:p-3 border-r border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {/* Inline "add row" form */}
            {showAddForm && (
              <AddRowForm
                schema={schema}
                onSave={data => {
                  onAddRow(data);
                  setShowAddForm(false);
                }}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
