import type { Relic } from "@/data/relics"
import type { Route } from "next"
import { Option } from "effect"
import { CustomLink } from "@/components/client/custom-link"
import { FeaturedImage } from "@/components/client/featured-image"
import {
	ComingSoonBadge,
	EstimatedTimeBadge,
	NewBadge,
	TypeBadge,
} from "@/components/server/custom-badges"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getMapByKey } from "@/data/maps"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { shouldPreloadPreviewCardImage } from "@/utils/shared-functions"

interface RelicCardProps {
	relic: Omit<Relic, "content">
	relicIndex: number
}

export function RelicCard({ relic, relicIndex }: RelicCardProps) {
	const isMobile = useIsMobile()
	const preload = shouldPreloadPreviewCardImage(isMobile, relicIndex)
	const map = getMapByKey(relic.map)
	const { href, disabled, stateBadge, tabIndex } = Option.match(relic.state, {
		onNone: () => {
			return {
				href: Option.match(map, {
					onNone: () => null,
					onSome: map => `/relics/${map.game}/${relic.id}`,
				}),
				disabled: false,
				tabIndex: 0,
				stateBadge: null,
			}
		},
		onSome: state => {
			const isComingSoon = state === "Coming Soon"
			return {
				href: isComingSoon || Option.isNone(map) ? null : `/relics/${map.value.game}/${relic.id}`,
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
				href={href as Route}
				aria-label={`View Guide for the ${relic.title} relic`}
				aria-disabled={disabled || !href}
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
							{Option.match(map, {
								onNone: () => null,
								onSome: map => map.title,
							})}
						</Badge>
					</div>
					<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-25 blur-3xl dark:flex">
						<FeaturedImage
							featuredImage={relic.image}
							width={272}
							height={272}
							sizes="272px"
							className="aspect-square scale-150 object-center"
						/>
					</div>
					<CardHeader className="flex flex-col gap-4">
						<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted/50">
							<FeaturedImage
								featuredImage={relic.image}
								alt={relic.title}
								width={272}
								height={272}
								priority={preload}
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
