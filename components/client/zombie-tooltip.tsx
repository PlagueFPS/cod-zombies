"use client"
import type { Zombie, ZombieKey, ZombieType } from "@/data/zombies"

import { Array as Arr, Option } from "effect"
import { AlertTriangle, ExternalLinkIcon, Target } from "lucide-react"

import AmmoModTooltip from "@/components/client/ammo-mod-tooltip"
import { CustomLink } from "@/components/client/custom-link"
import IconImage from "@/components/client/icon-image"
import { TypeBadge } from "@/components/server/custom-badges"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getWeakPointByKey } from "@/data/weak-points"
import { getZombieByKey } from "@/data/zombies"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export default function ZombieTooltip({ zombieKey }: { zombieKey: ZombieKey }) {
	const isMobile = useIsMobile(640)
	const zombie = getZombieByKey(zombieKey)
	if (Option.isNone(zombie)) {
		console.error(`Unable to render tooltip for zombie: ${zombieKey}`)
		return "[MISSING_ZOMBIE]"
	}

	if (!isMobile) {
		return (
			<HoverCard>
				<HoverCardTrigger className="relative inline-flex cursor-default items-baseline justify-center align-baseline">
					<ZombieTrigger zombie={zombie.value} />
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className={cn("w-sm bg-background p-0", getTypeContentClasses(zombie.value.type))}
				>
					<ZombieTooltipContent zombie={zombie.value} />
				</HoverCardContent>
			</HoverCard>
		)
	}

	return (
		<Popover>
			<PopoverTrigger className="relative inline-flex cursor-default items-baseline justify-center align-baseline">
				<ZombieTrigger zombie={zombie.value} />
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className={cn("w-sm bg-background p-0", getTypeContentClasses(zombie.value.type))}
			>
				<ZombieTooltipContent zombie={zombie.value} />
			</PopoverContent>
		</Popover>
	)
}

const ZombieTrigger = ({ zombie }: { zombie: Zombie }) => (
	<span
		className={cn(
			"text-center underline decoration-dotted underline-offset-4 hover:no-underline",
			getTypeTextClasses(zombie.type),
		)}
	>
		{zombie.title}
	</span>
)

const ZombieTooltipContent = ({ zombie }: { zombie: Zombie }) => {
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
					<div className={cn("pl-3 text-lg font-bold", getTypeTextClasses(zombie.type))}>
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
						<h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-foreground">
							<Target className="size-4 text-red-500" />
							Weak Points
						</h3>
						<div className="flex flex-wrap items-center gap-2">
							{Arr.isArrayEmpty(zombie.weakPoints) ? (
								<Badge className="w-fit badge-hard-gradient dark:dark-badge-hard-gradient">
									None
								</Badge>
							) : (
								zombie.weakPoints.map(weakpointKey => {
									const weakpoint = getWeakPointByKey(weakpointKey)
									return Option.match(weakpoint, {
										onNone: () => null,
										onSome: weakpoint => (
											<Badge
												key={weakpoint.id}
												className="w-fit badge-hard-gradient dark:dark-badge-hard-gradient"
											>
												{weakpoint.title}
											</Badge>
										),
									})
								})
							)}
						</div>
					</div>
					<div>
						<h3 className="mb-2 flex items-center gap-1 text-sm font-semibold text-foreground">
							<AlertTriangle className="size-4 text-orange-800 dark:text-orange-300" />
							Elemental Weaknesses
						</h3>
						<div className="flex flex-wrap items-center gap-2 text-sm">
							{Arr.isArrayNonEmpty(zombie.elementalWeakness) ? (
								zombie.elementalWeakness.map(weakness => (
									<AmmoModTooltip
										key={weakness}
										ammoModKey={weakness}
										game={Arr.last(zombie.games).valueOrUndefined}
									/>
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
			type === "Normal",
		"text-yellow-700 decoration-yellow-700 dark:text-yellow-200 dark:decoration-yellow-200":
			type === "Special",
		"text-rose-600 decoration-rose-600 dark:text-rose-300 dark:decoration-rose-300":
			type === "Elite",
		"text-red-600 decoration-red-600 dark:text-red-400 dark:decoration-red-400": type === "Boss",
	})

const getTypeContentClasses = (type: ZombieType) =>
	cn({
		"ring-teal-600/50 dark:ring-teal-300/50": type === "Normal",
		"ring-yellow-600/50 dark:ring-yellow-300/50": type === "Special",
		"ring-rose-600/50 dark:ring-rose-300/50": type === "Elite",
		"ring-red-600/50 dark:ring-red-300/50": type === "Boss",
	})
