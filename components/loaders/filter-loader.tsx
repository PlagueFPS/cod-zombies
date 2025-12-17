import { CirclePlus } from "lucide-react"
import { Button } from "../ui/button"

interface IFilterLoader {
	filters: string[]
}

export default function FilterLoader({ filters }: IFilterLoader) {
	return (
		<div className="-mt-4 flex w-full items-center gap-2">
			{filters.map((filter, index) => (
				<Button
					key={`filter-${filter}-${index + 1}`}
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
