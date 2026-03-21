import type { Route } from "next"
import type { Zombie } from "@/data/zombies"
import { Array as Arr, Option } from "effect"
import { CustomLink } from "@/components/client/custom-link"
import { FeaturedImage } from "@/components/client/featured-image"
import { ComingSoonBadge, NewBadge, TypeBadge } from "@/components/server/custom-badges"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getMapByKey } from "@/data/maps"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface IBestiaryCard {
	zombie: Omit<Zombie, "combatStrategy">
	zombieIndex: number
}

export function BestiaryCard({ zombie, zombieIndex }: IBestiaryCard) {
	const isMobile = useIsMobile()
	const priority = isMobile ? zombieIndex === 0 : zombieIndex <= 3
	const alt = `${zombie.title} Image`
	const map = Arr.head(zombie.maps).pipe(Option.flatMap(map => getMapByKey(map)))
	const { href, tabIndex, stateBadge, applyClasses } = Option.match(zombie.state, {
		onNone: () => ({
			href: `/bestiary/${zombie.id}`,
			tabIndex: 0,
			stateBadge: null,
			applyClasses: false,
		}),
		onSome: state => {
			const isComingSoon = state === "Coming Soon"
			return {
				href: isComingSoon ? "#" : `/bestiary/${zombie.id}`,
				tabIndex: isComingSoon ? -1 : 0,
				stateBadge: isComingSoon ? <ComingSoonBadge /> : <NewBadge />,
				applyClasses: isComingSoon,
			}
		},
	})

	return (
		<article className={cn("h-full max-h-113", { "pointer-events-none": applyClasses })}>
			<CustomLink
				href={href as Route}
				aria-label={`View details for ${zombie.title}`}
				aria-disabled={applyClasses}
				className="group outline-none"
				tabIndex={tabIndex}
			>
				<Card
					className={cn(
						`relative h-full animate-fade-in cursor-pointer overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-hover:outline-2 group-hover:outline-primary group-focus-visible:scale-105 group-focus-visible:outline-2 group-focus-visible:outline-primary dark:shadow-none`,
						{ "opacity-75 dark:opacity-50": applyClasses },
					)}
				>
					<div className="justify-end-safe absolute top-2 right-2 z-20 flex w-fit flex-wrap items-center gap-1">
						{stateBadge}
						<TypeBadge type={zombie.type} />
						{Option.match(map, {
							onNone: () => null,
							onSome: map => (
								<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
									{map.title}
								</Badge>
							),
						})}
					</div>
					<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-25 blur-2xl dark:flex">
						<FeaturedImage
							featuredImage={zombie.image}
							width={272}
							height={176}
							sizes="272px"
							className="aspect-square scale-150"
						/>
					</div>
					<CardHeader className="flex flex-col gap-2">
						<div className="relative size-full overflow-hidden">
							<FeaturedImage
								featuredImage={zombie.image}
								alt={alt}
								width={272}
								height={176}
								priority={priority}
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
