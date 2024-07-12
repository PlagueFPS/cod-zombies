"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  
  return (
    <div className="flex w-fit rounded-full border p-0.5" role="radiogroup">
      <Button 
        variant="outline" 
        size="icon" 
        role="radio" 
        type="button" 
        title="Light" 
        aria-label="Switch to light theme" 
        className={cn("bg-transparent text-muted-foreground w-8 h-8 rounded-full border-none", className, {
          'text-foreground bg-accent': theme === 'light'
        })}
        onClick={ () => setTheme("light") }
      >
        <Sun className="h-4 w-4 transition-all" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        role="radio" 
        type="button" 
        title="System" 
        aria-label="Switch to system theme" 
        className={cn("bg-transparent text-muted-foreground w-8 h-8 rounded-full border-none", className, {
          'text-foreground bg-accent': theme === 'system' 
        })}
        onClick={ () => setTheme("system") }
      >
        <Monitor className="h-4 w-4 transition-all" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        role="radio" 
        type="button" 
        title="Dark" 
        aria-label="Switch to dark theme" 
        className={cn("bg-transparent text-muted-foreground w-8 h-8 rounded-full border-none", className, {
          'text-foreground bg-accent': theme === 'dark'
        })}
        onClick={ () => setTheme("dark") }
      >
        <Moon className="h-4 w-4 transition-all" />
      </Button>
    </div>
  )
}
