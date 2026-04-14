import type { InteractiveMap } from "@/data/interactive-map"
import type { PreviewCard } from "@/types/preview-card"
import { Option } from "effect"
import { ComingSoonBadge, NewBadge } from "@/components/custom-badges"
import { CustomLink } from "@/components/custom-link"
import { FeaturedImage } from "@/components/featured-image"
import { Badge } from "@/components/ui/badge"
import { getGameByKey } from "@/data/games"
import { cn } from "@/lib/utils"

interface IMapPreviewCard extends PreviewCard {
	map: InteractiveMap
}

export function MapPreviewCard({ map, priority }: IMapPreviewCard) {
	// SAFETY: map.game is guaranteed to be a valid game key
	const game = getGameByKey(map.game).pipe(Option.getOrThrow)
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
			to="/maps/$mapId"
			params={{ mapId: map.id }}
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
						alt={`${map.title} interactive map`}
						sizes="420px"
						width={418}
						height={300}
						loading={priority ? "eager" : "lazy"}
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
					<h3 className="text-xl font-bold transition-colors group-hover:text-primary group-focus-visible:text-primary">
						{map.title}
					</h3>
				</div>
			</div>
		</CustomLink>
	)
}
