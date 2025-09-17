"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit } from "lucide-react";
import { AddRowForm } from "./add-row-form";
import { cn } from "@/lib/utils";

import type { DataSourceRecord } from "@/service/apiSlide/dataSourceApi";
import type { Schema } from "@/service/apiSlide/schemaApi";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRow, setEditingRow] = useState<string | number | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});

  const handleEditRow = (row: DataSourceRecord) => {
    setEditingRow(row.id);
    setEditData(row);
  };

  const handleSaveEdit = () => {
    if (editingRow && editData) {
      // TODO: connect to update API
      console.log("Saving edited data:", editData);
      setEditingRow(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };


  const handleSaveNewRow = () => {
  if (Object.keys(editData).length === 0) {
    setShowAddForm(false);
    return;
  }

  const newRow = {
    id: crypto.randomUUID(),
    ...editData,
    created_at: new Date().toISOString(),
  };

  onAddRow(newRow);   // ✅ bubble up to DataTable
  setEditData({});
  setShowAddForm(false);
};

const handleCancelNewRow = () => {
  setEditData({});
  setShowAddForm(false);
};



  // 🔑 Keep your original styled columns
  const columns = useMemo<ColumnDef<DataSourceRecord>[]>(() => {
    const selectCol: ColumnDef<DataSourceRecord> = {
      id: "_select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={v => table.toggleAllRowsSelected(!!v)}
          className="translate-y-[1px]"
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
      enableSorting: false,
      enableHiding: false,
    };

    // Dynamically build schema columns but render like your original UI
    const schemaCols: ColumnDef<DataSourceRecord>[] = Object.keys(
      schema?.columns ?? {}
    ).map(colName => ({
      accessorKey: colName,
      header: () => <span className="text-slate-300">{colName}</span>,
      cell: ({ getValue, row }) => {
        if (editingRow === row.original.id) {
          return (
            <input
              type="text"
              value={editData[colName] ?? ""}
              onChange={e =>
                setEditData(prev => ({ ...prev, [colName]: e.target.value }))
              }
              className="w-full bg-transparent border border-slate-400 rounded px-2 py-1 text-sm"
            />
          );
        }

        // ✅ Preserve your original formatting
        if (colName === "price") {
          const v = Number(getValue());
          return (
            <span className="dark:text-gray-200 text-gray-600">
              {`$${Number.isFinite(v) ? v.toFixed(2) : "0.00"}`}
            </span>
          );
        }

        return (
          <span className="dark:text-gray-200 text-gray-600">
            {String(getValue() ?? "")}
          </span>
        );
      },
    }));

    const actionsCol: ColumnDef<DataSourceRecord> = {
      id: "_actions",
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          {editingRow === row.original.id ? (
            <>
              <button
                className="text-slate-500 hover:text-green-400 p-1 rounded transition-colors"
                title="Save"
                onClick={handleSaveEdit}
              >
                ✓
              </button>
              <button
                className="text-slate-500 hover:text-gray-400 p-1 rounded transition-colors"
                title="Cancel"
                onClick={handleCancelEdit}
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <button
                className="text-slate-500 hover:text-blue-400 p-1 rounded transition-colors"
                title="Edit"
                onClick={() => handleEditRow(row.original)}
              >
                <Edit size={14} />
              </button>
              <button
                className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
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
      enableSorting: false,
      enableHiding: false,
    };

    return [selectCol, ...schemaCols, actionsCol];
  }, [schema, editingRow, editData, onDeleteRow]);

  const table = useReactTable({
    data: rows ?? [],
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => String(row.id),
    enableRowSelection: true,
  });

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
          {/* Add Row Form - positioned right after header for better UX */}
          {/* {showAddForm && (
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20">
              {table.getFlatHeaders().map((header, i) => (
                <td
                  key={header.id}
                  className={
                    "p-3 " +
                    (i === 0 || i === table.getFlatHeaders().length - 1
                      ? "w-12 "
                      : "") +
                    "border-r border-slate-200 dark:border-slate-600"
                  }
                >
                  {header.id === "_select" ? (
                    // Empty cell for checkbox column
                    <div className="w-6 h-6"></div>
                  ) : header.id === "_actions" ? (
                    // Action buttons
                    <div className="flex items-center justify-center gap-1">
                      <button
                        // onClick={handleSaveNewRow}
                        className="text-green-500 hover:text-green-300 p-1 rounded transition-colors"
                        title="Save"
                      >
                        ✓
                      </button>
                      <button
                        // onClick={handleCancelNewRow}
                        className="text-red-500 hover:text-red-300 p-1 rounded transition-colors"
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    // Input fields for schema columns
                    <input
                      type={header.id === "price" ? "number" : "text"}
                      placeholder={`Enter ${header.id}...`}
                      value={editData[header.id] ?? ""}
                      onChange={e =>
                        setEditData(prev => ({
                          ...prev,
                          [header.id]: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent border border-slate-400 rounded px-2 py-1 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
                      autoFocus={i === 1} // Focus first input field
                    />
                  )}
                </td>
              ))}
            </tr>
          )} */}

          {showAddForm && (
  <AddRowForm
    schema={schema}
    onSave={(row) => {
      onAddRow(row);      // ✅ bubble up
      setShowAddForm(false);
    }}
    onCancel={() => setShowAddForm(false)}
  />
)}


          {/* Regular table rows */}
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 ${
                row.getIsSelected() ? "bg-slate-100 dark:bg-slate-750" : ""
              } ${
                editingRow === row.original.id
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : ""
              }`}
            >
              {row.getVisibleCells().map((cell, i) => (
                <td
                  key={cell.id}
                  className={
                    "p-3 " +
                    (i < row.getVisibleCells().length - 1
                      ? "border-r border-slate-200 dark:border-slate-700 text-gray-900 "
                      : "") +
                    (["id", "price", "created_date"].includes(cell.column.id)
                      ? "font-lexend  "
                      : "") +
                    (cell.column.id === "name"
                      ? "text-gray-800 dark:text-white  "
                      : "text-gray-600 dark:text-gray-300 ") +
                    (cell.column.id === "_actions" ? "text-center " : "") +
                    (cell.column.id !== "_select" &&
                    cell.column.id !== "_actions"
                      ? "hover:border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer "
                      : "")
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}