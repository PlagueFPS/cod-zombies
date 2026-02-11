"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Shortcut } from "@/components/client/shortcut"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
	className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
	const { theme, setTheme } = useTheme()

	const handleThemeToggle = () => {
		if (!document.startViewTransition) {
			if (theme === "light") setTheme("dark")
			else setTheme("light")
			return
		}

		document.startViewTransition(() => {
			if (theme === "light") setTheme("dark")
			else setTheme("light")
		})
	}

	useShortcut("t", () => handleThemeToggle())

	return (
		<div className="flex w-fit p-0.5">
			<Tooltip>
				<TooltipTrigger
					render={<Button variant="outline" size="icon" type="button" />}
					onClick={handleThemeToggle}
					aria-label="Toggle Theme; keyboard shortcut is T"
					className={cn("size-8 cursor-pointer", className)}
				>
					{theme === "dark" ? (
						<Sun className="size-4 transition-all" />
					) : (
						<Moon className="size-4 transition-all" />
					)}
				</TooltipTrigger>
				<TooltipContent sideOffset={5} className="flex items-center justify-center gap-2">
					<Shortcut shortcuts="T" size="sm" variant="outline" />
					<span>Toggle Theme</span>
				</TooltipContent>
			</Tooltip>
		</div>
	)
}
