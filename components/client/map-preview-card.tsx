import type { InteractiveMap } from "@/data/interactive-map"
import { Option } from "effect"
import { CustomLink } from "@/components/client/custom-link"
import { FeaturedImage } from "@/components/client/featured-image"
import { ComingSoonBadge, NewBadge } from "@/components/server/custom-badges"
import { Badge } from "@/components/ui/badge"
import { getGameByKey } from "@/data/games"
import { cn } from "@/lib/utils"

interface IMapPreviewCard {
	map: InteractiveMap
	index: number
}

export function MapPreviewCard({ map, index }: IMapPreviewCard) {
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
						{Option.match(game, {
							onNone: () => null,
							onSome: game => (
								<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
									{game.title}
								</Badge>
							),
						})}
					</div>
					<h3 className="text-xl font-bold transition-colors group-hover:text-primary group-focus-visible:text-primary">
						{map.title}
					</h3>
				</div>
			</div>
		</CustomLink>
	)
}
