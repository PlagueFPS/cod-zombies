import type { MainQuest } from "@/data/main-quests"
import type { SideQuest } from "@/data/side-quests"
import { Predicate } from "effect"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { ComingSoonBadge, DifficultyBadge, NewBadge } from "../custom-badges/custom-badges"
import { CustomLink } from "../custom-link/custom-link"
import FeaturedImage from "../featured-image/featured-image"
import { Badge } from "../ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface IQuestPreviewCard {
	quest: MainQuest | SideQuest
	questIndex: number
}

export default function QuestPreviewCard({ quest, questIndex }: IQuestPreviewCard) {
	const isMobile = useIsMobile()
	const priority = isMobile ? questIndex === 0 : questIndex <= 3
	const title = "title" in quest ? quest.title : quest.map.title
	const description = "description" in quest ? quest.description : quest.map.description
	const alt = `${title} map image`

	const renderSpecificBadge = () => {
		if (Predicate.hasProperty(quest, "difficulty") && quest.difficulty) {
			return <DifficultyBadge difficulty={quest.difficulty} />
		}

		if (Predicate.hasProperty(quest, "map") && quest.map) {
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
				"pointer-events-none": quest.state === "Coming Soon",
			})}
		>
			<CustomLink
				href={
					quest.state === "Coming Soon"
						? "#"
						: Predicate.hasProperty(quest, "difficulty")
							? `/${quest.map.game.id}/${quest.map.id}`
							: `/side-quests/${quest.map.game.id}/${quest.map.id}/${quest.id}`
				}
				aria-label={`View Guide for ${title}`}
				aria-disabled={quest.state === "Coming Soon"}
				className="group outline-none"
				tabIndex={quest.state === "Coming Soon" ? -1 : 0}
			>
				<Card
					className={cn(
						`relative h-full animate-fade-in cursor-pointer overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-hover:outline-2 group-hover:outline-primary group-focus-visible:scale-105 group-focus-visible:outline-2 group-focus-visible:outline-primary dark:shadow-none`,
						{ "opacity-75 dark:opacity-50": quest.state === "Coming Soon" },
					)}
				>
					<div className="absolute top-2 right-2 z-20 flex w-fit flex-wrap items-center justify-end gap-1">
						{quest.state === "Coming Soon" ? (
							<ComingSoonBadge />
						) : quest.state === "New" ? (
							<NewBadge />
						) : null}
						{renderSpecificBadge()}
						<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
							{quest.map.game.title}
						</Badge>
					</div>
					<div className="absolute inset-0 z-10 hidden h-full w-full items-center opacity-25 blur-2xl dark:flex">
						<FeaturedImage
							featuredImage={quest.map.image}
							width={272}
							height={176}
							sizes="272px"
							className="aspect-square scale-150"
						/>
					</div>
					<CardHeader className="flex flex-col gap-2">
						<div className="relative h-full w-full overflow-hidden">
							<FeaturedImage
								featuredImage={quest.map.image}
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
