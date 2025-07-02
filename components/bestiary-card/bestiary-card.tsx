import type { MinifiedZombie } from "@/data/zombies"
import { cn } from "@/lib/utils"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { ChangedBadge, ComingSoonBadge, DraftBadge, NewBadge, TypeBadge } from "../custom-badges/custom-badges"
import { CustomLink } from "../custom-link/custom-link"
import FeaturedImage from "../featured-image/featured-image"
import { Badge } from "../ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface IBestiaryCard {
	zombie: MinifiedZombie
	zombieIndex: number
	draftMode: boolean
}

export default function BestiaryCard({ zombie, zombieIndex, draftMode }: IBestiaryCard) {
	const priority = zombieIndex === 0
	const alt = `${zombie.name} Image`
	const href = zombie.isComingSoon ? `#` : `/bestiary/${zombie.slug}`

	return (
		<article className={cn("group h-full max-h-113 outline-hidden", { "pointer-events-none": zombie.isComingSoon })}>
			<CustomLink href={href} aria-label={`View details for ${zombie.name}`} aria-disabled={zombie.isComingSoon}>
				<Card
					className={cn(
						`relative h-full animate-fade-in cursor-pointer overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-hover:border-primary group-focus-visible:scale-105 group-focus-visible:border-primary dark:shadow-none`,
						{ "opacity-75 dark:opacity-50": zombie.isComingSoon },
					)}
				>
					<div className="absolute top-2 right-2 z-20 flex w-fit items-center justify-center gap-1">
						{(draftMode || IN_DEVELOPMENT) && zombie.isDraft ? <DraftBadge /> : null}
						{(draftMode || IN_DEVELOPMENT) && zombie.isChanged ? <ChangedBadge /> : null}
						{zombie.isComingSoon ? <ComingSoonBadge /> : zombie.isNew ? <NewBadge /> : null}
						<TypeBadge type={zombie.type} />
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">{zombie.games[0].title}</Badge>
					</div>
					<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-25 blur-2xl dark:flex">
						<FeaturedImage
							featuredImage={zombie.image}
							priority={priority}
							quality={1}
							sizes="32px"
							className="aspect-square scale-150"
						/>
					</div>
					<CardHeader className="flex flex-col gap-2">
						<div className="relative size-full overflow-hidden">
							<FeaturedImage
								featuredImage={zombie.image}
								priority={priority}
								alt={alt}
								sizes="272px"
								className="h-44 rounded-md object-cover object-top"
							/>
						</div>
						<CardTitle className="text-xl group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">
							{zombie.name}
						</CardTitle>
						<CardDescription className="text-foreground/85">{zombie.description}</CardDescription>
					</CardHeader>
				</Card>
			</CustomLink>
		</article>
	)
}
