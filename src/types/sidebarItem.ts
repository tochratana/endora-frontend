import {
  Home,
  Grid3X3,
  Database,
  Globe,
  FileText,
  Folder,
  Settings,
  DatabaseZap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

// function instead of static array
export function getSidebarItems(workspaceId: string): SidebarItem[] {
  // const base = `/workspace/${workspaceId}`
  const base = `/workspace/${workspaceId}`;

  // const base = `/${workspaceId}`

  return [
    { icon: Home, label: "Project Overview", href: `${base}/projectOverview` },
    { icon: Grid3X3, label: "Table Editor", href: `${base}/schemas` },
    {
      icon: Grid3X3,
      label: "Database Connection",
      href: `${base}/databaseConnection`,
    },
    { icon: Database, label: "Table Visualizer", href: `${base}/visualizer` },
    { icon: Globe, label: "Public API", href: `${base}/api` },
    { icon: FileText, label: "Data Source", href: `${base}/dataSource` },
    { icon: Folder, label: "API Docs", href: `${base}/docs` },
    {
      icon: DatabaseZap,
      label: "SQL Script",
      href: `${base}/sqlScript`,
    },
    {
      icon: Settings,
      label: "Project Setting",
      href: `${base}/projectSetting`,
    },
    
  ];
}
