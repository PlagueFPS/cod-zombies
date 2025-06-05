"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const handleThemeToggle = () => {
    if (theme === "light") setTheme("dark")
    else setTheme("light")
  }

  return (
    <div className="flex w-fit p-0.5">
      <Button 
        variant="outline" 
        size="icon" 
        type="button" 
        aria-label="Toggle Theme"
        title="Toggle Theme"
        className={cn("bg-transparent cursor-pointer text-foreground size-8", className, {
          'text-foreground bg-accent': theme === 'light'
        })}
        onClick={ handleThemeToggle }
      >
        { theme === "light" ? <Sun className="size-4 transition-all" /> : <Moon className="size-4 transition-all" /> }
      </Button>
    </div>
  )
}
