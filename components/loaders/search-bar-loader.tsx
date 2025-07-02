import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SearchBarLoader() {
	return (
		<div className="flex w-fit items-center justify-center">
			<Button
				type="button"
				size="sm"
				variant="outline"
				disabled
				className="relative hidden w-64 animate-pulse gap-x-2 rounded-sm text-muted-foreground text-xs sm:flex"
			>
				<Search className="size-5" />
				<span className="text-sm">Search Maps</span>
				<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-medium text-muted-foreground opacity-100">
					<span className="text-xs">Ctrl+K</span>
				</kbd>
			</Button>
			<Button
				type="button"
				size="icon"
				variant="ghost"
				disabled
				className="flex animate-pulse text-muted-foreground sm:hidden"
			>
				<Search className="size-6" />
			</Button>
		</div>
	)
}
