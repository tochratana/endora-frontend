import { useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { getSidebarItems } from "@/types/sidebarItem";

export function useOptimizedSidebar(workspaceId: string) {
  const pathname = usePathname();

  // Memoize navigation items with active states
  const navigationItems = useMemo(() => {
    const items = getSidebarItems(workspaceId);
    return items.map(item => ({
      ...item,
      isActive: pathname === item.href || pathname.startsWith(item.href + "/")
    }));
  }, [workspaceId, pathname]);

  // Optimized isActive check function
  const isActiveHref = useCallback((href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  }, [pathname]);

  return {
    navigationItems,
    isActiveHref,
    currentPath: pathname
  };
}
