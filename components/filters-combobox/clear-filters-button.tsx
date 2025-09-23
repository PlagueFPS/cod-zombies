import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

export default function ClearFiltersButton({
	className,
	...props
}: React.ComponentProps<"button">) {
	return (
		<Button
			variant="outline"
			size={"sm"}
			className={cn("gap-2 border-red-700 dark:border-red-500", className)}
			{...props}
		>
			<Trash2 className="size-4 text-red-600 dark:text-red-400" />
			<span>Clear</span>
		</Button>
	)
}
