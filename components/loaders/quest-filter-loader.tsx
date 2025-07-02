import { CirclePlus } from "lucide-react"
import { Button } from "../ui/button"

export default function QuestFilterLoader() {
	return (
		<div className="-mt-4 flex w-full items-center gap-2">
			<Button variant="outline" size="sm" aria-expanded={false} disabled aria-disabled className="gap-2 border-dashed">
				<CirclePlus className="size-4 text-primary" />
				{"Map"}
			</Button>
		</div>
	)
}
