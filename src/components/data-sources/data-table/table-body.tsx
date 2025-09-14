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
import type { SampleProduct } from "@/types/dataSource";
import { AddRowForm } from "./add-row-form";

export function TableBody({
  products,
  rowSelection,
  setRowSelection,
  onSelectedIdsChange,
  onAddRow,
  onDeleteRow,
}: {
  products: SampleProduct[];
  rowSelection: RowSelectionState;
  setRowSelection: (updater: RowSelectionState | ((p: RowSelectionState) => RowSelectionState)) => void;
  onSelectedIdsChange: (ids: number[]) => void;
  onAddRow: (p: Omit<SampleProduct, "id">) => void;
  onDeleteRow: (id: number) => void;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<SampleProduct>>({});

  const handleEditRow = (product: SampleProduct) => {
    setEditingRow(product.id);
    setEditData(product);
  };

  const handleSaveEdit = () => {
    if (editingRow && editData) {
      // Here you would typically call an onUpdateRow prop
      // For now, we'll just log the updated data
      console.log('Saving edited data:', editData);
      setEditingRow(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditData({});
  };

  const columns = useMemo<ColumnDef<SampleProduct>[]>(() => {
    const selectCol: ColumnDef<SampleProduct> = {
      id: "_select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
          className="translate-y-[1px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
      size: 48,
      enableSorting: false,
      enableHiding: false,
    };

    const idCol: ColumnDef<SampleProduct> = {
      accessorKey: "id",
      header: () => <span className="text-slate-300 font-mediu">id</span>,
      cell: ({ getValue }) => (
        <span className="dark:text-gray-200 text-gray-600">{String(getValue())}</span>
      ),
    };

    const nameCol: ColumnDef<SampleProduct> = {
      accessorKey: "name",
      header: () => <span className="text-slate-300">name</span>,
      cell: ({ getValue, row }) => {
        if (editingRow === row.original.id) {
          return (
            <input
              type="text"
              value={editData.name || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-transparent border border-slate-400 rounded px-2 py-1 text-sm"
            />
          );
        }
        return (
          <span className="dark:text-gray-200 text-gray-600">{String(getValue() ?? "")}</span>
        );
      },
    };

    const priceCol: ColumnDef<SampleProduct> = {
      accessorKey: "price",
      header: () => <span className="text-slate-300">price</span>,
      cell: ({ getValue, row }) => {
        if (editingRow === row.original.id) {
          return (
            <input
              type="number"
              step="0.01"
              value={editData.price || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="w-full bg-transparent border border-slate-400 rounded px-2 py-1 text-sm"
            />
          );
        }
        const v = Number(getValue());
        return (
          <span className="dark:text-gray-200 text-gray-600">
            {`$${Number.isFinite(v) ? v.toFixed(2) : "0.00"}`}
          </span>
        );
      },
    };

    const dateCol: ColumnDef<SampleProduct> = {
      accessorKey: "created_date",
      header: () => <span className="text-slate-300">created_date</span>,
      cell: ({ getValue, row }) => {
        if (editingRow === row.original.id) {
          return (
            <input
              type="date"
              value={editData.created_date || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, created_date: e.target.value }))}
              className="w-full bg-transparent border border-slate-400 rounded px-2 py-1 text-sm"
            />
          );
        }
        return (
          <span className="dark:text-gray-200 text-gray-600">
            {String(getValue() ?? "")}
          </span>
        );
      },
    };

    const actionsCol: ColumnDef<SampleProduct> = {
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

    return [selectCol, idCol, nameCol, priceCol, dateCol, actionsCol];
  }, [onDeleteRow, editingRow, editData]);

  const table = useReactTable({
    data: products,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id),
    enableRowSelection: true,
  });

  // push selected ids up to the parent
  useEffect(() => {
    const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
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
                  (i === 0 || i === table.getFlatHeaders().length - 1 ? "w-12 " : "") +
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
                  flexRender(header.column.columnDef.header, header.getContext())
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 ${
                row.getIsSelected() ? "bg-slate-100 dark:bg-slate-750" : ""
              } ${editingRow === row.original.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
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
                    (cell.column.id !== "_select" && cell.column.id !== "_actions" ? "hover:border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-200 cursor-pointer " : "")
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

          {showAddForm && (
            <AddRowForm
              onSave={(p) => {
                onAddRow(p);
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