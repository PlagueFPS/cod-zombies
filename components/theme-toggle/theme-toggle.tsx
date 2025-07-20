"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface ThemeToggleProps {
	className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
	const { theme, setTheme } = useTheme()

	const handleThemeToggle = () => {
		if (theme === "light") setTheme("dark")
		else setTheme("light")
	}

	useShortcut("t", () => handleThemeToggle())

	return (
		<div className="flex w-fit p-0.5">
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						type="button"
						aria-label="Toggle Theme; keyboard shorcut is T"
						className={cn("size-8 cursor-pointer bg-transparent text-foreground", className, {
							"bg-accent text-foreground": theme === "light",
						})}
						onClick={handleThemeToggle}
					>
						{theme === "dark" ? (
							<Sun className="size-4 transition-all" />
						) : (
							<Moon className="size-4 transition-all" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent sideOffset={5} className="z-999 flex items-center justify-center gap-2">
					<span>Toggle Theme</span>
					<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-medium text-muted-foreground text-xs opacity-100">
						T
					</kbd>
				</TooltipContent>
			</Tooltip>
		</div>
	)
}
