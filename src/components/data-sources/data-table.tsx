
"use client";

import { useEffect, useMemo, useState } from "react";
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
import { ScheduleAutoResetModal } from "../popup/autoResetSchedule";
import { ImportDataModal } from "../popup/importDataModel";
import type { SampleProduct, LogAction } from "@/types/dataSource";

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
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProductForm>({
    name: "",
    price: "",
    created_date: todayLocalISO(),
  });

  // sync when parent updates
  useEffect(() => {
    setProducts(initialProducts);
    setSelectedRows(new Set());
  }, [initialProducts]);

  const [autoResetOpen, setAutoResetOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const commit = (next: SampleProduct[]) => {
    setProducts(next);
    onProductsChange?.(next);
  };

  const handleImport = (file: File, method: string) => {
    onLog?.("IMPORT", "Data Imported", `Imported file "${file.name}" via ${method}`);
  };

  const isAllSelected = useMemo(
    () => products.length > 0 && selectedRows.size === products.length,
    [products.length, selectedRows.size]
  );
  const isIndeterminate = useMemo(
    () => selectedRows.size > 0 && selectedRows.size < products.length,
    [products.length, selectedRows.size]
  );

  const handleSelectAll = (checked: boolean) =>
    setSelectedRows(checked ? new Set(products.map((p) => p.id)) : new Set());

  const handleSelectRow = (id: number, checked: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleAddProduct = () => {
    const price = parseFloat(newProduct.price);
    if (!newProduct.name.trim() || Number.isNaN(price)) return;

    const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
    const p: SampleProduct = {
      id: newId,
      name: newProduct.name.trim(),
      price: parseFloat(price.toFixed(2)),
      created_date: newProduct.created_date || todayLocalISO(),
    };
    commit([...products, p]);
    onLog?.("CREATE", "New Product Created", `Added ${p.name} ($${p.price.toFixed(2)})`);

    setNewProduct({ name: "", price: "", created_date: todayLocalISO() });
    setShowAddForm(false);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.size === 0) return;
    const next = products.filter((p) => !selectedRows.has(p.id));
    commit(next);
    onLog?.("DELETE", "Products Deleted", `Removed ${selectedRows.size} product(s)`);
    setSelectedRows(new Set());
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
          {selectedRows.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              <Trash2 size={14} aria-hidden />
              Delete ({selectedRows.size})
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
              <th className="p-3 w-12 border-r border-slate-600">
                <input
                  type="checkbox"
                  className="rounded bg-slate-700 border-slate-600 text-teal-600 focus:ring-teal-500"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="text-left p-3 text-slate-300 font-medium border-r border-slate-600">
                id
              </th>
              <th className="text-left p-3 text-slate-300 font-medium border-r border-slate-600">
                name
              </th>
              <th className="text-left p-3 text-slate-300 font-medium border-r border-slate-600">
                price
              </th>
              <th className="text-left p-3 text-slate-300 font-medium border-r border-slate-600">
                created_date
              </th>
              <th className="w-12 p-3 text-center">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-slate-400 hover:text-white hover:bg-slate-700 p-1 rounded transition-colors"
                  title="Add new row"
                >
                  <Plus size={16} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className={`border-b border-slate-700 hover:bg-slate-750 ${
                  selectedRows.has(product.id) ? "bg-slate-750" : ""
                }`}
              >
                <td className="p-3 border-r border-slate-700">
                  <input
                    type="checkbox"
                    className="rounded bg-slate-700 border-slate-600 text-teal-600 focus:ring-teal-500"
                    checked={selectedRows.has(product.id)}
                    onChange={(e) => handleSelectRow(product.id, e.target.checked)}
                  />
                </td>
                <td className="p-3 text-slate-200 border-r border-slate-700 font-mono">
                  {product.id}
                </td>
                <td className="p-3 text-white border-r border-slate-700">
                  {product.name}
                </td>
                <td className="p-3 text-white border-r border-slate-700 font-mono">
                  ${product.price.toFixed(2)}
                </td>
                <td className="p-3 text-slate-300 border-r border-slate-700 font-mono">
                  {product.created_date}
                </td>
                <td className="p-3 text-center">
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
                        const next = products.filter((p) => p.id !== product.id);
                        commit(next);
                        onLog?.(
                          "DELETE",
                          "Product Deleted",
                          `Removed ${product.name} (id ${product.id})`
                        );
                        setSelectedRows((prev) => {
                          const s = new Set(prev);
                          s.delete(product.id);
                          return s;
                        });
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
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
                  <input
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
                  <input
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
                  <input
                    type="date"
                    value={newProduct.created_date}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, created_date: e.target.value })
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
          <input
            type="checkbox"
            className="rounded bg-slate-700 border-slate-600 text-teal-600 focus:ring-teal-500"
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isIndeterminate;
            }}
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <span>
            {selectedRows.size} of {products.length}
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
