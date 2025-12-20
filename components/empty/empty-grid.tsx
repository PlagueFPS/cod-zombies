import { Match } from "effect"
import { Book, Brain, Stone } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty"

interface EmptyGridProps {
	type: "Quest" | "Zombie" | "Relic"
	className?: string
	title?: string
	description?: string
}

export default function EmptyGrid({ type, title, description, className }: EmptyGridProps) {
	return (
		<Empty className={className}>
			<EmptyHeader>
				<EmptyMedia variant="icon" className="text-primary">
					{Match.value(type).pipe(
						Match.when("Quest", () => <Book />),
						Match.when("Zombie", () => <Brain />),
						Match.when("Relic", () => <Stone />),
						Match.exhaustive,
					)}
				</EmptyMedia>
				<EmptyTitle>{title || `No ${type}s Found`}</EmptyTitle>
				<EmptyDescription>
					{description ||
						`No ${type.toLowerCase()}s match the selected filters. Reset the filters or select different filters.`}
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	)
}
