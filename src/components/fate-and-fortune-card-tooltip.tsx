"use client"

import type { RegistryKeyInput } from "@/data/registry-helpers"
import { cn } from "cn"
import { Option } from "effect"
import { FateAndFortuneRarityBadge, FateAndFortuneTypeBadge } from "@/components/custom-badges"
import IconImage from "@/components/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
	type FateAndFortuneCard,
	type FateAndFortuneCardKey,
	getFateAndFortuneCardByKey,
} from "@/data/fate-and-fortune-cards"
import { useIsMobile } from "@/hooks/use-mobile"

interface FateAndFortuneCardTooltipProps {
	cardKey: RegistryKeyInput<FateAndFortuneCardKey>
}

export default function FateAndFortuneCardTooltip({ cardKey }: FateAndFortuneCardTooltipProps) {
	const isMobile = useIsMobile(640)
	const card = getFateAndFortuneCardByKey(cardKey)

	if (Option.isNone(card)) {
		console.error(`Unable to render tooltip for fate and fortune card: ${cardKey}`)

		return "[MISSING_FATE_AND_FORTUNE_CARD]"
	}

	if (!isMobile)
		return (
			<HoverCard>
				<HoverCardTrigger className="group relative inline-flex cursor-default items-baseline justify-center align-baseline">
					<FateAndFortuneCardTrigger card={card.value} />
				</HoverCardTrigger>
				<HoverCardContent side="top" className={getRarityContentClasses(card.value)}>
					<FateAndFortuneCardTooltipContent card={card.value} />
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger className="group relative inline-flex cursor-default items-baseline justify-center align-baseline">
				<FateAndFortuneCardTrigger card={card.value} />
			</PopoverTrigger>
			<PopoverContent side="top" className={getRarityContentClasses(card.value)}>
				<FateAndFortuneCardTooltipContent card={card.value} />
			</PopoverContent>
		</Popover>
	)
}

const FateAndFortuneCardTooltipContent = ({ card }: { card: FateAndFortuneCard }) => {
	const rarity = Option.getOrUndefined(card.rarity)

	return (
		<div
			className={cn("relative flex w-full flex-col rounded-lg px-4 py-2", {
				"bg-gobblegum-time-based": card.type === "Fate",
				"bg-equipment": rarity === "Common",
				"bg-gobblegum-rare": rarity === "Rare",
				"bg-gobblegum-epic": rarity === "Legendary",
				"bg-gobblegum-legendary": rarity === "Epic",
			})}
		>
			{rarity ? (
				<FateAndFortuneRarityBadge rarity={rarity} className="absolute top-4 left-4" />
			) : (
				<FateAndFortuneTypeBadge type={card.type} className="absolute top-4 left-4" />
			)}
			{card.type === "Fortune" ? (
				<FateAndFortuneTypeBadge type={card.type} className="absolute top-4 right-4" />
			) : null}
			<div className="relative flex items-center justify-center">
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full" />
				<IconImage
					featuredImage={card.image}
					alt={`${card.title} Image`}
					width={96}
					height={96}
					sizes="96px"
					className="relative z-10 h-24 w-auto p-2"
				/>
			</div>
			<div className="relative z-10 -mt-3">
				<div
					className={cn(
						"px-4 text-center text-lg font-bold text-orange-700 dark:text-orange-200",
						getRarityTextClasses(card),
					)}
				>
					{card.title}
				</div>
				<div className="mt-6 pb-8">
					<div
						className={cn(
							"text-center text-sm text-orange-800 dark:text-orange-200",
							getRarityTextClasses(card),
						)}
					>
						{card.description}
					</div>
				</div>
			</div>
		</div>
	)
}

const FateAndFortuneCardTrigger = ({ card }: { card: FateAndFortuneCard }) => (
	<span className="group relative inline-flex cursor-default items-baseline justify-center gap-1 align-baseline">
		<IconImage
			featuredImage={card.image}
			alt={`${card.title} Image`}
			width={28}
			height={28}
			sizes="96px"
			className="my-auto h-7 w-auto"
		/>
		<span
			className={cn(
				"text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
				getRarityTextClasses(card),
			)}
		>
			{card.title}
		</span>
	</span>
)

const getRarityTextClasses = (card: FateAndFortuneCard) => {
	const rarity = Option.getOrUndefined(card.rarity)

	return cn({
		"text-green-700 decoration-green-700 dark:text-green-300 dark:decoration-green-300":
			card.type === "Fate",
		"text-gray-700 decoration-gray-700 dark:text-gray-300 dark:decoration-gray-300":
			rarity === "Common",
		"text-blue-700 decoration-blue-700 dark:text-blue-300 dark:decoration-blue-300":
			rarity === "Rare",
		"text-purple-700 decoration-purple-700 dark:text-purple-300 dark:decoration-purple-300":
			rarity === "Legendary",
		"text-orange-700 decoration-orange-700 dark:text-orange-300 dark:decoration-orange-300":
			rarity === "Epic",
	})
}

const getRarityContentClasses = (card: FateAndFortuneCard) => {
	const rarity = Option.getOrUndefined(card.rarity)

	return cn(
		"w-sm p-0 text-orange-600 shadow-xs shadow-orange-600 ring-orange-600/30 dark:text-orange-200 dark:shadow-orange-200 dark:ring-orange-200/30",
		{
			"shadow-green-600 ring-green-600/25 dark:shadow-green-300 dark:ring-green-300/30":
				card.type === "Fate",
			"shadow-gray-600 ring-gray-600/25 dark:shadow-gray-300 dark:ring-gray-300/30":
				rarity === "Common",
			"shadow-blue-600 ring-blue-600/30 dark:shadow-blue-300 dark:ring-blue-300/30":
				rarity === "Rare",
			"shadow-purple-600 ring-purple-600/25 dark:shadow-purple-300 dark:ring-purple-300/30":
				rarity === "Legendary",
			"shadow-orange-600 ring-orange-600/25 dark:shadow-orange-300 dark:ring-orange-300/30":
				rarity === "Epic",
		},
	)
}
