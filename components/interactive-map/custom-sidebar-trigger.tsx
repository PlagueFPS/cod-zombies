"use client"
import { PanelLeftOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Shortcut from "../shortcut/shortcut"
import { Button } from "../ui/button"
import { useSidebar } from "../ui/sidebar"

export function CustomSideBarTrigger() {
	const { toggleSidebar, isMobile, openMobile, open } = useSidebar()

	const closedState = () => {
		if (isMobile) return !openMobile
		return !open
	}

	return (
		<Button
			variant={"outline"}
			onClick={() => toggleSidebar()}
			aria-label="Toggle Sidebar"
			className={cn(
				"fixed top-18 left-4 z-500 hidden bg-background/90 p-4 opacity-0 dark:bg-background/90",
				{
					"inline-flex animate-fade-in opacity-100": closedState(),
				},
			)}
		>
			<PanelLeftOpenIcon className="size-5" />
			<span className="sr-only">Toggle Sidebar</span>
			{!isMobile && <Shortcut shortcuts={["Ctrl", "B"]} size="sm" variant="ghost" />}
		</Button>
	)
}
