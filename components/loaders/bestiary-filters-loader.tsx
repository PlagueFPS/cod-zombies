import { CirclePlus } from "lucide-react"
import { Button } from "../ui/button"

export default function BestiaryFiltersLoader() {
	return (
		<div className="-mt-4 flex w-full items-center gap-2">
			{["Type", "Game", "Map"].map((filter) => (
				<Button
					key={`bestiary-filter-${filter}`}
					variant="outline"
					size="sm"
					aria-expanded={false}
					disabled
					aria-disabled
					className="gap-2 border-dashed"
				>
					<CirclePlus className="size-4 text-primary" />
					{filter}
				</Button>
			))}
		</div>
	)
}
