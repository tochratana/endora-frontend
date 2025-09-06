"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ClipboardList,
  Clock,
  Download,
  RefreshCcw,
  Plus,
  Play,
  Edit2,
  Trash2,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";

import { ScheduleAutoResetModal } from "../popup/autoResetSchedule";
import { ImportDataModal } from "../popup/importDataModel";
import type { SampleProduct, LogAction } from "@/types/dataSource";
import Input from "../ui/input";

interface DataTableProps {
  products: SampleProduct[];
  onProductsChange?: (next: SampleProduct[]) => void;
  onLog?: (action: LogAction, title: string, description: string) => void;
}

type NewProductForm = {
  name: string;
  price: string;
  created_date: string;
};

const todayLocalISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
};

export function DataTable({
  products: initialProducts,
  onProductsChange,
  onLog,
}: DataTableProps) {
  const [products, setProducts] = useState<SampleProduct[]>(initialProducts);
  // const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProductForm>({
    name: "",
    price: "",
    created_date: todayLocalISO(),
  });

  const [autoResetOpen, setAutoResetOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  // sync when parent updates
  useEffect(() => {
    setProducts(initialProducts);
    // setSelectedRows(new Set());
    setRowSelection({});
  }, [initialProducts]);

  const commit = (next: SampleProduct[]) => {
    setProducts(next);
    onProductsChange?.(next);
  };

  const handleImport = (file: File, method: string) => {
    onLog?.(
      "IMPORT",
      "Data Imported",
      `Imported file "${file.name}" via ${method}`
    );
  };

  // const isAllSelected = useMemo(
  //   () => products.length > 0 && selectedRows.size === products.length,
  //   [products.length, selectedRows.size]
  // );
  // const isIndeterminate = useMemo(
  //   () => selectedRows.size > 0 && selectedRows.size < products.length,
  //   [products.length, selectedRows.size]
  // );

  // const handleSelectAll = (checked: boolean) =>
  //   setSelectedRows(checked ? new Set(products.map((p) => p.id)) : new Set());

  // const handleSelectRow = (id: number, checked: boolean) => {
  //   setSelectedRows((prev) => {
  //     const next = new Set(prev);
  //     checked ? next.add(id) : next.delete(id);
  //     return next;
  //   });
  // };

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
      header: () => <span className="text-slate-300 font-medium">id</span>,
      cell: ({ getValue }) => (
        <span className="text-slate-200 font-mono">{String(getValue())}</span>
      ),
    };

    const nameCol: ColumnDef<SampleProduct> = {
      accessorKey: "name",
      header: () => <span className="text-slate-300 font-medium">name</span>,
      cell: ({ getValue }) => (
        <span className="text-white">{String(getValue() ?? "")}</span>
      ),
    };

    const priceCol: ColumnDef<SampleProduct> = {
      accessorKey: "price",
      header: () => <span className="text-slate-300 font-medium">price</span>,
      cell: ({ getValue }) => {
        const v = Number(getValue());
        return (
          <span className="text-white font-mono">
            {`$${Number.isFinite(v) ? v.toFixed(2) : "0.00"}`}
          </span>
        );
      },
    };

    const dateCol: ColumnDef<SampleProduct> = {
      accessorKey: "created_date",
      header: () => (
        <span className="text-slate-300 font-medium">created_date</span>
      ),
      cell: ({ getValue }) => (
        <span className="text-slate-300 font-mono">
          {String(getValue() ?? "")}
        </span>
      ),
    };

    const actionsCol: ColumnDef<SampleProduct> = {
      id: "_actions",
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <button
            className="text-slate-400 hover:text-blue-400 p-1 rounded transition-colors"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors"
            title="Delete"
            onClick={() => {
              const product = row.original;
              const next = products.filter((p) => p.id !== product.id);
              commit(next);
              onLog?.(
                "DELETE",
                "Product Deleted",
                `Removed ${product.name} (id ${product.id})`
              );
              setRowSelection((prev) => {
                const n = { ...prev };
                delete (n as any)[String(product.id)];
                return n;
              });
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
      size: 56,
      enableSorting: false,
      enableHiding: false,
    };

    return [selectCol, idCol, nameCol, priceCol, dateCol, actionsCol];
  }, [products, onLog]);

  const table = useReactTable({
    data: products,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id), // stable selection
    enableRowSelection: true,
  });


  const handleAddProduct = () => {
    const price = parseFloat(newProduct.price);
    if (!newProduct.name.trim() || Number.isNaN(price)) return;

    const newId = Math.max(0, ...products.map(p => p.id)) + 1;
    const p: SampleProduct = {
      id: newId,
      name: newProduct.name.trim(),
      price: parseFloat(price.toFixed(2)),
      created_date: newProduct.created_date || todayLocalISO(),
    };
    commit([...products, p]);
    onLog?.(
      "CREATE",
      "New Product Created",
      `Added ${p.name} ($${p.price.toFixed(2)})`
    );

    setNewProduct({ name: "", price: "", created_date: todayLocalISO() });
    setShowAddForm(false);
  };

  
  const handleDeleteSelected = () => {
  
    // if (selectedRows.size === 0) return;
    // const next = products.filter(p => !selectedRows.has(p.id));
    // commit(next);
    // onLog?.(
    //   "DELETE",
    //   "Products Deleted",
    //   `Removed ${selectedRows.size} product(s)`
    // );
    // setSelectedRows(new Set());
     const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
    if (ids.length === 0) return;
    const next = products.filter((p) => !ids.includes(p.id));
    commit(next);
    onLog?.("DELETE", "Products Deleted", `Removed ${ids.length} product(s)`);
    setRowSelection({});
  };

  return (
   <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center">
            <ClipboardList size={14} className="text-slate-400" aria-hidden />
          </span>
          <span className="text-sm text-slate-300">products collection</span>
        </div>
        <div className="flex gap-2">
          {table.getSelectedRowModel().rows.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              <Trash2 size={14} aria-hidden />
              Delete ({table.getSelectedRowModel().rows.length})
            </button>
          )}

          <button
            onClick={() => setAutoResetOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 rounded text-sm hover:bg-slate-600 transition-colors"
          >
            <Clock size={14} aria-hidden />
            Auto Reset
          </button>

          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white rounded text-sm hover:bg-teal-700 transition-colors"
          >
            <Download size={14} aria-hidden />
            Import File
          </button>
        </div>
      </div>

      {/* Modals */}
      <ScheduleAutoResetModal
        isOpen={autoResetOpen}
        onClose={() => setAutoResetOpen(false)}
      />
      <ImportDataModal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
      />

      {/* Table */}
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-600 bg-slate-750">
              {table.getFlatHeaders().map((header, i) => (
                <th
                  key={header.id}
                  className={
                    "p-3 " +
                    (i === 0 || i === table.getFlatHeaders().length - 1
                      ? "w-12 "
                      : "") +
                    "border-r border-slate-600 text-left text-slate-300 font-medium"
                  }
                >
                  {header.id === "_actions" ? (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="float-right text-slate-400 hover:text-white hover:bg-slate-700 p-1 rounded transition-colors"
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
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-slate-700 hover:bg-slate-750 ${
                  row.getIsSelected() ? "bg-slate-750" : ""
                }`}
              >
                {row.getVisibleCells().map((cell, i) => (
                  <td
                    key={cell.id}
                    className={
                      "p-3 " +
                      (i < row.getVisibleCells().length - 1
                        ? "border-r border-slate-700 "
                        : "") +
                      (["id", "price", "created_date"].includes(cell.column.id)
                        ? "font-mono "
                        : "") +
                      (cell.column.id === "name" ? "text-white " : "") +
                      (cell.column.id === "_actions" ? "text-center " : "")
                    }
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Add form row */}
            {showAddForm && (
              <tr className="border-b border-slate-700 bg-slate-750">
                <td className="p-3 border-r border-slate-700"></td>
                <td className="p-3 text-slate-400 border-r border-slate-700 font-mono">
                  auto
                </td>
                <td className="p-3 border-r border-slate-700">
                  <Input
                    type="text"
                    placeholder="Product name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
                  />
                </td>
                <td className="p-3 border-r border-slate-700">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm font-mono"
                  />
                </td>
                <td className="p-3 border-r border-slate-700">
                  <Input
                    type="date"
                    value={newProduct.created_date}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        created_date: e.target.value,
                      })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm font-mono"
                  />
                </td>
                <td className="p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={handleAddProduct}
                      className="text-green-400 hover:text-green-300 p-1 rounded transition-colors"
                      title="Save"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewProduct({
                          name: "",
                          price: "",
                          created_date: todayLocalISO(),
                        });
                      }}
                      className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                      title="Cancel"
                    >
                      ×
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
          />
          <span>
            {table.getSelectedRowModel().rows.length} of {products.length}
          </span>
          <button className="p-1 hover:text-white transition-colors">
            <Play size={14} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span>records {products.length}</span>
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <RefreshCcw size={14} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
