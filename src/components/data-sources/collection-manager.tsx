"use client";

import { useState } from "react";
import { DataTable } from "./data-table";
import type { SampleProduct, LogAction } from "@/types/dataSource";

interface Collection {
  id: string;
  name: string;
}

interface Tab {
  id: string;
  name: string;
  collectionId: string;
}

interface CollectionManagerProps {
  initialProducts: SampleProduct[];
  onLog?: (action: LogAction, title: string, description: string) => void;
}

export function CollectionManager({
  initialProducts,
  onLog,
}: CollectionManagerProps) {
  const [collections, setCollections] = useState<Collection[]>([
    { id: "products", name: "products collection" },
    { id: "inventory", name: "inventory collection" },
    { id: "orders", name: "orders collection" },
  ]);

  const [activeCollectionId, setActiveCollectionId] = useState("products");

  const [tabs, setTabs] = useState<Tab[]>([
    { id: "tab1", name: "Main View", collectionId: "products" },
    { id: "tab2", name: "Analytics", collectionId: "products" },
  ]);

  const [activeTabId, setActiveTabId] = useState("tab1");
  const [products, setProducts] = useState(initialProducts);

  const handleAddCollection = () => {
    const newId = `collection_${Date.now()}`;
    const newCollection = {
      id: newId,
      name: `new collection`,
    };
    setCollections([...collections, newCollection]);
    setActiveCollectionId(newId);
    onLog?.(
      "CREATE",
      "Collection Created",
      `Added new collection: ${newCollection.name}`
    );
  };

  const handleAddTab = () => {
    const newId = `tab_${Date.now()}`;
    const newTab = {
      id: newId,
      name: `Tab ${tabs.length + 1}`,
      collectionId: activeCollectionId,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    onLog?.("CREATE", "Tab Created", `Added new tab: ${newTab.name}`);
  };

  const handleCloseTab = (tabId: string) => {
    const updatedTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(updatedTabs);

    if (activeTabId === tabId && updatedTabs.length > 0) {
      setActiveTabId(updatedTabs[0].id);
    }
    onLog?.("DELETE", "Tab Closed", `Closed tab with id: ${tabId}`);
  };

  return (
    <DataTable
      products={products}
      onProductsChange={setProducts}
      onLog={onLog}
    />
  );
}
