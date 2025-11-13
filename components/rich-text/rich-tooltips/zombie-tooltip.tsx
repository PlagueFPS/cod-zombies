"use client"
import type { Zombie, ZombieKey } from "@/data/zombies"
import type { ZombieType } from "@/utils/validation-schemas"
import { Array as Arr } from "effect"
import { AlertTriangle, ExternalLinkIcon, Target } from "lucide-react"
import { TypeBadge } from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import IconImage from "@/components/icon-image/icon-image"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getLatestZombieGameKey, getZombieByKey } from "@/data/zombies"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import AmmoModTooltip from "./ammo-mod-tooltip"

export default function ZombieTooltip({ zombieKey }: { zombieKey: ZombieKey }) {
	const isMobile = useIsMobile(640)
	const zombie = getZombieByKey(zombieKey)

	if (!isMobile) {
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger className="relative inline-flex cursor-default items-baseline justify-center align-baseline">
					<ZombieTrigger zombie={zombie} />
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className={cn(
						"w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200",
						getTypeContentClasses(zombie.type),
					)}
				>
					<ZombieTooltipContent zombie={zombie} />
				</HoverCardContent>
			</HoverCard>
		)
	}

	return (
		<Popover>
			<PopoverTrigger className="relative inline-flex cursor-default items-baseline justify-center align-baseline">
				<ZombieTrigger zombie={zombie} />
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className={cn(
					"w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200",
					getTypeContentClasses(zombie.type),
				)}
			>
				<ZombieTooltipContent zombie={zombie} />
			</PopoverContent>
		</Popover>
	)
}

const ZombieTrigger = ({ zombie }: { zombie: Zombie }) => (
	<span
		className={cn(
			"text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
			getTypeTextClasses(zombie.type),
		)}
	>
		{zombie.title}
	</span>
)

const ZombieTooltipContent = ({ zombie }: { zombie: Zombie }) => {
	const mostRecentGame = getLatestZombieGameKey(zombie.games)

	return (
		<div className="relative flex w-full max-w-sm flex-col rounded-md">
			<div className="flex items-center justify-between rounded-t-md bg-accent px-4 py-2 dark:bg-accent/50">
				<div className="flex w-fit items-center justify-center gap-4">
					<TypeBadge type={zombie.type} />
				</div>
				<CustomLink
					href={`/bestiary/${zombie.id}`}
					className="flex items-center justify-center gap-1 text-xs"
					aria-label="View Zombie Details"
				>
					<ExternalLinkIcon
						className={cn(
							"size-4.5 transition-colors hover:text-primary dark:hover:text-primary",
							getTypeTextClasses(zombie.type),
						)}
					/>
				</CustomLink>
			</div>
			<div className="mt-2 grid grid-cols-2">
				<div className="flex h-full flex-col">
					<div className={cn("pl-3 font-bold text-lg", getTypeTextClasses(zombie.type))}>
						{zombie.title}
					</div>
					<IconImage
						featuredImage={zombie.image}
						alt={`${zombie.title} Image`}
						width={272}
						height={272}
						sizes="272px"
						className="relative z-10 aspect-square w-full rounded-lg object-cover object-top p-2"
					/>
				</div>
				<div className="mt-2 flex flex-col gap-4">
					<div>
						<h3 className="mb-2 flex items-center gap-1 font-semibold text-foreground text-sm">
							<Target className="size-4 text-red-500" />
							Weak Points
						</h3>
						<div className="flex flex-wrap items-center gap-2">
							{Arr.isNonEmptyArray(zombie.weakPoints) ? (
								zombie.weakPoints.map(weakPoint => (
									<Badge
										key={weakPoint.id}
										className="badge-hard-gradient dark:dark-badge-hard-gradient w-fit"
									>
										{weakPoint.title}
									</Badge>
								))
							) : (
								<Badge className="badge-hard-gradient dark:dark-badge-hard-gradient w-fit">
									None
								</Badge>
							)}
						</div>
					</div>
					<div>
						<h3 className="mb-2 flex items-center gap-1 font-semibold text-foreground text-sm">
							<AlertTriangle className="size-4 text-orange-800 dark:text-orange-300" />
							Elemental Weaknesses
						</h3>
						<div className="flex flex-wrap items-center gap-2 text-sm">
							{Arr.isNonEmptyArray(zombie.elementalWeakness) ? (
								zombie.elementalWeakness.map(weakness => (
									<AmmoModTooltip key={weakness} ammoModKey={weakness} game={mostRecentGame} />
								))
							) : (
								<span className="text-foreground dark:text-foreground/80">
									No elemental weaknesses
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const getTypeTextClasses = (type: ZombieType) =>
	cn({
		"text-teal-600 decoration-teal-600 dark:text-teal-300 dark:decoration-teal-300":
			type === "normal",
		"text-yellow-700 decoration-yellow-700 dark:text-yellow-200 dark:decoration-yellow-200":
			type === "special",
		"text-rose-600 decoration-rose-600 dark:text-rose-300 dark:decoration-rose-300":
			type === "elite",
		"text-red-600 decoration-red-600 dark:text-red-400 dark:decoration-red-400": type === "boss",
	})

const getTypeContentClasses = (type: ZombieType) =>
	cn({
		"border-teal-600/50 dark:border-teal-300/50": type === "normal",
		"border-yellow-600/50 dark:border-yellow-300/50": type === "special",
		"border-rose-600/50 dark:border-rose-300/50": type === "elite",
		"border-red-600/50 dark:border-red-300/50": type === "boss",
	})
