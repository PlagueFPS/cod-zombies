import type { Zombie } from "@/data/zombies"
import { Option } from "effect"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { ComingSoonBadge, NewBadge, TypeBadge } from "../custom-badges/custom-badges"
import { CustomLink } from "../custom-link/custom-link"
import FeaturedImage from "../featured-image/featured-image"
import { Badge } from "../ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface IBestiaryCard {
	zombie: Omit<Zombie, "combatStrategy">
	zombieIndex: number
}

export default function BestiaryCard({ zombie, zombieIndex }: IBestiaryCard) {
	const isMobile = useIsMobile()
	const priority = isMobile ? zombieIndex === 0 : zombieIndex <= 3
	const alt = `${zombie.title} Image`
	const state = Option.getOrNull(zombie.state)

	return (
		<article className={cn("h-full max-h-113", { "pointer-events-none": state === "Coming Soon" })}>
			<CustomLink
				href={state === "Coming Soon" ? `#` : `/bestiary/${zombie.id}`}
				aria-label={`View details for ${zombie.title}`}
				aria-disabled={state === "Coming Soon"}
				className="group outline-none"
				tabIndex={state === "Coming Soon" ? -1 : 0}
			>
				<Card
					className={cn(
						`relative h-full animate-fade-in cursor-pointer overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-hover:outline-2 group-hover:outline-primary group-focus-visible:scale-105 group-focus-visible:outline-2 group-focus-visible:outline-primary dark:shadow-none`,
						{ "opacity-75 dark:opacity-50": state === "Coming Soon" },
					)}
				>
					<div className="absolute top-2 right-2 z-20 flex w-fit items-center justify-center gap-1">
						{state === "Coming Soon" ? <ComingSoonBadge /> : state === "New" ? <NewBadge /> : null}
						<TypeBadge type={zombie.type} />
						{zombie.maps[0] ? (
							<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
								{zombie.maps[0].title}
							</Badge>
						) : null}
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
