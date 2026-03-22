import { Search } from "lucide-react"
import { Shortcut } from "@/components/client/shortcut"
import { Button } from "@/components/ui/button"
import { IS_MAC_OS } from "@/utils/constants"

export function SearchBarLoader() {
	return (
		<div className="flex w-fit items-center justify-center">
			<Button
				type="button"
				size="sm"
				variant="outline"
				disabled
				className="relative hidden w-64 animate-pulse gap-x-2 rounded-sm text-xs text-muted-foreground sm:flex"
			>
				<Search className="size-5" />
				<span className="text-sm">Search Maps</span>
				<Shortcut shortcuts={IS_MAC_OS ? ["⌘", "K"] : ["Ctrl", "K"]} size="sm" />
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
