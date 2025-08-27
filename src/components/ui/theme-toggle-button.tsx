"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useThemeManager } from "@/hooks/use-theme";
import { Button } from "@/components/ui/Button";

interface ThemeToggleButtonProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggleButton({
  className = "",
  size = "md",
}: ThemeToggleButtonProps) {
  const { toggleTheme, isDark, mounted } = useThemeManager();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className={className}>
        <div className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
    </Button>
  );
}
