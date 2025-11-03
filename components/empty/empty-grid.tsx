import { Book, Brain } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty"

interface EmptyGridProps {
	type: "Quest" | "Zombie"
	className?: string
	title?: string
	description?: string
}

export default function EmptyGrid({ type, title, description, className }: EmptyGridProps) {
	return (
		<Empty className={className}>
			<EmptyHeader>
				<EmptyMedia variant="icon" className="text-primary">
					{type === "Quest" ? <Book /> : <Brain />}
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
