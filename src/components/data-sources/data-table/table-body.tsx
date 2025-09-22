"use client";

import { useEffect, useMemo, useState } from "react";
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

import type { DataSourceRecord } from "@/service/apiSlide/dataSourceApi";
import type { Schema } from "@/service/apiSlide/schemaApi";

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
}) {
  // Local UI state for editing and adding rows
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRow, setEditingRow] = useState<string | number | null>(null);
  const [editData, setEditData] = useState<Record<string, unknown>>({});

  // Row edit handlers
  const handleEditRow = (row: DataSourceRecord) => {
    setEditingRow(row.id);
    setEditData(row);
  };

  const handleSaveEdit = () => {
    if (editingRow && editData) {
      // TODO: hook up API call for update
      console.log("Saving edited data:", editData);
      setEditingRow(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  /**
   * --- Table columns ---
   * Dynamically built from schema, but always ensure:
   *  1. Checkbox select column is first
   *  2. "id" column is forced to appear before other schema fields
   *  3. Actions (edit/delete) column is last
   */
  const columns = useMemo<ColumnDef<DataSourceRecord>[]>(() => {
    // 1. Row select checkbox column
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
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              id
            </span>
            <Badge
              variant="secondary"
              className={`text-xs rounded-xs font-mono ${getTypeColor(
                schema.columns["id"]
              )}`}
            >
              {schema.columns["id"].split(" ")[0]}
            </Badge>
          </div>
        ),
        cell: ({ getValue }) => (
          <span className="font-mono text-gray-500 dark:text-gray-400">
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
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {colName}
              </span>
              {schema?.columns?.[colName] && (
                <Badge
                  variant="secondary"
                  className={`text-xs rounded-xs font-mono ${getTypeColor(
                    schema.columns[colName]
                  )}`}
                >
                  {schema.columns[colName].split(" ")[0]}
                </Badge>
              )}
            </div>
          ),
          cell: (ctx: CellContext<DataSourceRecord, unknown>) => {
            const value = ctx.getValue();
            const row = ctx.row;

            // If row is currently in edit mode → render editable input
            if (editingRow === row.original.id) {
              return (
                <input
                  type="number"
                  value={editData[colName] as string | number ?? ""}
                  onChange={e =>
                    setEditData(prev => ({
                      ...prev,
                      [colName]: e.target.value,
                    }))
                  }
                  step="0.01"
                  className="w-full bg-transparent border border-slate-400 rounded px-2 py-1 text-sm"
                />
              );
            }

            // Special formatting for price column (this one can not increase as decimal yet)
            if (colName === "price") {
              const v = Number(value);
              return (
                <span className="dark:text-gray-200 text-gray-600">
                  {`$${Number.isFinite(v) ? v.toFixed(2) : "0.00"}`}
                </span>
              );
            }

            return (
              <span className="dark:text-gray-200 text-gray-600">
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
        <div className="flex items-center justify-center gap-1">
          {editingRow === row.original.id ? (
            <>
              <button
                className="text-slate-500 hover:text-green-400 p-1 rounded"
                title="Save"
                onClick={handleSaveEdit}
              >
                <Check size={14} />
              </button>
              <button
                className="text-slate-500 hover:text-gray-400 p-1 rounded"
                title="Cancel"
                onClick={handleCancelEdit}
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                className="text-slate-500 hover:text-blue-400 p-1 rounded"
                title="Edit"
                onClick={() => handleEditRow(row.original)}
              >
                <Edit size={14} />
              </button>
              <button
                className="text-slate-500 hover:text-red-400 p-1 rounded"
                title="Delete"
                onClick={() => onDeleteRow(row.original.id)}
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      ),
      size: 80,
    };

    return [selectCol, ...schemaCols, actionsCol];
  }, [schema, editingRow, editData, onDeleteRow]);

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
      <table className="w-full border-collapse text-gray-800 dark:text-white">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700">
            {table.getFlatHeaders().map((header, i) => (
              <th
                key={header.id}
                className={
                  "p-3 " +
                  (i === 0 || i === table.getFlatHeaders().length - 1
                    ? "w-12 "
                    : "") +
                  "border-r border-slate-200 dark:border-slate-600 text-left text-slate-700 dark:text-slate-300 font-medium"
                }
              >
                {header.id === "_actions" ? (
                  // Right-side "Add row" button
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="float-right text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 p-1 rounded transition-colors"
                    title="Add new row"
                  >
                    <Plus size={16} />
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
                  className="p-3 border-r border-slate-200 dark:border-slate-700 text-sm"
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
  );
}
