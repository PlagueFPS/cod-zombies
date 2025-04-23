"use client"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex w-fit rounded-full border p-0.5" role="radiogroup">
      <TooltipProvider delayDuration={ 500 }>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              role="radio" 
              type="button" 
              aria-checked={ theme === 'light' }
              aria-label="Switch to light theme"
              className={cn("bg-transparent cursor-pointer text-muted-foreground size-8 rounded-full border-none", className, {
                'text-foreground bg-accent': theme === 'light'
              })}
              onClick={ () => setTheme("light") }
            >
              <Sun className="size-4 transition-all" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Light
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              role="radio" 
              type="button" 
              aria-checked={ theme === 'system' }
              aria-label="Switch to system theme"
              className={cn("bg-transparent cursor-pointer text-muted-foreground size-8 rounded-full border-none", className, {
                'text-foreground bg-accent': theme === 'system' 
              })}
              onClick={ () => setTheme("system") }
            >
              <Monitor className="size-4 transition-all" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            System
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              role="radio" 
              type="button" 
              aria-checked={ theme === 'dark' }
              aria-label="Switch to dark theme" 
              className={cn("bg-transparent cursor-pointer text-muted-foreground size-8 rounded-full border-none", className, {
                'text-foreground bg-accent': theme === 'dark'
              })}
              onClick={ () => setTheme("dark") }
            >
              <Moon className="size-4 transition-all" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Dark
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
