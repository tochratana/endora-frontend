"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSidebarItems } from "@/types/sidebarItem";

type SidebarMode = "expanded" | "collapsed" | "hover";

const COLLAPSED_W_BASE = 56;
const COLLAPSED_W_SM = 64;
const EXPANDED_W_BASE = 224;
const EXPANDED_W_SM = 256;

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    m.addListener?.(onChange);
    return () => {
      m.removeEventListener?.("change", onChange);
      m.removeListener?.(onChange);
    };
  }, [query]);
  return matches;
}

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

  // Enhanced responsive breakpoints for all device sizes
  const isXs = useMedia("(max-width: 639px)");
  const isSm = useMedia("(min-width: 640px) and (max-width: 767px)");
  const isMd = useMedia("(min-width: 768px) and (max-width: 1023px)");
  const isLg = useMedia("(min-width: 1024px) and (max-width: 1279px)");
  const isXl = useMedia("(min-width: 1280px)");

  const isSmUp = useMedia("(min-width: 640px)");
  const isMdUp = useMedia("(min-width: 768px)");
  const isLgUp = useMedia("(min-width: 1024px)");

  const canHoverPointer = useMedia("(hover: hover) and (pointer: fine)");
  const isMobile = isXs;
  const isTablet = isSm || isMd;
  const isDesktop = isLg || isXl;

  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("expanded");
  const [isHovered, setIsHovered] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar:mode");
    if (saved === "expanded" || saved === "collapsed" || saved === "hover") {
      setSidebarMode(saved);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebar:mode", sidebarMode);
  }, [sidebarMode]);

  useEffect(() => {
    setIsHovered(false);
  }, [isSmUp, canHoverPointer]);

  const isExpanded = useMemo(() => {
    if (isMobile) return sidebarMode === "expanded";
    return sidebarMode === "expanded" || (sidebarMode === "hover" && isHovered);
  }, [isMobile, sidebarMode, isHovered]);

  const showOverlayMobile = isMobile && sidebarMode === "hover" && isHovered;
  const showOverlayDesktop =
    !isMobile && sidebarMode === "hover" && isHovered && canHoverPointer;

  const items = getSidebarItems(workspaceId);
  const isActive = (href: string) =>
    href === pathname || pathname.startsWith(href);

  const handleMouseEnter = () => {
    if (!isMobile && canHoverPointer && sidebarMode === "hover")
      setIsHovered(true);
  };
  const handleMouseLeave = () => {
    if (
      !isMobile &&
      canHoverPointer &&
      sidebarMode === "hover" &&
      !showModeDropdown
    ) {
      setIsHovered(false);
    }
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [overlayBox, setOverlayBox] = useState<{
    top: number;
    left: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    const shouldMeasure = showOverlayMobile || showOverlayDesktop;
    if (!shouldMeasure) return;
    function updateOverlayBox() {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setOverlayBox({ top: r.top, left: r.left, height: r.height });
    }
    updateOverlayBox();
    window.addEventListener("resize", updateOverlayBox);
    window.addEventListener("scroll", updateOverlayBox, true);
    return () => {
      window.removeEventListener("resize", updateOverlayBox);
      window.removeEventListener("scroll", updateOverlayBox, true);
    };
  }, [showOverlayMobile, showOverlayDesktop]);

  const onPointerDownRail = () => {
    if (isMobile && sidebarMode === "hover") setIsHovered(true);
  };
  useEffect(() => {
    if (!isMobile || sidebarMode !== "hover") return;
    const EDGE = 12;
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if (e.clientX <= EDGE) setIsHovered(true);
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
    function updatePos() {
      const el = triggerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const GAP = 8;
      setMenuPos({ top: r.top - GAP, left: r.left });
    }
    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [showModeDropdown]);

  const overlayPanelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!showOverlayMobile) return;

    function onDocDown(e: MouseEvent | TouchEvent) {
      if (showModeDropdown) return;
      const t = e.target as Node;
      const insideDropdown =
        !!menuRef.current?.contains(t) || !!triggerRef.current?.contains(t);
      if (insideDropdown) return;
      const insidePanel = !!overlayPanelRef.current?.contains(t);
      const insideSidebar = !!containerRef.current?.contains(t);
      if (!insidePanel && !insideSidebar) setIsHovered(false);
    }

    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown, {
      passive: true,
    });
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, [showOverlayMobile, showModeDropdown]);

  const NavList = ({ expanded }: { expanded: boolean }) => (
    <nav className="p-2">
      <ul className="space-y-1">
        {items.map(({ icon: Icon, label, href }) => (
          <li key={`${href}-${label}`}>
            <Link
              href={href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors outline-none",
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

  const ControlsRow = () => (
    <div className="flex items-center gap-1">
      <div className="relative">
        <button
          ref={triggerRef}
          onClick={e => {
            e.stopPropagation();
            setShowModeDropdown(v => !v);
          }}
          className="flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
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
                "fixed z-[1000] bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2 min-w-[180px]",
                "origin-bottom-left translate-y-[-100%]"
              )}
              style={menuPos ?? undefined}
              onClick={e => e.stopPropagation()}
            >
              <div className="px-3 py-2 text-sm font-medium text-slate-300 border-b border-slate-700">
                Sidebar mode
              </div>
              {(["expanded", "collapsed", "hover"] as SidebarMode[]).map(
                mode => (
                  <button
                    key={mode}
                    onClick={() => {
                      setSidebarMode(mode);
                      setShowModeDropdown(false);
                      if (mode !== "hover") setIsHovered(false);
                    }}
                    role="menuitemradio"
                    aria-checked={sidebarMode === mode}
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
            </div>,
            document.body
          )}
      </div>
    </div>
  );

  const containerStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: headerOffsetPx + 16,
        left: 0,
        height: isMobile
          ? `calc(100vh - ${headerOffsetPx + 16}px + 32px)`
          : isTablet
            ? `calc(100vh - ${headerOffsetPx + 8}px + 16px)`
            : `calc(100vh - ${headerOffsetPx}px)`,
        width: sidebarMode === "expanded" ? "224px" : "56px",
        zIndex: sidebarZ,
      }
    : isTablet
      ? {
          position: "fixed",
          top: headerOffsetPx + 8,
          left: 0,
          height: `calc(100vh - ${headerOffsetPx + 8}px + 16px)`,
          width: sidebarMode === "expanded" ? "240px" : "64px",
          zIndex: sidebarZ,
        }
      : {};

  return (
    <div
      ref={containerRef}
      className={cn(
        isDesktop
          ? "relative h-full"
          : isTablet
            ? "fixed inset-0 top-16 z-30"
            : "fixed inset-0 top-20 z-30"
      )}
      style={containerStyle}
    >
      <div
        className={cn(
          "bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
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
            expanded={isExpanded && (isSmUp || sidebarMode === "expanded")}
          />
        </div>
        <div className="flex-shrink-0 p-2 border-t border-slate-800">
          <ControlsRow />
        </div>
      </div>

      {(showOverlayMobile || showOverlayDesktop) &&
        overlayBox &&
        createPortal(
          <div
            ref={overlayPanelRef}
            className="fixed bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl overflow-hidden"
            style={{
              top: overlayBox.top,
              left: overlayBox.left,
              height: isMobile
                ? `calc(100vh - ${headerOffsetPx + 16}px + 32px)`
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
            <div className="flex-shrink-0 p-2 border-t border-slate-800">
              <ControlsRow />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
