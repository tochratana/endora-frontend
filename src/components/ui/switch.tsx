"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {

  const [darkMode, setDarkMode] = React.useState(false)

  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "light") {
      setDarkMode(true)
      document.documentElement.classList.remove("dark")
    } else {
      setDarkMode(false)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked)
    if (checked) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")  
    }
  }
  return (
    <SwitchPrimitive.Root
      checked={darkMode}
      onCheckedChange={handleThemeChange}
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input inline-flex h-[1.5rem] w-12 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none cursor-pointer",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "flex items-center justify-center bg-white size-6 rounded-full shadow transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      >
        {darkMode ? (
          <Moon className="w-4 h-4 text-teal-500" />
        ) : (
          <Sun className="w-4 h-4 text-indigo-900" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
