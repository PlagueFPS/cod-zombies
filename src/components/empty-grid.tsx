import { Match } from "effect"
import { BookIcon, BrainIcon, MapIcon, StoneIcon } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

interface EmptyGridProps {
	type: "Quest" | "Zombie" | "Relic" | "Map"
	className?: string
	title?: string
	description?: string
}

export function EmptyGrid({ type, title, description, className }: EmptyGridProps) {
	return (
		<Empty className={className}>
			<EmptyHeader>
				<EmptyMedia variant="icon" className="text-primary">
					{Match.value(type).pipe(
						Match.when("Quest", () => <BookIcon />),
						Match.when("Zombie", () => <BrainIcon />),
						Match.when("Relic", () => <StoneIcon />),
						Match.when("Map", () => <MapIcon />),
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
