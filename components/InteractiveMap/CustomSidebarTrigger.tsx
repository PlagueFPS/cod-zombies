"use client"
import { PanelLeftOpenIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useSidebar } from "../ui/sidebar"
import { cn } from "@/lib/utils"

export function CustomSideBarTrigger() {
  const { toggleSidebar, state } = useSidebar()

  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={ () => toggleSidebar() }
      aria-label="Toggle Sidebar"
      className={cn("hidden opacity-0 absolute top-4 left-4 size-8 z-500 bg-background/90 dark:bg-background/90 p-4", {
        'inline-flex opacity-100 animate-fade-in': state === 'collapsed'
      })}
    >
      <PanelLeftOpenIcon className="size-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}