import type { MinifiedFeaturedMap } from "@/data/maps"
import type { MinifiedSideQuest } from "@/data/side-quests"
import { cn } from "@/lib/utils"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { TypeGuards } from "@/utils/functions"
import { ChangedBadge, ComingSoonBadge, DifficultyBadge, DraftBadge, NewBadge } from "../custom-badges/custom-badges"
import { CustomLink } from "../custom-link/custom-link"
import FeaturedImage from "../featured-image/featured-image"
import { Badge } from "../ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface IQuestPreviewCard {
	quest: MinifiedFeaturedMap | MinifiedSideQuest
	questIndex: number
	draftMode: boolean
}

export default function QuestPreviewCard({ quest, questIndex, draftMode }: IQuestPreviewCard) {
	const priority = questIndex === 0
	const alt = `${quest.title} map image`
	const isComingSoon = quest.isComingSoon

	const resolveHref = () => {
		if (quest.isComingSoon) return "#"

		if (TypeGuards.hasProperty(quest, "map")) {
			return `/side-quests/${quest.game.slug}/${quest.map.slug}/${quest.slug}`
		}

		return `/${quest.game.slug}/${quest.slug}`
	}

	return (
		<article className={cn("group h-full max-h-110 outline-hidden", { "pointer-events-none": isComingSoon })}>
			<CustomLink href={resolveHref()} aria-label={`View Guide for ${quest.title}`} aria-disabled={isComingSoon}>
				<Card
					className={cn(
						`relative h-full animate-fade-in cursor-pointer overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-hover:border-primary group-focus-visible:scale-105 group-focus-visible:border-primary dark:shadow-none`,
						{ "opacity-75 dark:opacity-50": isComingSoon },
					)}
				>
					<div className="absolute top-2 right-2 z-20 flex w-fit items-center justify-center gap-1">
						{(draftMode || IN_DEVELOPMENT) && quest.isDraft ? <DraftBadge /> : null}
						{(draftMode || IN_DEVELOPMENT) && quest.isChanged ? <ChangedBadge /> : null}
						{isComingSoon ? <ComingSoonBadge /> : quest.isNew ? <NewBadge /> : null}
						{TypeGuards.hasProperty(quest, "difficulty") ? (
							<>{quest.difficulty && <DifficultyBadge difficulty={quest.difficulty} />}</>
						) : (
							<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">{quest.map.title}</Badge>
						)}
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">{quest.game.title}</Badge>
					</div>
					<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-25 blur-2xl dark:flex">
						<FeaturedImage
							featuredImage={quest.image}
							priority={priority}
							quality={1}
							sizes="32px"
							className="aspect-square scale-150"
						/>
					</div>
					<CardHeader className="flex flex-col gap-2">
						<div className="relative h-full w-full overflow-hidden">
							<FeaturedImage
								featuredImage={quest.image}
								priority={priority}
								alt={alt}
								sizes="272px"
								className="h-44 rounded-md object-cover"
							/>
						</div>
						<CardTitle className="text-xl group-hover:text-primary-gradient group-focus-visible:text-primary-gradient">
							{quest.title}
						</CardTitle>
						<CardDescription className="text-foreground/85">{quest.description}</CardDescription>
					</CardHeader>
				</Card>
			</CustomLink>
		</article>
	)
}
