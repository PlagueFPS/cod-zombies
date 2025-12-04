import type { MapConfigMetadata } from "@/map-configs"
import { Option } from "effect"
import { ComingSoonBadge, NewBadge } from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import { Badge } from "@/components/ui/badge"
import { getGameByKey } from "@/data/games"
import { cn } from "@/lib/utils"
import FeaturedImage from "../featured-image/featured-image"

interface IPreviewCard {
	map: MapConfigMetadata
	index: number
}

export default function PreviewCard({ map, index }: IPreviewCard) {
	const game = getGameByKey(map.game)
	const { disabled, tabIndex, stateBadge } = Option.match(map.state, {
		onNone: () => ({
			disabled: false,
			tabIndex: 0,
			stateBadge: null,
		}),
		onSome: state => {
			const isComingSoon = state === "Coming Soon"
			return {
				disabled: isComingSoon,
				tabIndex: isComingSoon ? -1 : 0,
				stateBadge: isComingSoon ? <ComingSoonBadge /> : <NewBadge />,
			}
		},
	})

	return (
		<CustomLink
			href={`/maps/${map.id}`}
			aria-label={`View ${map.title} interactive map`}
			className={cn("group outline-none", {
				"pointer-events-none opacity-75 dark:opacity-50": disabled,
			})}
			aria-disabled={disabled}
			tabIndex={tabIndex}
		>
			<div className="flex flex-col items-start justify-center gap-4">
				<div className="flex w-full items-center justify-center overflow-hidden rounded-md shadow-xl group-focus-visible:outline-2 group-focus-visible:outline-primary dark:shadow-none">
					<FeaturedImage
						featuredImage={map.image}
						priority={index === 0}
						sizes="420px"
						width={418}
						height={300}
						className="transition-transform duration-300 will-change-transform group-focus-visible:scale-105"
					/>
				</div>
				<div className="flex flex-col items-start justify-center">
					<div className="flex items-center gap-2">
						{stateBadge}
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
							{game.title}
						</Badge>
					</div>
					<h3 className="font-bold text-xl transition-colors group-hover:text-primary group-focus-visible:text-primary">
						{map.title}
					</h3>
				</div>
			</div>
		</CustomLink>
	)
}
