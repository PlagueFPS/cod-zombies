import { cn } from "cn"
import { Predicate } from "effect"
import { PanelLeftOpenIcon } from "lucide-react"
import { Shortcut } from "@/components/shortcut"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

interface ICustomSidebarTrigger {
	className?: string
}

export function CustomSideBarTrigger({ className }: ICustomSidebarTrigger) {
	const { toggleSidebar, isMobile, openMobile, open } = useSidebar()

	const closedState = () => {
		if (Predicate.isNotNullish(isMobile) && Predicate.isTruthy(isMobile))
			return !(Predicate.isNotNullish(openMobile) && Predicate.isTruthy(openMobile))

		return !(Predicate.isNotNullish(open) && Predicate.isTruthy(open))
	}

	return (
		<Button
			variant="outline"
			onClick={() => toggleSidebar()}
			aria-label="Toggle Sidebar"
			className={cn(
				"fixed top-28 left-4 z-50 hidden cursor-pointer bg-popover p-4 opacity-0 md:top-18 dark:bg-popover hover:dark:bg-background",
				{
					"inline-flex animate-fade-in opacity-100": closedState(),
					"top-20": isMobile,
				},
				className,
			)}
		>
			<PanelLeftOpenIcon className="size-5 transition-all" />
			<span className="sr-only">Toggle Sidebar</span>
			{!(Predicate.isNotNullish(isMobile) && Predicate.isTruthy(isMobile)) && (
				<Shortcut shortcut="Mod+B" size="sm" variant="ghost" />
			)}
		</Button>
	)
}
