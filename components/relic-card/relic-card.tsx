import type { Route } from "next"
import type { Relic } from "@/data/relics"
import { Option } from "effect"
import { ComingSoonBadge, NewBadge, TypeBadge } from "@/components/custom-badges/custom-badges"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { CustomLink } from "../custom-link/custom-link"
import FeaturedImage from "../featured-image/featured-image"
import { Badge } from "../ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"

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
					<div className="justify-end-safe absolute top-2 right-2 z-20 flex w-fit flex-wrap items-center gap-1">
						{stateBadge}
						<TypeBadge type={relic.type} />
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
							{relic.map.title}
						</Badge>
					</div>
					<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-25 blur-2xl dark:flex">
						<FeaturedImage
							featuredImage={relic.image}
							width={272}
							height={272}
							sizes="272px"
							className="aspect-square scale-150"
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
							<CardTitle className="text-xl leading-tight transition-colors group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">
								{relic.title}
							</CardTitle>
							<Separator className="opacity-50" />
							<CardDescription className="text-foreground/85 leading-relaxed">
								{relic.description}
							</CardDescription>
						</div>
					</CardHeader>
				</Card>
			</CustomLink>
		</article>
	)
}
