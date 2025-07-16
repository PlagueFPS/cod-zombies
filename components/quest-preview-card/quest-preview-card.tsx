import type { MinifiedFeaturedMap } from "@/data/maps"
import type { MinifiedSideQuest } from "@/data/side-quests"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { isFeaturedMap, isSideQuest } from "@/utils/contentful-utils"
import {
	ChangedBadge,
	ComingSoonBadge,
	DifficultyBadge,
	DraftBadge,
	NewBadge,
} from "../custom-badges/custom-badges"
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
	const isMobile = useIsMobile()
	const priority = isMobile ? questIndex === 0 : questIndex <= 3
	const alt = `${quest.title} map image`

	const resolveHref = () => {
		if (quest.isComingSoon) return "#"

		if (isSideQuest(quest)) {
			return `/side-quests/${quest.game.slug}/${quest.map.slug}/${quest.slug}`
		}

		return `/${quest.game.slug}/${quest.slug}`
	}

	const renderSpecificBadge = () => {
		if (isFeaturedMap(quest) && quest.difficulty) {
			return <DifficultyBadge difficulty={quest.difficulty} />
		}

		if (isSideQuest(quest) && quest.map) {
			return (
				<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
					{quest.map.title}
				</Badge>
			)
		}

		return null
	}

	return (
		<article
			className={cn("h-full max-h-110", {
				"pointer-events-none": quest.isComingSoon,
			})}
		>
			<CustomLink
				href={resolveHref()}
				aria-label={`View Guide for ${quest.title}`}
				aria-disabled={quest.isComingSoon}
				className="group outline-none"
				tabIndex={quest.isComingSoon ? -1 : 0}
			>
				<Card
					className={cn(
						`relative h-full animate-fade-in cursor-pointer overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-hover:outline-2 group-hover:outline-primary group-focus-visible:scale-105 group-focus-visible:outline-2 group-focus-visible:outline-primary dark:shadow-none`,
						{ "opacity-75 dark:opacity-50": quest.isComingSoon },
					)}
				>
					<div className="absolute top-2 right-2 z-20 flex w-fit items-center justify-center gap-1">
						{(draftMode || IN_DEVELOPMENT) && quest.isDraft ? <DraftBadge /> : null}
						{(draftMode || IN_DEVELOPMENT) && quest.isChanged ? <ChangedBadge /> : null}
						{quest.isComingSoon ? <ComingSoonBadge /> : quest.isNew ? <NewBadge /> : null}
						{renderSpecificBadge()}
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
							{quest.game.title}
						</Badge>
					</div>
					<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-25 blur-2xl dark:flex">
						<FeaturedImage
							featuredImage={quest.image}
							sizes="272px"
							className="aspect-square scale-150"
						/>
					</div>
					<CardHeader className="flex flex-col gap-2">
						<div className="relative h-full w-full overflow-hidden">
							<FeaturedImage
								featuredImage={quest.image}
								alt={alt}
								priority={priority}
								sizes="272px"
								className="h-44 rounded-md object-cover"
							/>
						</div>
						<CardTitle className="text-xl will-change-transform">{quest.title}</CardTitle>
						<CardDescription className="text-foreground/85">{quest.description}</CardDescription>
					</CardHeader>
				</Card>
			</CustomLink>
		</article>
	)
}
