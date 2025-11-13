import type { Augment } from "@/data/augments"
import type { ElixirRarity } from "@/data/elixirs"
import type { GobblegumRarity, GobblegumType } from "@/data/gobblegum"
import type { ZombieAttack } from "@/data/zombie-attacks"
import type { Zombie } from "@/data/zombies"
import type { MarkerCategory } from "@/map-configs/markers"
import type { MainQuestDifficulty } from "@/utils/validation-schemas"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { capitalize } from "@/utils/functions.client"

interface CustomBadgeProps {
	className?: string
	children?: React.ReactNode
}

export const DraftBadge = ({ className }: CustomBadgeProps) => (
	<Badge className={cn("badge-draft-gradient dark:dark-badge-draft-gradient", className)}>
		Draft
	</Badge>
)
export const ChangedBadge = ({ className }: CustomBadgeProps) => (
	<Badge className={cn("badge-changed-gradient dark:dark-badge-changed-gradient", className)}>
		Changed
	</Badge>
)
export const NewBadge = ({ className }: CustomBadgeProps) => (
	<Badge className={cn("badge-new-gradient dark:dark-badge-new-gradient", className)}>New</Badge>
)
export const ComingSoonBadge = ({ className }: CustomBadgeProps) => (
	<Badge className={cn("badge-changed-gradient dark:dark-badge-changed-gradient", className)}>
		Coming Soon
	</Badge>
)
export const DifficultyBadge = ({
	className,
	difficulty,
}: CustomBadgeProps & { difficulty: MainQuestDifficulty }) => (
	<Badge
		className={cn(
			{
				"badge-easy-gradient dark:dark-badge-easy-gradient": difficulty === "easy",
				"badge-medium-gradient dark:dark-badge-medium-gradient": difficulty === "medium",
				"badge-hard-gradient dark:dark-badge-hard-gradient": difficulty === "hard",
			},
			className,
		)}
	>
		{capitalize(difficulty)}
	</Badge>
)
export const TypeBadge = ({
	className,
	type,
}: CustomBadgeProps & { type: Zombie["type"] | Augment["type"] }) => (
	<Badge
		className={cn(
			{
				"badge-easy-gradient dark:dark-badge-easy-gradient": type === "normal",
				"badge-medium-gradient dark:dark-badge-medium-gradient": type === "special",
				"badge-elite-gradient dark:dark-badge-elite-gradient": type === "elite",
				"badge-hard-gradient dark:dark-badge-hard-gradient": type === "boss",
				"badge-major-augment-gradient dark:dark-badge-major-augment-gradient": type === "Major",
				"badge-primary-gradient dark:dark-badge-primary-gradient": type === "Minor",
			},
			className,
		)}
	>
		{capitalize(type)}
	</Badge>
)
export const MarkerBadge = ({
	className,
	category,
	children,
}: CustomBadgeProps & { category: MarkerCategory }) => (
	<Badge
		className={cn(
			{
				"badge-new-gradient dark:dark-badge-new-gradient": category === "transportation",
				"badge-changed-gradient dark:dark-badge-changed-gradient": category === "general",
				"badge-medium-gradient dark:dark-badge-medium-gradient": category === "upgrades",
				"badge-primary-gradient dark:dark-badge-primary-gradient": category === "objectives",
				"badge-draft-gradient dark:dark-badge-draft-gradient": category === "intel",
				"badge-equipment-gradient dark:dark-badge-equipment-gradient": category === "equipment",
			},
			className,
		)}
	>
		{children}
	</Badge>
)
export const RarityBadge = ({
	className,
	rarity,
	type,
	children,
}: CustomBadgeProps & { rarity: GobblegumRarity; type: GobblegumType }) => {
	const shouldUseType = () => {
		return rarity.includes("Mega") || rarity === "Classic"
	}

	return (
		<Badge
			className={cn(
				{
					"badge-new-gradient dark:dark-badge-new-gradient":
						shouldUseType() && type === "Time-Based",
					"badge-changed-gradient dark:dark-badge-changed-gradient":
						shouldUseType() && type === "Round-Based",
					"badge-medium-gradient dark:dark-badge-medium-gradient":
						shouldUseType() && type === "Immediate",
					"badge-draft-gradient dark:dark-badge-draft-gradient":
						shouldUseType() && type === "Player-Activated",
				},
				{
					"badge-hard-gradient dark:dark-badge-hard-gradient": rarity === "Ultra",
					"badge-primary-gradient dark:dark-badge-primary-gradient": rarity === "Legendary",
					"badge-draft-gradient dark:dark-badge-draft-gradient": rarity === "Epic",
					"badge-changed-gradient dark:dark-badge-changed-gradient": rarity === "Rare",
				},
				className,
			)}
		>
			{children}
		</Badge>
	)
}
export const RangeBadge = ({
	className,
	range,
}: CustomBadgeProps & { range: ZombieAttack["range"] }) => (
	<Badge
		className={cn(
			{
				"badge-easy-gradient dark:dark-badge-easy-gradient": range === "Short",
				"badge-medium-gradient dark:dark-badge-medium-gradient": range === "Medium",
				"badge-hard-gradient dark:dark-badge-hard-gradient": range === "Long",
			},
			className,
		)}
	>
		Range: {range}
	</Badge>
)

export const ElixirRarityBadge = ({
	className,
	rarity,
}: CustomBadgeProps & { rarity: ElixirRarity }) => (
	<Badge
		className={cn(
			{
				"badge-new-gradient dark:dark-badge-new-gradient": rarity === "Classic",
				"badge-equipment-gradient dark:dark-badge-equipment-gradient": rarity === "Common",
				"badge-changed-gradient dark:dark-badge-changed-gradient": rarity === "Rare",
				"badge-draft-gradient dark:dark-badge-draft-gradient": rarity === "Legendary",
				"badge-primary-gradient dark:dark-badge-primary-gradient": rarity === "Epic",
			},
			className,
		)}
	>
		{rarity}
	</Badge>
)
