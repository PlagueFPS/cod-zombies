"use client"
import { PanelLeftOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"
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
			className={cn("fixed top-18 left-4 z-500 hidden bg-background/90 p-4 opacity-0 dark:bg-background/90", {
				"inline-flex animate-fade-in opacity-100": closedState(),
			})}
		>
			<PanelLeftOpenIcon className="size-5" />
			<span className="sr-only">Toggle Sidebar</span>
			{!isMobile && (
				<kbd
					className={cn(
						"pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-accent px-1.5 font-medium text-foreground opacity-100 dark:bg-accent/25",
					)}
				>
					<span className="text-xs">Ctrl+B</span>
				</kbd>
			)}
		</Button>
	)
}
