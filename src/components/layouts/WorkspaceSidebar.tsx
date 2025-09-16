"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSidebarItems } from "@/types/sidebarItem";

type SidebarMode = "expanded" | "collapsed" | "hover";

const COLLAPSED_W_BASE = 56;
const COLLAPSED_W_SM = 64;
const EXPANDED_W_BASE = 224;
const EXPANDED_W_SM = 256;

// Optimized media query hook that uses a single listener
function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    canHover: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      const isDesktop = width >= 1024;
      const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
      ).matches;

      setBreakpoint({ isMobile, isTablet, isDesktop, canHover });
    };

    updateBreakpoint();
    const debouncedUpdate = debounce(updateBreakpoint, 100);
    window.addEventListener("resize", debouncedUpdate);

    return () => window.removeEventListener("resize", debouncedUpdate);
  }, []);

  return breakpoint;
}

// Simple debounce utility
function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return ((...args: unknown[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

// Memoized navigation item component
const NavItem = ({
  icon: Icon,
  label,
  href,
  expanded,
  isActive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  expanded: boolean;
  isActive: boolean;
}) => (
  <li>
    <Link
      href={href}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors outline-none",
        isActive
          ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
          : "text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/30 font-normal"
      )}
      title={!expanded ? label : ""}
      aria-current={isActive ? "page" : undefined}
      prefetch={false} // Disable prefetch for faster initial render
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {expanded && <span className="truncate">{label}</span>}
    </Link>
  </li>
);

export function Sidebar({
  workspaceId,
  headerOffsetPx = 64,
  sidebarZ = 30,
  overlayZ = 40,
}: {
  workspaceId: string;
  headerOffsetPx?: number;
  sidebarZ?: number;
  overlayZ?: number;
}) {
  const pathname = usePathname();
  const { isMobile, isTablet, isDesktop, canHover } = useBreakpoint();

  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("expanded");
  const [isHovered, setIsHovered] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // Optimize localStorage operations
  useEffect(() => {
    const saved = localStorage.getItem("sidebar:mode");
    if (saved === "expanded" || saved === "collapsed" || saved === "hover") {
      setSidebarMode(saved);
    }
  }, []);

  const updateSidebarMode = useCallback((mode: SidebarMode) => {
    setSidebarMode(mode);
    localStorage.setItem("sidebar:mode", mode);
  }, []);

  useEffect(() => {
    setIsHovered(false);
  }, [canHover]);

  // Memoize navigation items and active states
  const navigationItems = useMemo(() => {
    const items = getSidebarItems(workspaceId);
    return items.map(item => ({
      ...item,
      isActive: pathname === item.href || pathname.startsWith(item.href + "/"),
    }));
  }, [workspaceId, pathname]);

  const isExpanded = useMemo(() => {
    if (isMobile) return sidebarMode === "expanded";
    return sidebarMode === "expanded" || (sidebarMode === "hover" && isHovered);
  }, [isMobile, sidebarMode, isHovered]);

  const showOverlayMobile = isMobile && sidebarMode === "hover" && isHovered;
  const showOverlayDesktop =
    !isMobile && sidebarMode === "hover" && isHovered && canHover;

  const handleMouseEnter = useCallback(() => {
    if (!isMobile && canHover && sidebarMode === "hover") {
      setIsHovered(true);
    }
  }, [isMobile, canHover, sidebarMode]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile && canHover && sidebarMode === "hover" && !showModeDropdown) {
      setIsHovered(false);
    }
  }, [isMobile, canHover, sidebarMode, showModeDropdown]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [overlayBox, setOverlayBox] = useState<{
    top: number;
    left: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    const shouldMeasure = showOverlayMobile || showOverlayDesktop;
    if (!shouldMeasure) return;

    const updateOverlayBox = debounce(() => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setOverlayBox({ top: r.top, left: r.left, height: r.height });
    }, 16); // 60fps

    updateOverlayBox();
    window.addEventListener("resize", updateOverlayBox);
    window.addEventListener("scroll", updateOverlayBox, true);
    return () => {
      window.removeEventListener("resize", updateOverlayBox);
      window.removeEventListener("scroll", updateOverlayBox, true);
    };
  }, [showOverlayMobile, showOverlayDesktop]);

  // Optimize touch handling
  useEffect(() => {
    if (!isMobile || sidebarMode !== "hover") return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if (e.clientX <= 12) setIsHovered(true);
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [isMobile, sidebarMode]);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  );

  useLayoutEffect(() => {
    if (!showModeDropdown) return;

    const updatePos = () => {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMenuPos({ top: r.top - 8, left: r.left });
    };

    updatePos();
    const debouncedUpdate = debounce(updatePos, 16);
    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("scroll", debouncedUpdate, true);
    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("scroll", debouncedUpdate, true);
    };
  }, [showModeDropdown]);

  const overlayPanelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!showOverlayMobile) return;

    const onDocDown = (e: Event) => {
      if (showModeDropdown) return;
      const t = e.target as Node;
      const insideDropdown =
        !!menuRef.current?.contains(t) || !!triggerRef.current?.contains(t);
      if (insideDropdown) return;
      const insidePanel = !!overlayPanelRef.current?.contains(t);
      const insideSidebar = !!containerRef.current?.contains(t);
      if (!insidePanel && !insideSidebar) setIsHovered(false);
    };

    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, [showOverlayMobile, showModeDropdown]);

  // Memoized navigation list
  const NavList = useMemo(() => {
    const Component = ({ expanded }: { expanded: boolean }) => (
      <nav className="p-2">
        <ul className="space-y-1">
          {navigationItems.map(({ icon, label, href, isActive }) => (
            <NavItem
              key={href}
              icon={icon}
              label={label}
              href={href}
              expanded={expanded}
              isActive={isActive}
            />
          ))}
        </ul>
      </nav>
    );
    Component.displayName = "NavList";
    return Component;
  }, [navigationItems]);

  const ControlsRow = () => (
    <div className="flex items-center gap-1">
      <div className="relative">
        <button
          ref={triggerRef}
          onClick={e => {
            e.stopPropagation();
            setShowModeDropdown(v => !v);
          }}
          className="flex items-center justify-center p-2 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/30 rounded-lg transition-colors"
          title="Sidebar mode"
          aria-haspopup="menu"
          aria-expanded={showModeDropdown}
          aria-label="Sidebar mode"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {showModeDropdown &&
          typeof window !== "undefined" &&
          createPortal(
            <div
              ref={menuRef}
              role="menu"
              className={cn(
                "fixed z-[1000] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-2 min-w-[180px]",
                "origin-bottom-left translate-y-[-100%]"
              )}
              style={menuPos ?? undefined}
              onClick={e => e.stopPropagation()}
            >
              <div className="px-3 py-2 text-sm font-normal text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                Sidebar mode
              </div>
              {(["expanded", "collapsed", "hover"] as SidebarMode[]).map(
                mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      updateSidebarMode(mode);
                      setShowModeDropdown(false);
                      if (mode !== "hover") setIsHovered(false);
                    }}
                    role="menuitemradio"
                    aria-checked={sidebarMode === mode}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full border border-slate-400 dark:border-slate-500 flex items-center justify-center">
                      {sidebarMode === mode && (
                        <div className="w-1.5 h-1.5 bg-slate-900 dark:bg-white rounded-full" />
                      )}
                    </div>
                    {mode === "hover"
                      ? "Expand on hover"
                      : mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                )
              )}
            </div>,
            document.body
          )}
      </div>
    </div>
  );

  const containerStyle: React.CSSProperties = useMemo(() => {
    if (isMobile) {
      return {
        position: "fixed",
        top: headerOffsetPx,
        left: 0,
        height: `calc(100vh - ${headerOffsetPx}px)`,
        width: sidebarMode === "expanded" ? "224px" : "56px",
        zIndex: sidebarZ,
      };
    }
    if (isTablet) {
      return {
        position: "fixed",
        top: headerOffsetPx + 8,
        left: 0,
        height: `calc(100vh - ${headerOffsetPx + 8}px + 16px)`,
        width: sidebarMode === "expanded" ? "240px" : "64px",
        zIndex: sidebarZ,
      };
    }
    return {};
  }, [isMobile, isTablet, headerOffsetPx, sidebarMode, sidebarZ]);

  return (
    <div
      ref={containerRef}
      className={cn(
        isDesktop
          ? "relative h-full"
          : isTablet
            ? "fixed inset-0 top-16 z-30"
            : "fixed inset-0 top-10 z-30"
      )}
      style={containerStyle}
    >
      <div
        className={cn(
          "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
          "h-full",
          isMobile
            ? sidebarMode === "expanded"
              ? "w-56"
              : "w-14"
            : isTablet
              ? sidebarMode === "hover"
                ? "w-16"
                : isExpanded
                  ? "w-60"
                  : "w-16"
              : sidebarMode === "hover"
                ? "w-16"
                : isExpanded
                  ? "w-64"
                  : "w-16"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={() => {
          if (isMobile && sidebarMode === "hover") setIsHovered(true);
        }}
      >
        <div className="flex-1 overflow-hidden">
          <NavList
            expanded={isExpanded && (!isMobile || sidebarMode === "expanded")}
          />
        </div>
        <div className="flex-shrink-0 p-2 border-t border-slate-200 dark:border-slate-800">
          <ControlsRow />
        </div>
      </div>

      {(showOverlayMobile || showOverlayDesktop) &&
        overlayBox &&
        createPortal(
          <div
            ref={overlayPanelRef}
            className="fixed bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl overflow-hidden"
            style={{
              top: overlayBox.top,
              left: overlayBox.left,
              height: isMobile
                ? `calc(100vh - ${headerOffsetPx}px)`
                : isTablet
                  ? `calc(100vh - ${headerOffsetPx + 8}px + 16px)`
                  : `calc(100vh - ${headerOffsetPx}px)`,
              width: showOverlayMobile
                ? isMobile
                  ? "224px"
                  : isTablet
                    ? "240px"
                    : "256px"
                : isMobile
                  ? "224px"
                  : isTablet
                    ? "240px"
                    : "256px",
              zIndex: overlayZ,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="dialog"
            aria-label="Expanded sidebar hover overlay"
          >
            <div
              className={cn(
                "flex-1",
                showOverlayMobile ? "overflow-y-auto" : "overflow-hidden"
              )}
            >
              <NavList expanded />
            </div>
            <div className="flex-shrink-0 p-2 border-t border-slate-200 dark:border-slate-800">
              <ControlsRow />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
