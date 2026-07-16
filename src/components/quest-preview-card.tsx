import type { SideQuest } from "@/data/side-quests"
import type { PreviewCard } from "@/types/preview-card"
import { Match, Option } from "effect"
import { CardImageGlow } from "@/components/card-image-glow"
import {
	ComingSoonBadge,
	DifficultyBadge,
	EstimatedTimeBadge,
	NewBadge,
} from "@/components/custom-badges"
import { CustomLink } from "@/components/custom-link"
import { FeaturedImage } from "@/components/featured-image"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getGameByKey } from "@/data/games"
import { getMapByKey, type MapEntry } from "@/data/maps"
import { cn } from "@/lib/utils"
import { isMapQuest, isSideQuest } from "@/utils/rsc-wire"

interface IQuestPreviewCard extends PreviewCard {
	quest: Omit<MapEntry, "mainQuest"> | Omit<SideQuest, "content">
}

export function QuestPreviewCard({ quest, priority, fetchPriority }: IQuestPreviewCard) {
	const { title, description, alt, map, game, image } = Match.value(quest).pipe(
		Match.when(isMapQuest, quest => ({
			title: quest.title,
			description: quest.description,
			alt: `${quest.title} map image`,
			image: quest.image,
			map: null,
			// SAFETY: We know the game key exists since it is derived from source data
			game: getGameByKey(quest.game).pipe(Option.getOrThrow),
		})),
		Match.orElse(quest => {
			// SAFETY: We know both these keys exist since it is derived from source data
			const map = getMapByKey(quest.map).pipe(Option.getOrThrow)
			const game = getGameByKey(map.game).pipe(Option.getOrThrow)

			return {
				title: quest.title,
				description: quest.description,
				alt: `${quest.title} preview image`,
				image: map.image,
				game,
				map,
			}
		}),
	)

	const questLink = isMapQuest(quest)
		? {
				to: "/main-quests/$gameId/$mapId" as const,
				params: { gameId: game.id, mapId: quest.id },
			}
		: {
				to: "/side-quests/$gameId/$mapId/$questId" as const,
				params: { gameId: game.id, mapId: map?.id, questId: quest.id },
			}

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
			return (
				<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
					{map?.title}
				</Badge>
			)
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
				to={questLink?.to}
				params={questLink?.params}
				aria-label={`View Guide for ${title}`}
				aria-disabled={disabled || !questLink}
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
							{game.title}
						</Badge>
					</div>
					<CardImageGlow src={image} className="scale-150" />
					<CardHeader className="flex flex-col gap-2">
						<div className="relative h-full w-full overflow-hidden">
							<FeaturedImage
								featuredImage={image}
								alt={alt}
								width={272}
								height={176}
								sizes="384px"
								loading={priority ? "eager" : "lazy"}
								fetchPriority={fetchPriority}
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
