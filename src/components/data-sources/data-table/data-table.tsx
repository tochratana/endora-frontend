"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { TableHeader } from "./table-header";
import { TableToolbar } from "./table-toolbar";
import { TableModals } from "./table-modals";
import { TableBody } from "./table-body";
import { TableFooter } from "./table-footer";
import type { SampleProduct, LogAction } from "@/types/dataSource";

// export interface DataTableProps {
//   products: SampleProduct[];
//   onProductsChange?: (next: SampleProduct[]) => void;
//   onLog?: (action: LogAction, title: string, description: string) => void;
// }'

interface DataTableProps {
  // projectUuid: string; 
  products: SampleProduct[];
  workspaceId: string;
  onProductsChange?: (next: SampleProduct[]) => void;
  onLog?: (action: LogAction, title: string, description: string) => void;
}

export function DataTable({
  // projectUuid,
  products: initialProducts,
  workspaceId,
  onProductsChange,
  onLog,
}: DataTableProps) {
  const [products, setProducts] = useState<SampleProduct[]>(initialProducts);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [autoResetOpen, setAutoResetOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // keep internal state in sync when props change
  useEffect(() => {
    setProducts(initialProducts);
    setRowSelection({});
    setSelectedIds([]);
  }, [initialProducts]);

  const commit = useCallback(
    (next: SampleProduct[]) => {
      setProducts(next);
      onProductsChange?.(next);
    },
    [onProductsChange]
  );

  const handleImport = (file: File, method: string) => {
    onLog?.(
      "IMPORT",
      "Data Imported",
      `Imported file "${file.name}" via ${method}`
    );
  };

  const handleAddRow = (p: Omit<SampleProduct, "id">) => {
    const newId = Math.max(0, ...products.map(r => r.id)) + 1;
    const row: SampleProduct = { id: newId, ...p };
    commit([...products, row]);
    onLog?.(
      "CREATE",
      "New Product Created",
      `Added ${row.name} ($${row.price.toFixed(2)})`
    );
  };

  const handleDeleteRow = (id: number) => {
    const next = products.filter(p => p.id !== id);
    const deleted = products.find(p => p.id === id);
    commit(next);
    if (deleted) {
      onLog?.(
        "DELETE",
        "Product Deleted",
        `Removed ${deleted.name} (id ${deleted.id})`
      );
    }
    // also unselect if it was selected
    setRowSelection(prev => {
      const copy = { ...prev } as Record<string, boolean>;
      delete copy[String(id)];
      return copy;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const next = products.filter(p => !selectedIds.includes(p.id));
    commit(next);
    onLog?.(
      "DELETE",
      "Products Deleted",
      `Removed ${selectedIds.length} product(s)`
    );
    setRowSelection({});
    setSelectedIds([]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setProducts(initialProducts);
    setRowSelection({});
    setSelectedIds([]);
    onLog?.("REFRESH", "Table Refreshed", "Reloaded product list");
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const total = useMemo(() => products.length, [products]);

  return (
    <div className="space-y-4">
      
      <TableToolbar
        selectedCount={selectedIds.length}
        onDeleteSelected={handleDeleteSelected}
        onOpenAutoReset={() => setAutoResetOpen(true)}
        onOpenImport={() => setImportOpen(true)}
      />
      <TableHeader projectUuid={workspaceId} />
      {/* <TableHeader projectUuid={projectUuid} /> */}

      <TableModals
        autoResetOpen={autoResetOpen}
        importOpen={importOpen}
        onCloseAutoReset={() => setAutoResetOpen(false)}
        onCloseImport={() => setImportOpen(false)}
        onImport={handleImport}
      />

      <TableBody
        products={products}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onSelectedIdsChange={setSelectedIds}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
      />

      <TableFooter
        total={total}
        selectedCount={selectedIds.length}
        isRefreshing={isRefreshing}
        onToggleAll={checked => {
          // parent-level toggle-all: let body control IDs through callback
          setRowSelection(prev => {
            if (checked) {
              const next: Record<string, boolean> = {};
              products.forEach(p => (next[String(p.id)] = true));
              return next;
            }
            return {};
          });
        }}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

export default DataTable;
