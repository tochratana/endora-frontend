"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSidebarItems } from "@/types/sidebarItem";

// shadcn/ui
// import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/ui/button"

// ----- Types -----
type SidebarMode = "expanded" | "collapsed" | "hover";

// ----- Component -----
export function Sidebar({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("expanded");
  const [isHovered, setIsHovered] = useState(false);

  // Persist/restore mode
  useEffect(() => {
    const saved = localStorage.getItem("sidebar:mode");
    if (saved === "expanded" || saved === "collapsed" || saved === "hover") {
      setSidebarMode(saved);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebar:mode", sidebarMode);
  }, [sidebarMode]);

  const isExpanded = sidebarMode === "expanded" || (sidebarMode === "hover" && isHovered);
  const showOverlay = sidebarMode === "hover" && isHovered;

  const items = getSidebarItems(workspaceId);

  const isActive = (href: string) => href === pathname || pathname.startsWith(href);

  const handleMouseEnter = () => sidebarMode === "hover" && setIsHovered(true);
  const handleMouseLeave = () => sidebarMode === "hover" && setIsHovered(false);

  const toggleExpandCollapse = () => {
    setSidebarMode((m) => (m === "expanded" ? "collapsed" : "expanded"));
  };

  // --- Nav list ---
  function NavList({ expanded }: { expanded: boolean }) {
    return (
      <ScrollArea className="px-2 pt-2 flex-1">
        <ul className="space-y-1 pb-4">
          {items.map(({ icon: Icon, label, href }) => {
            const active = isActive(href);
            const content = (
              <Link
                href={href}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors outline-none",
                  active
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {expanded && <span className="truncate">{label}</span>}
              </Link>
            );

            return (
              <li key={`${href}-${label}`}>
                {expanded ? (
                  content
                ) : (
                  <TooltipProvider>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger asChild>{content}</TooltipTrigger>
                      <TooltipContent side="right">{label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    );
  }

  // --- Controls row (bottom) ---
  function ControlsRow() {
    return (
      <div className="flex items-center justify-between">
        {/* Mode picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800/50"
              aria-label="Sidebar mode"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Sidebar mode</DropdownMenuLabel>
            <Separator className="my-1" />
            <DropdownMenuRadioGroup
              value={sidebarMode}
              onValueChange={(v: SidebarMode) => setSidebarMode(v)}
            >
              <DropdownMenuRadioItem value="expanded">Expanded</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="collapsed">Collapsed</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="hover">Expand on hover</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick toggle */}
        <Button
          onClick={toggleExpandCollapse}
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </Button>
      </div>
    );
  }

  // --- Core render ---
  return (
    <div className="relative">
      {/* Mobile drawer */}
      <div className="md:hidden">
        <Sheet>
          <div className="p-2 border-b border-slate-800 bg-slate-900 flex items-center gap-2">
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">Menu</Button>
            </SheetTrigger>
            <div className="text-sm text-slate-300">Workspace</div>
          </div>
          <SheetContent side="left" className="p-0 bg-slate-900 border-slate-800 w-72">
            <div className="h-full flex flex-col" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <NavList expanded />
              <Separator />
              <div className="p-2">
                <ControlsRow />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex-col h-screen sticky top-0",
          sidebarMode === "hover" ? "w-16" : isExpanded ? "w-64" : "w-16",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <NavList expanded={sidebarMode === "expanded"} />
        <Separator />
        <div className="p-2">
          <ControlsRow />
        </div>
      </div>

      {/* Hover overlay (desktop) */}
      {showOverlay && (
        <div
          className="hidden md:flex fixed left-0 top-0 w-64 h-screen bg-slate-900 border-r border-slate-800 z-50 flex-col shadow-2xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="dialog"
          aria-label="Expanded sidebar hover overlay"
        >
          <NavList expanded />
          <Separator />
          <div className="p-2">
            <ControlsRow />
          </div>
        </div>
      )}
    </div>
  );
}

