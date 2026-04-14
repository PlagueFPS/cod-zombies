import type React from "react"
import { formatForDisplay, type RegisterableHotkey } from "@tanstack/react-hotkeys"
import { cva } from "class-variance-authority"
import { Children } from "react"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"

interface ShortcutWithChildren {
	/** Custom content (e.g. icons) to show as keybindings; each child is wrapped in a Kbd. */
	children: React.ReactNode
	className?: string
	variant?: "default" | "outline" | "ghost"
	size?: "sm" | "md" | "lg"
	shortcut?: never
	useSymbols?: never
}

interface ShortcutWithShortcuts {
	/** String shortcut(s) to display as keybindings. */
	shortcut: RegisterableHotkey
	useSymbols?: boolean
	children?: never
	className?: string
	variant?: "default" | "outline" | "ghost"
	size?: "sm" | "md" | "lg"
}

type ShortcutProps = ShortcutWithChildren | ShortcutWithShortcuts

const shortcutVariants = cva(
	"inline-flex items-center justify-center font-mono font-medium rounded border transition-colors",
	{
		variants: {
			variant: {
				default:
					"bg-muted border-input text-muted-foreground shadow-sm dark:bg-input/30 dark:border-input dark:text-foreground/60 dark:shadow-none",
				outline: "bg-transparent border-input text-muted-foreground",
				ghost:
					"bg-muted border-muted text-muted-foreground dark:bg-input/30 dark:border-input dark:text-foreground/60",
			},
			size: {
				sm: "text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5",
				md: "text-sm px-2 py-1 min-w-[1.5rem] h-6",
				lg: "text-base px-2.5 py-1.5 min-w-[2rem] h-8",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
)

export function Shortcut({
	shortcut,
	useSymbols = true,
	children,
	className,
	variant = "default",
	size = "md",
}: ShortcutProps) {
	const kbdClassName = cn(shortcutVariants({ variant, size }), className)

	return (
		<KbdGroup>
			{shortcut ? (
				<Kbd className={kbdClassName}>{formatForDisplay(shortcut, { useSymbols })}</Kbd>
			) : (
				Children.toArray(children).map((child, index) => {
					const key = `shortcut-${index + 1}`
					return (
						<Kbd key={key} className={kbdClassName}>
							{child}
						</Kbd>
					)
				})
			)}
		</KbdGroup>
	)
}
