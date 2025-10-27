"use client"
import { ArrowUp } from "lucide-react"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"
import { IS_MAC_OS } from "@/utils/constants"
import Shortcut from "../shortcut/shortcut"
import { Button, type ButtonProps } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface BackToTopButtonProps extends React.ComponentProps<"button"> {
	mobile?: boolean
}

export default function BackToTopButton({
	mobile,
	className,
	...props
}: BackToTopButtonProps & ButtonProps) {
	// This function provides a much faster scroll to top similar to the Ctrl+Home behavior
	// while still providing a "smooth" animation unlike the `window.scrollTo(0, 0)` function
	const scrollToTop = () => {
		const start = window.pageYOffset
		const startTime = performance.now()

		const animateScroll = (currentTime: DOMHighResTimeStamp) => {
			const elapsed = currentTime - startTime
			const progress = Math.min(elapsed / 200, 1)
			const easeProgress = 0.5 * (1 - Math.cos(Math.PI * progress))

			window.scrollTo(0, start * (1 - easeProgress))

			if (elapsed < 200) {
				requestAnimationFrame(animateScroll)
			}
		}

		requestAnimationFrame(animateScroll)
	}

	useShortcut("alt+t", scrollToTop)

	return (
		<>
			{mobile ? (
				<Button
					onClick={scrollToTop}
					size="icon"
					className={cn("fixed right-4 bottom-16 z-20 rounded-full", className)}
					title="Back to Top"
					aria-label="Scroll to Top"
					{...props}
				>
					<ArrowUp className="size-6" />
				</Button>
			) : (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button onClick={scrollToTop} className={className} {...props}>
							<span>Scroll to Top</span>
						</Button>
					</TooltipTrigger>
					<TooltipContent side="bottom" sideOffset={6}>
						<div className="flex items-center gap-1">
							<Shortcut
								shortcuts={IS_MAC_OS ? ["Option", "T"] : ["Alt", "T"]}
								size="sm"
								variant="ghost"
							/>
							<span>to scroll to top</span>
						</div>
					</TooltipContent>
				</Tooltip>
			)}
		</>
	)
}
