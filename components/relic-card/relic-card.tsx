import type { Route } from "next"
import type { Relic } from "@/data/relics"
import { Option } from "effect"
import { ComingSoonBadge, NewBadge, TypeBadge } from "@/components/custom-badges/custom-badges"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { CustomLink } from "../custom-link/custom-link"
import FeaturedImage from "../featured-image/featured-image"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card"

interface RelicCardProps {
	relic: Omit<Relic, "content">
	relicIndex: number
}

export default function RelicCard({ relic, relicIndex }: RelicCardProps) {
	const isMobile = useIsMobile()
	const preload = isMobile ? relicIndex === 0 : relicIndex <= 3
	const { href, disabled, stateBadge, tabIndex } = Option.match(Option.fromNullable(relic.state), {
		onNone: () => ({
			href: `/relics/${relic.map.game.id}/${relic.id}`,
			disabled: false,
			tabIndex: 0,
			stateBadge: null,
		}),
		onSome: state => {
			const isComingSoon = state === "Coming Soon"
			return {
				href: isComingSoon ? "#" : `/relics/${relic.map.game.id}/${relic.id}`,
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
					<CardContent>
						<div className="relative flex aspect-square w-full items-center justify-center overflow-hidden">
							<FeaturedImage
								featuredImage={relic.image}
								alt={relic.title}
								width={128}
								height={128}
								priority={preload}
								sizes="128px"
								className="size-32 object-cover transition-transform group-hover:scale-105"
							/>
						</div>

						<div className="space-y-3 p-4">
							<div className="flex items-start justify-between gap-2">
								<CardTitle className="leading-tight transition-colors group-hover:text-primary">
									{relic.title}
								</CardTitle>
							</div>
						</div>

						<div className="flex flex-wrap gap-2">
							{stateBadge}
							<Badge>{relic.map.title}</Badge>
							<TypeBadge type={relic.type} />
						</div>

						<CardDescription className="text-foreground/85 leading-relaxed">
							{relic.description}
						</CardDescription>
					</CardContent>
				</Card>
			</CustomLink>
		</article>
	)
}
