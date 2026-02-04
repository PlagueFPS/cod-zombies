import { Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ThemeToggleLoader() {
	return (
		<div className="flex w-fit p-0.5">
			<Button
				variant="outline"
				size="icon"
				type="button"
				aria-label="Toggle Theme"
				title="Toggle Theme"
				disabled
				aria-disabled
				className="size-8 rounded-full border-none bg-transparent text-muted-foreground"
			>
				<Sun className="size-4 transition-all" />
			</Button>
		</div>
	)
}
