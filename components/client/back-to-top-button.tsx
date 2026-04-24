"use client"
import { useHotkey } from "@tanstack/react-hotkeys"
import { Shortcut } from "@/components/client/shortcut"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface BackToTopButtonProps extends React.ComponentProps<"button"> {
	mobile?: boolean
}

export function BackToTopButton({
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

	useHotkey("Alt+T", () => scrollToTop())

	return (
		<Tooltip>
			<TooltipTrigger onClick={scrollToTop} className={className} render={<Button {...props} />}>
				<span>Scroll to Top</span>
			</TooltipTrigger>
			<TooltipContent side="bottom" sideOffset={6}>
				<div className="flex items-center gap-1">
					<Shortcut shortcut="Alt+T" size="sm" variant="ghost" />
					<span>to scroll to top</span>
				</div>
			</TooltipContent>
		</Tooltip>
	)
}
