"use client"
import { PanelLeftOpenIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useSidebar } from "../ui/sidebar"

export function CustomSideBarTrigger() {
  const { toggleSidebar, state } = useSidebar()

  if (state === "collapsed") return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className="absolute top-4 left-4 size-7 z-500"
      onClick={ () => toggleSidebar() }
    >
      <PanelLeftOpenIcon className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )

  return null
}