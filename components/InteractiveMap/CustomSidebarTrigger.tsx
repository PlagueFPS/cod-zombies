"use client"
import { PanelLeftOpenIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useSidebar } from "../ui/sidebar"
import { cn } from "@/lib/utils"

export function CustomSideBarTrigger() {
  const { toggleSidebar, isMobile, state } = useSidebar()

  return (
    <Button
      variant={"outline"}
      onClick={ () => toggleSidebar() }
      aria-label="Toggle Sidebar"
      className={cn("hidden opacity-0 absolute top-4 left-4 z-500 bg-background/90 dark:bg-background/90 p-4", {
        'inline-flex opacity-100 animate-fade-in': state === 'collapsed'
      })}
    >
      <PanelLeftOpenIcon className="size-5" />
      <span className="sr-only">Toggle Sidebar</span>
      { !isMobile && (
        <kbd className={cn("ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 px-1.5 rounded bg-accent dark:bg-accent/25 border text-foreground font-medium opacity-100")}>
          <span className="text-xs">Ctrl+B</span>
        </kbd>
      )}
    </Button>
  )
}