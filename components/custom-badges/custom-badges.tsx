import type { MarkerCategory } from "@/map-configs/markers"
import type { Augment, Gobblegum, MainQuest, Zombie, ZombieAttack } from "@/types/payload-types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
}: CustomBadgeProps & { difficulty: MainQuest["difficulty"] }) => (
	<Badge
		className={cn(
			{
				"badge-easy-gradient dark:dark-badge-easy-gradient": difficulty === "Easy",
				"badge-medium-gradient dark:dark-badge-medium-gradient": difficulty === "Medium",
				"badge-hard-gradient dark:dark-badge-hard-gradient": difficulty === "Hard",
			},
			className,
		)}
	>
		{difficulty}
	</Badge>
)
export const TypeBadge = ({
	className,
	type,
}: CustomBadgeProps & { type: Zombie["type"] | Augment["type"] }) => (
	<Badge
		className={cn(
			{
				"badge-easy-gradient dark:dark-badge-easy-gradient": type === "Normal",
				"badge-medium-gradient dark:dark-badge-medium-gradient": type === "Special",
				"badge-elite-gradient dark:dark-badge-elite-gradient": type === "Elite",
				"badge-hard-gradient dark:dark-badge-hard-gradient": type === "Boss",
				"badge-changed-gradient dark:dark-badge-changed-gradient": type === "Major",
				"badge-primary-gradient dark:dark-badge-primary-gradient": type === "Minor",
			},
			className,
		)}
	>
		{type}
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
}: CustomBadgeProps & { rarity: Gobblegum["rarity"]; type: Gobblegum["type"] }) => (
	<Badge
		className={cn(
			{
				"badge-hard-gradient dark:dark-badge-hard-gradient": rarity === "Ultra",
				"badge-primary-gradient dark:dark-badge-primary-gradient": rarity === "Legendary",
				"badge-draft-gradient dark:dark-badge-draft-gradient": rarity === "Epic",
				"badge-changed-gradient dark:dark-badge-changed-gradient": rarity === "Rare",
			},
			{
				"badge-new-gradient dark:dark-badge-new-gradient": type === "Time-Based",
				"badge-changed-gradient dark:dark-badge-changed-gradient": type === "Round-Based",
				"badge-medium-gradient dark:dark-badge-medium-gradient": type === "Immediate",
				"badge-draft-gradient dark:dark-badge-draft-gradient": type === "Player-Activated",
			},
			className,
		)}
	>
		{children}
	</Badge>
)
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
