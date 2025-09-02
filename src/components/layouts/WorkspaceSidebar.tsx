"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSidebarItems } from "@/types/sidebarItem";

type SidebarMode = "expanded" | "collapsed" | "hover";

export function Sidebar({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("expanded");
  const [isHovered, setIsHovered] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const isExpanded =
    sidebarMode === "expanded" || (sidebarMode === "hover" && isHovered);
  const showOverlay = sidebarMode === "hover" && isHovered;

  const items = getSidebarItems(workspaceId);

  const isActive = (href: string) =>
    href === pathname || pathname.startsWith(href);

  const handleMouseEnter = () => sidebarMode === "hover" && setIsHovered(true);
  const handleMouseLeave = () => sidebarMode === "hover" && setIsHovered(false);

  const toggleMode = () => {
    if (sidebarMode === "expanded") setSidebarMode("collapsed");
    else if (sidebarMode === "collapsed") setSidebarMode("expanded");
  };

  const NavList = ({ expanded }: { expanded: boolean }) => (
    <nav className="p-2 flex-1 overflow-y-auto">
      <ul className="space-y-1">
        {items.map(({ icon: Icon, label, href }) => (
          <li key={`${href}-${label}`}>
            <Link
              href={href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                isActive(href)
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
              title={!expanded ? label : ""}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {expanded && <span className="truncate">{label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );

  // Bottom controls (3-dots + chevron)
  const ControlsRow = () => (
    <div className="flex items-center gap-1">
      {/* Mode dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowModeDropdown(!showModeDropdown)}
          className="flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          title="Sidebar mode"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {showModeDropdown && (
          <div className="absolute bottom-full left-0 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
            <div className="px-3 py-2 text-sm font-medium text-slate-300 border-b border-slate-700">
              Sidebar mode
            </div>
            {(["expanded", "collapsed", "hover"] as SidebarMode[]).map(
              (mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setSidebarMode(mode);
                    setShowModeDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <div className="w-3 h-3 rounded-full border border-slate-500 flex items-center justify-center">
                    {sidebarMode === mode && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  {mode === "hover"
                    ? "Expand on hover"
                    : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Main Sidebar */}
      <div
        className={cn(
          "bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col",
          sidebarMode === "hover" ? "w-16" : isExpanded ? "w-64" : "w-16",
          "h-screen sticky top-0"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation area */}
        <NavList expanded={sidebarMode === "expanded"} />

        {/* Controls always visible at bottom */}
        <div className="p-2 border-t border-slate-800 flex-shrink-0">
          <ControlsRow />
        </div>
      </div>

      {/* Hover Overlay - positioned absolutely */}
      {showOverlay && (
        <div 
          className="fixed left-0 top-0 w-64 h-screen bg-slate-900 border-r border-slate-800 z-50 flex flex-col shadow-2xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Navigation area */}
          <NavList expanded />
          
          {/* Controls at bottom */}
          <div className="p-2 border-t border-slate-800 flex-shrink-0">
            <ControlsRow />
          </div>
        </div>
      )}
    </div>
  );
}
