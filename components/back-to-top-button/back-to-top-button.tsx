"use client"
import { ArrowUp } from "lucide-react"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"
import { IS_MAC_OS } from "@/utils/constants"
import { Button, type ButtonProps } from "../ui/button"

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
					{...props}
				>
					<ArrowUp className="size-6" />
				</Button>
			) : (
				<Button onClick={scrollToTop} className={className} {...props}>
					<span>Back to Top</span>
					<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-medium text-muted-foreground text-xs opacity-100">
						{IS_MAC_OS ? "Option+T" : "Alt+T"}
					</kbd>
				</Button>
			)}
		</>
	)
}
