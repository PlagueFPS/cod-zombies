"use client"
import type { GameKey } from "@/data/games"
import { cn } from "cn"
import { Option } from "effect"
import { RarityBadge } from "@/components/custom-badges"
import IconImage from "@/components/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	type Gobblegum,
	type GobblegumKey,
	type GobblegumRarity,
	type GobblegumType,
	getGobblegumByKey,
} from "@/data/gobblegum"
import { useIsMobile } from "@/hooks/use-mobile"

interface GobbleGumTooltipProps {
	gobblegumKey: GobblegumKey
	game?: GameKey
}

export default function GobbleGumTooltip({ gobblegumKey, game }: GobbleGumTooltipProps) {
	const isMobile = useIsMobile(640)
	const gobblegum = getGobblegumByKey(gobblegumKey, game)
	if (Option.isNone(gobblegum)) {
		console.error(`Unable to render tooltip for gobblegum: ${gobblegumKey}`)
		return "[MISSING_GOBBLEGUM]"
	}

	if (!isMobile)
		return (
			<HoverCard>
				<HoverCardTrigger className="group relative cursor-default">
					<GobblegumTrigger gobblegum={gobblegum.value} />
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className={cn(
						`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-xs shadow-orange-600 dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200`,
						getContentClasses(gobblegum.value.rarity, gobblegum.value.type),
					)}
				>
					<GobbleGumTooltipContent gobblegum={gobblegum.value} />
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger className="group relative cursor-default">
				<GobblegumTrigger gobblegum={gobblegum.value} />
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className={cn(
					`w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-xs shadow-orange-600 dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200`,
					getContentClasses(gobblegum.value.rarity, gobblegum.value.type),
				)}
			>
				<GobbleGumTooltipContent gobblegum={gobblegum.value} />
			</PopoverContent>
		</Popover>
	)
}

const GobblegumTrigger = ({ gobblegum }: { gobblegum: Gobblegum }) => (
	<span className="inline-flex items-baseline justify-center gap-0.5">
		<IconImage
			featuredImage={gobblegum.image}
			alt={`${gobblegum.title} Image`}
			width={24}
			height={24}
			sizes="64px"
			className="my-auto h-6 w-auto"
		/>
		<span
			className={cn(
				"text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
				getTextClasses(gobblegum.rarity, gobblegum.type),
			)}
		>
			{gobblegum.title}
		</span>
	</span>
)

const GobbleGumTooltipContent = ({ gobblegum }: { gobblegum: Gobblegum }) => {
	return (
		<div
			className={cn("relative flex w-full flex-col rounded-lg px-4 py-2", {
				"bg-gobblegum-time-based": gobblegum.type === "Time-Based",
				"bg-gobblegum-round-based": gobblegum.type === "Round-Based",
				"bg-gobblegum-immediate": gobblegum.type === "Immediate",
				"bg-gobblegum-player-activated": gobblegum.type === "Player-Activated",
				"bg-gobblegum-ultra": gobblegum.rarity === "Ultra",
				"bg-gobblegum-legendary": gobblegum.rarity === "Legendary",
				"bg-gobblegum-epic": gobblegum.rarity === "Epic",
				"bg-gobblegum-rare": gobblegum.rarity === "Rare",
			})}
		>
			<RarityBadge
				rarity={gobblegum.rarity}
				type={gobblegum.type}
				className="absolute top-4 left-4"
			>
				{gobblegum.rarity}
			</RarityBadge>
			<RarityBadge
				rarity={gobblegum.rarity}
				type={gobblegum.type}
				className="absolute top-4 right-4"
			>
				{gobblegum.type}
			</RarityBadge>
			<div className="relative flex items-center justify-center">
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full" />
				<IconImage
					featuredImage={gobblegum.image}
					alt={`${gobblegum.title} Image`}
					width={80}
					height={80}
					sizes="64px"
					className="relative z-10 h-20 w-auto p-2"
				/>
			</div>
			<div className="relative z-10 -mt-3">
				<div
					className={cn(
						"px-4 text-center text-lg font-bold text-orange-700 dark:text-orange-200",
						getTextClasses(gobblegum.rarity, gobblegum.type),
					)}
				>
					{gobblegum.title}
				</div>
				<div className="mt-6 pb-8">
					<div
						className={cn(
							"text-center text-sm text-orange-800 dark:text-orange-200",
							getTextClasses(gobblegum.rarity, gobblegum.type),
						)}
					>
						{gobblegum.description}
					</div>
				</div>
			</div>
		</div>
	)
}

const getTextClasses = (rarity: GobblegumRarity, type: GobblegumType) =>
	cn(
		{
			"text-green-600 decoration-green-600 dark:text-green-300 dark:decoration-green-300":
				type === "Time-Based",
			"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
				type === "Round-Based",
			"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
				type === "Immediate",
			"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
				type === "Player-Activated",
		},
		{
			"text-red-600 decoration-red-600 dark:text-red-300 dark:decoration-red-300":
				rarity === "Ultra",
			"text-orange-600 decoration-orange-600 dark:text-orange-300 dark:decoration-orange-300":
				rarity === "Legendary",
			"text-purple-600 decoration-purple-600 dark:text-purple-300 dark:decoration-purple-300":
				rarity === "Epic",
			"text-blue-600 decoration-blue-600 dark:text-blue-300 dark:decoration-blue-300":
				rarity === "Rare",
		},
	)
const getContentClasses = (rarity: GobblegumRarity, type: GobblegumType) =>
	cn(
		{
			"shadow-green-600 ring-green-600/30 dark:shadow-green-300 dark:ring-green-300/30":
				type === "Time-Based",
			"shadow-blue-600 ring-blue-600/30 dark:shadow-blue-300 dark:ring-blue-300/30":
				type === "Round-Based",
			"shadow-orange-600 ring-orange-600/30 dark:shadow-orange-300 dark:ring-orange-300/30":
				type === "Immediate",
			"shadow-purple-600 ring-purple-600/30 dark:shadow-purple-300 dark:ring-purple-300/30":
				type === "Player-Activated",
		},
		{
			"shadow-red-600 ring-red-600/25 dark:shadow-red-300 dark:ring-red-300/30": rarity === "Ultra",
			"shadow-orange-600 ring-orange-600/25 dark:shadow-orange-300 dark:ring-orange-300/30":
				rarity === "Legendary",
			"shadow-purple-600 ring-purple-600/25 dark:shadow-purple-300 dark:ring-purple-300/30":
				rarity === "Epic",
			"shadow-blue-600 ring-blue-600/30 dark:shadow-blue-300 dark:ring-blue-300/30":
				rarity === "Rare",
		},
	)
