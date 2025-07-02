import { CirclePlus } from "lucide-react"
import { Button } from "../ui/button"

export default function MapFiltersLoader() {
	return (
		<div className="-mt-4 flex w-full items-center gap-2">
			{["Game", "Difficulty"].map((filter, index) => (
				<Button
					key={`map-filter-${filter}-${index + 1}`}
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
