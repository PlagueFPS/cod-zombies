import type { Zombie } from "@/data/zombies"
import type { PreviewCard } from "@/types/preview-card"
import { cn } from "cn"
import { Array as Arr, Option } from "effect"
import { CardImageGlow } from "@/components/card-image-glow"
import { ComingSoonBadge, NewBadge, TypeBadge } from "@/components/custom-badges"
import { CustomLink } from "@/components/custom-link"
import { FeaturedImage } from "@/components/featured-image"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMapByKey } from "@/data/maps"

interface IBestiaryCard extends PreviewCard {
	zombie: Omit<Zombie, "combatStrategy">
}

export function BestiaryCard({ zombie, priority, fetchPriority }: IBestiaryCard) {
	const alt = `${zombie.title} Image`
	const map = Arr.head(zombie.maps).pipe(
		Option.flatMap(map => getMapByKey(map)),
		// SAFETY: zombie.maps is guaranteed to have at least one map
		Option.getOrThrow,
	)
	const { tabIndex, stateBadge, applyClasses } = Option.match(zombie.state, {
		onNone: () => ({
			tabIndex: 0,
			stateBadge: null,
			applyClasses: false,
		}),
		onSome: state => {
			const isComingSoon = state === "Coming Soon"
			return {
				tabIndex: isComingSoon ? -1 : 0,
				stateBadge: isComingSoon ? <ComingSoonBadge /> : <NewBadge />,
				applyClasses: isComingSoon,
			}
		},
	})

	return (
		<article className={cn("h-full max-h-113", { "pointer-events-none": applyClasses })}>
			<CustomLink
				to="/bestiary/$zombieId"
				params={{ zombieId: zombie.id }}
				aria-label={`View details for ${zombie.title}`}
				aria-disabled={applyClasses}
				disabled={applyClasses}
				className="group outline-none"
				tabIndex={tabIndex}
			>
				<Card
					className={cn(
						`relative h-full animate-fade-in cursor-pointer overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-hover:outline-2 group-hover:outline-primary group-focus-visible:scale-105 group-focus-visible:outline-2 group-focus-visible:outline-primary dark:shadow-none`,
						{ "opacity-75 dark:opacity-50": applyClasses },
					)}
				>
					<div className="absolute top-2 right-2 z-20 flex w-fit flex-wrap items-center justify-end-safe gap-1">
						{stateBadge}
						<TypeBadge type={zombie.type} />
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
							{map.title}
						</Badge>
					</div>
					<CardImageGlow src={zombie.image} className="scale-150" />
					<CardHeader className="flex flex-col gap-2">
						<div className="relative size-full overflow-hidden">
							<FeaturedImage
								featuredImage={zombie.image}
								alt={alt}
								width={272}
								height={176}
								loading={priority ? "eager" : "lazy"}
								fetchPriority={fetchPriority}
								sizes="272px"
								className="h-44 rounded-md object-cover object-top"
							/>
						</div>
						<CardTitle className="text-xl group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">
							{zombie.title}
						</CardTitle>
						<CardDescription className="text-foreground/85">{zombie.description}</CardDescription>
					</CardHeader>
				</Card>
			</CustomLink>
		</article>
	)
}
