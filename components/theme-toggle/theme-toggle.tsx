"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
	className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
	const { theme, setTheme } = useTheme()

	const handleThemeToggle = () => {
		if (theme === "light") setTheme("dark")
		else setTheme("light")
	}

	return (
		<div className="flex w-fit p-0.5">
			<Button
				variant="outline"
				size="icon"
				type="button"
				aria-label="Toggle Theme"
				title="Toggle Theme"
				className={cn("size-8 cursor-pointer bg-transparent text-foreground", className, {
					"bg-accent text-foreground": theme === "light",
				})}
				onClick={handleThemeToggle}
			>
				{theme === "dark" ? <Sun className="size-4 transition-all" /> : <Moon className="size-4 transition-all" />}
			</Button>
		</div>
	)
}
