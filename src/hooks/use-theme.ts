"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeManager() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  const isDark = resolvedTheme === "dark"
  const isLight = resolvedTheme === "light"
  const isSystem = theme === "system"

  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme,
    mounted,
    toggleTheme,
    isDark,
    isLight,
    isSystem,
  }
}
