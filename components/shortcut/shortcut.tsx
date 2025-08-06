import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

interface ShortcutProps {
	shortcuts: string | string[]
	className?: string
	variant?: "default" | "outline" | "ghost"
	size?: "sm" | "md" | "lg"
}

const shortvutVariants = cva(
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

export default function Shortcut({
	shortcuts,
	className,
	variant = "default",
	size = "md",
}: ShortcutProps) {
	const shortcutArray = Array.isArray(shortcuts) ? shortcuts : [shortcuts]

	return (
		<span className="inline-flex items-center gap-1">
			{shortcutArray.map((shortcut, index) => (
				<span key={`${shortcut}-${index + 1}`} className="inline-flex items-center gap-1">
					<kbd className={cn(shortvutVariants({ variant, size }), className)}>{shortcut}</kbd>
				</span>
			))}
		</span>
	)
}
