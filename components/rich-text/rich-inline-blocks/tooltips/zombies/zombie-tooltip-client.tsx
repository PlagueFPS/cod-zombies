"use client"
import type { ZombieById } from "@/data/zombies"
import { AlertTriangle, ExternalLinkIcon, Target } from "lucide-react"
import { TypeBadge } from "@/components/custom-badges/custom-badges"
import { CustomLink } from "@/components/custom-link/custom-link"
import IconImage from "@/components/icon-image/icon-image"
import { Badge } from "@/components/ui/badge"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import AmmoModTooltipClient from "../ammo-mods/ammo-mod-tooltip-client"

export default function ZombieTooltipClient({ zombie }: { zombie: ZombieById }) {
	const isMobile = useIsMobile(640)

	if (!isMobile) {
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger
					className="relative inline-flex cursor-default items-baseline justify-center align-baseline font-bold"
					asChild
				>
					<span
						className={cn(
							"text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
							{
								"text-teal-600 decoration-teal-600 dark:text-teal-300 dark:decoration-teal-300":
									zombie.type === "Normal",
								"text-yellow-700 decoration-yellow-700 dark:text-yellow-200 dark:decoration-yellow-200":
									zombie.type === "Special",
								"text-rose-600 decoration-rose-600 dark:text-rose-300 dark:decoration-rose-300":
									zombie.type === "Elite",
								"text-red-600 decoration-red-600 dark:text-red-400 dark:decoration-red-400":
									zombie.type === "Boss",
							},
						)}
					>
						{zombie.title}
					</span>
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className={cn(
						"w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200",
						{
							"border-teal-600/50 dark:border-teal-300/50": zombie.type === "Normal",
							"border-yellow-600/50 dark:border-yellow-300/50": zombie.type === "Special",
							"border-rose-600/50 dark:border-rose-300/50": zombie.type === "Elite",
							"border-red-600/50 dark:border-red-300/50": zombie.type === "Boss",
						},
					)}
				>
					{<ZombieTooltipContent zombie={zombie} />}
				</HoverCardContent>
			</HoverCard>
		)
	}

	return (
		<Popover>
			<PopoverTrigger
				className="relative inline-flex cursor-default items-baseline justify-center align-baseline font-bold"
				asChild
			>
				<span
					className={cn(
						"text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 hover:no-underline dark:text-orange-200 dark:decoration-orange-200",
						{
							"text-teal-600 decoration-teal-600 dark:text-teal-300 dark:decoration-teal-300":
								zombie.type === "Normal",
							"text-yellow-700 decoration-yellow-700 dark:text-yellow-200 dark:decoration-yellow-200":
								zombie.type === "Special",
							"text-rose-600 decoration-rose-600 dark:text-rose-300 dark:decoration-rose-300":
								zombie.type === "Elite",
							"text-red-600 decoration-red-600 dark:text-red-400 dark:decoration-red-400":
								zombie.type === "Boss",
						},
					)}
				>
					{zombie.title}
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className={cn(
					"w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200",
					{
						"border-teal-600/50 dark:border-teal-300/50": zombie.type === "Normal",
						"border-yellow-600/50 dark:border-yellow-300/50": zombie.type === "Special",
						"border-rose-600/50 dark:border-rose-300/50": zombie.type === "Elite",
						"border-red-600/50 dark:border-red-300/50": zombie.type === "Boss",
					},
				)}
			>
				{<ZombieTooltipContent zombie={zombie} />}
			</PopoverContent>
		</Popover>
	)
}

const ZombieTooltipContent = ({ zombie }: { zombie: ZombieById }) => {
	return (
		<div className="relative flex w-full max-w-sm flex-col rounded-md">
			<div className="flex items-center justify-between rounded-t-md bg-accent px-4 py-2 dark:bg-accent/50">
				<div className="flex w-fit items-center justify-center gap-4">
					<TypeBadge type={zombie.type} />
				</div>
				<CustomLink
					href={`/bestiary/${zombie.slug}`}
					className="flex items-center justify-center gap-1 text-xs"
					aria-label="View Zombie Details"
				>
					<ExternalLinkIcon
						className={cn("size-4.5 transition-colors hover:text-primary dark:hover:text-primary", {
							"text-teal-600 dark:text-teal-200": zombie.type === "Normal",
							"text-yellow-600 dark:text-yellow-200": zombie.type === "Special",
							"text-rose-600 dark:text-rose-200": zombie.type === "Elite",
							"text-red-600 dark:text-red-200": zombie.type === "Boss",
						})}
					/>
				</CustomLink>
			</div>
			<div className="mt-2 grid grid-cols-2">
				<div className="flex h-full flex-col">
					<div
						className={cn("pl-3 font-bold text-lg", {
							"text-teal-600 dark:text-teal-300": zombie.type === "Normal",
							"text-yellow-700 dark:text-yellow-200": zombie.type === "Special",
							"text-rose-600 dark:text-rose-300": zombie.type === "Elite",
							"text-red-600 dark:text-red-300": zombie.type === "Boss",
						})}
					>
						{zombie.title}
					</div>
					{zombie.image.url ? (
						<IconImage
							featuredImage={zombie.image}
							alt={`${zombie.title} Image`}
							sizes="272px"
							className="relative z-10 aspect-square w-full rounded-lg object-cover object-top p-2"
						/>
					) : null}
				</div>
				<div className="mt-2 flex flex-col gap-4">
					<div>
						<h3 className="mb-2 flex items-center gap-1 font-semibold text-foreground text-sm">
							<Target className="size-4 text-red-500" />
							Weak Points
						</h3>
						<div className="flex flex-wrap items-center gap-2">
							{zombie.weakPoints.length > 0 ? (
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
							{zombie.elementalWeakness.length > 0 ? (
								zombie.elementalWeakness.map(weakness => (
									<AmmoModTooltipClient key={weakness.id} ammoMod={weakness} />
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
