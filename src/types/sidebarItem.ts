import { Home, Grid3X3, Database, Globe, FileText, Folder, Settings } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface SidebarItem {
  icon: LucideIcon
  label: string
  href: string
}

// function instead of static array
export function getSidebarItems(workspaceId: string): SidebarItem[] {
  // const base = `/workspace/${workspaceId}`
  const base = `/workspace/${workspaceId}`

  // const base = `/${workspaceId}`

  return [
    { icon: Home,     label: "Project Overview",      href: `${base}/projectOverview` },
    { icon: Grid3X3,  label: "Table Editor",          href: `${base}/schemas` },
    { icon: FileText, label: "Data Source",           href: `${base}/dataSource` },
    { icon: Database, label: "Table Visualizer",      href: `${base}/visualizer` },
    { icon: Grid3X3,  label: "Database Connection",   href: `${base}/databaseConnection` },
    { icon: Globe,    label: "Public API",            href: `${base}/api` },
    { icon: Folder,   label: "API Docs",              href: `${base}/docs` },
    { icon: Settings, label: "Project Setting",       href: `${base}/projectSetting` },
  ]
}

