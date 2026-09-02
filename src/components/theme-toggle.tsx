import { useHotkey } from "@tanstack/react-hotkeys"
import { cn } from "cn"
import { Moon, Sun } from "lucide-react"
import { Shortcut } from "@/components/shortcut"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/contexts/theme-provider"

interface ThemeToggleProps {
	className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme()

	const handleThemeToggle = () => {
		const flip = () => {
			if (resolvedTheme === "light") setTheme("dark")
			else setTheme("light")
		}

		if (!document.startViewTransition) {
			return flip()
		}

		document.startViewTransition(flip)
	}

	useHotkey("T", () => handleThemeToggle(), { requireReset: true })

	return (
		<div className="flex w-fit p-0.5">
			<Tooltip>
				<TooltipTrigger
					render={<Button variant="outline" size="icon" type="button" />}
					onClick={handleThemeToggle}
					aria-label="Toggle Theme; keyboard shortcut is T"
					className={cn("size-8 cursor-pointer", className)}
				>
					{resolvedTheme === "dark" ? (
						<Sun className="size-4 transition-all" />
					) : (
						<Moon className="size-4 transition-all" />
					)}
				</TooltipTrigger>
				<TooltipContent sideOffset={5} className="flex items-center justify-center gap-2">
					<Shortcut shortcut="T" size="sm" variant="outline" />
					<span>Toggle Theme</span>
				</TooltipContent>
			</Tooltip>
		</div>
	)
}
