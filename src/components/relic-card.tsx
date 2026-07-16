import type { Relic } from "@/data/relics"
import type { PreviewCard } from "@/types/preview-card"
import { Option } from "effect"
import { CardImageGlow } from "@/components/card-image-glow"
import {
	ComingSoonBadge,
	EstimatedTimeBadge,
	NewBadge,
	TypeBadge,
} from "@/components/custom-badges"
import { CustomLink } from "@/components/custom-link"
import { FeaturedImage } from "@/components/featured-image"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getGameByKey } from "@/data/games"
import { getMapByKey } from "@/data/maps"
import { cn } from "@/lib/utils"

interface RelicCardProps extends PreviewCard {
	relic: Omit<Relic, "content">
}

export function RelicCard({ relic, priority, fetchPriority }: RelicCardProps) {
	// SAFETY: we know both these keys exist since they are directly derived from the
	// source data.
	const map = getMapByKey(relic.map).pipe(Option.getOrThrow)
	const game = getGameByKey(map.game).pipe(Option.getOrThrow)
	const { disabled, stateBadge, tabIndex } = Option.match(relic.state, {
		onNone: () => {
			return {
				disabled: false,
				tabIndex: 0,
				stateBadge: null,
			}
		},
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
		<article
			className={cn("h-full", {
				"pointer-events-none": disabled,
			})}
		>
			<CustomLink
				to="/relics/$gameId/$relicId"
				params={{ gameId: game.id, relicId: relic.id }}
				aria-label={`View Guide for the ${relic.title} relic`}
				aria-disabled={disabled}
				tabIndex={tabIndex}
				className="group outline-none"
			>
				<Card
					className={cn(
						`relative h-full animate-fade-in cursor-pointer overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-hover:outline-2 group-hover:outline-primary group-focus-visible:scale-105 group-focus-visible:outline-2 group-focus-visible:outline-primary dark:shadow-none`,
						{ "opacity-75 dark:opacity-50": disabled },
					)}
				>
					<div className="absolute top-2 right-2 z-20 flex w-fit flex-wrap items-center justify-end-safe gap-1">
						{stateBadge}
						<TypeBadge type={relic.type} />
						<EstimatedTimeBadge timeRange={relic.estimatedTimeMins} />
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
							{map.title}
						</Badge>
					</div>
					<CardImageGlow src={relic.image} className="scale-150 blur-3xl" />
					<CardHeader className="flex flex-col gap-4">
						<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted/50">
							<FeaturedImage
								featuredImage={relic.image}
								alt={relic.title}
								width={272}
								height={272}
								loading={priority ? "eager" : "lazy"}
								fetchPriority={fetchPriority}
								sizes="272px"
								className="size-40 object-contain transition-transform group-hover:scale-110"
							/>
						</div>
						<div className="space-y-3">
							<CardTitle className="text-xl leading-tight transition-colors">
								{relic.title}
							</CardTitle>
							<Separator className="opacity-50" />
							<CardDescription className="leading-relaxed text-foreground/85">
								{relic.description}
							</CardDescription>
						</div>
					</CardHeader>
				</Card>
			</CustomLink>
		</article>
	)
}
