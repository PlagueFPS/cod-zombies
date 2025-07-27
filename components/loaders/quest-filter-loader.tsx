import { CirclePlus } from "lucide-react"
import { Button } from "../ui/button"

interface IQuestFilterLoader {
	filters: string[]
}

export default function QuestFilterLoader({ filters }: IQuestFilterLoader) {
	return (
		<div className="-mt-4 flex w-full items-center gap-2">
			{filters.map((filter, index) => (
				<Button
					key={`quest-filter-${filter}-${index + 1}`}
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
