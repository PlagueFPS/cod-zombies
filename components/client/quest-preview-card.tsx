import type { SideQuest } from "@/data/side-quests"
import type { Route } from "next"
import { Match, Option } from "effect"
import { CustomLink } from "@/components/client/custom-link"
import { FeaturedImage } from "@/components/client/featured-image"
import {
	ComingSoonBadge,
	DifficultyBadge,
	EstimatedTimeBadge,
	NewBadge,
} from "@/components/server/custom-badges"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getGameByKey } from "@/data/games"
import { getMapByKey, type MapEntry } from "@/data/maps"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { isMapQuest, isSideQuest } from "@/utils/rsc-wire"

interface IQuestPreviewCard {
	quest: Omit<MapEntry, "mainQuest"> | Omit<SideQuest, "content">
	questIndex: number
}

export function QuestPreviewCard({ quest, questIndex }: IQuestPreviewCard) {
	const isMobile = useIsMobile()
	const priority = isMobile ? questIndex === 0 : questIndex <= 3
	const { title, description, alt, href, map, game, image } = Match.value(quest).pipe(
		Match.when(isMapQuest, quest => ({
			title: quest.title,
			description: quest.description,
			alt: `${quest.title} map image`,
			href: `/main-quests/${quest.game}/${quest.id}`,
			image: quest.image,
			map: Option.none(),
			game: Option.match(getGameByKey(quest.game), {
				onNone: () => Option.none(),
				onSome: game => Option.some(game),
			}),
		})),
		Match.orElse(quest => {
			const map = getMapByKey(quest.map)

			return {
				title: quest.title,
				description: quest.description,
				alt: `${quest.title} preview image`,
				image: Option.match(map, {
					onNone: () => null,
					onSome: map => map.image,
				}),
				href: Option.match(map, {
					onNone: () => undefined,
					onSome: map => `/side-quests/${map.game}/${map.id}/${quest.id}`,
				}),
				game: Option.match(map, {
					onNone: () => Option.none(),
					onSome: map =>
						Option.match(getGameByKey(map.game), {
							onNone: () => Option.none(),
							onSome: game => Option.some(game),
						}),
				}),
				map,
			}
		}),
	)

	const { disabled, stateBadge, tabIndex } = Option.match(quest.state, {
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

	const renderSpecificBadge = () => {
		if (isSideQuest(quest)) {
			return Option.match(map, {
				onNone: () => null,
				onSome: map => (
					<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
						{map.title}
					</Badge>
				),
			})
		}

		if (Option.isSome(quest.difficulty) && Option.isSome(quest.estimatedTimeMins)) {
			return (
				<>
					<DifficultyBadge difficulty={quest.difficulty.value} />
					<EstimatedTimeBadge timeRange={quest.estimatedTimeMins.value} />
				</>
			)
		}

		if (Option.isSome(quest.difficulty)) {
			return <DifficultyBadge difficulty={quest.difficulty.value} />
		}

		if (Option.isSome(quest.estimatedTimeMins)) {
			return <EstimatedTimeBadge timeRange={quest.estimatedTimeMins.value} />
		}
	}

	return (
		<article
			className={cn("h-full max-h-110", {
				"pointer-events-none": disabled,
			})}
		>
			<CustomLink
				href={href as Route}
				aria-label={`View Guide for ${title}`}
				aria-disabled={disabled || !href}
				className="group outline-none"
				tabIndex={tabIndex}
			>
				<Card
					className={cn(
						`relative h-full animate-fade-in cursor-pointer overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-hover:outline-2 group-hover:outline-primary group-focus-visible:scale-105 group-focus-visible:outline-2 group-focus-visible:outline-primary dark:shadow-none`,
						{ "opacity-75 dark:opacity-50": disabled },
					)}
				>
					<div className="absolute top-2 right-2 z-20 flex w-fit flex-wrap items-center justify-end-safe gap-1">
						{stateBadge}
						{renderSpecificBadge()}
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
							{Option.match(game, {
								onNone: () => null,
								onSome: game => game.title,
							})}
						</Badge>
					</div>
					<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-25 blur-2xl dark:flex">
						<FeaturedImage
							featuredImage={image}
							width={272}
							height={176}
							sizes="272px"
							className="aspect-square scale-150"
						/>
					</div>
					<CardHeader className="flex flex-col gap-2">
						<div className="relative h-full w-full overflow-hidden">
							<FeaturedImage
								featuredImage={image}
								alt={alt}
								priority={priority}
								width={272}
								height={176}
								sizes="272px"
								className="h-44 rounded-md object-cover"
							/>
						</div>
						<CardTitle
							className={cn("text-xl will-change-transform", {
								"text-lg": title.length > 25,
							})}
						>
							{title}
						</CardTitle>
						<CardDescription className="text-foreground/85">{description}</CardDescription>
					</CardHeader>
				</Card>
			</CustomLink>
		</article>
	)
}
