"use client"
import type { MinifiedAmmoMod } from "@/data/ammo-mods"
import IconImage from "@/components/icon-image/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"
import AugmentTooltipClient from "../augments/augment-tooltip-client"
import { Separator } from "@/components/ui/separator"

export default function AmmoModTooltipClient({ ammoMod }: { ammoMod: MinifiedAmmoMod }) {
	const isMobile = useIsMobile(640)

	if (!isMobile)
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger
					className="group relative inline-flex cursor-default items-baseline justify-center gap-0.5 align-baseline"
					asChild
				>
					<span>
						{ammoMod.image.url ? (
							<IconImage
								featuredImage={ammoMod.image}
								alt={`${ammoMod.title} Image`}
								sizes="64px"
								className="my-auto h-6 w-auto"
							/>
						) : null}
						<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
							{ammoMod.title}
						</span>
					</span>
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className="w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200"
				>
					{<AmmoModTooltipContent ammoMod={ammoMod} />}
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger
				className="group relative inline-flex cursor-default items-baseline justify-center gap-0.5 align-baseline"
				asChild
			>
				<span>
					{ammoMod.image.url ? (
						<IconImage
							featuredImage={ammoMod.image}
							alt={`${ammoMod.title} Image`}
							sizes="64px"
							className="my-auto h-6 w-auto"
						/>
					) : null}
					<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
						{ammoMod.title}
					</span>
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className="w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200"
			>
				{<AmmoModTooltipContent ammoMod={ammoMod} />}
			</PopoverContent>
		</Popover>
	)
}

const AmmoModTooltipContent = ({ ammoMod }: { ammoMod: MinifiedAmmoMod }) => {
	return (
		<div className="relative flex w-full flex-col rounded-md px-4 py-2">
			{ammoMod.image.url ? (
				<div className="relative flex items-center justify-center">
					<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
					<IconImage
						featuredImage={ammoMod.image}
						alt={`${ammoMod.title} Image`}
						sizes="64px"
						className="relative z-10 h-20 w-auto p-2"
					/>
				</div>
			) : null}
			<div className="-mt-3 relative z-10">
				<div className="px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200">
					{ammoMod.title}
				</div>
				<div className="mt-2 pb-4">
					<p className="text-center text-orange-800 text-sm dark:text-orange-200">
						{ammoMod.description}
					</p>
				</div>
				<Separator />
				<div className="flex flex-col gap-6 justify-center items-center my-4">
					<div className="flex flex-col gap-3">
						<h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 text-center tracking-wide">MAJOR AUGMENTS</h4>
						<div className="flex justify-evenly items-center gap-6">
							{ammoMod.augments
								.filter(augment => augment.type === "Major")
								.map(augment => (
									<AugmentTooltipClient key={augment.id} augment={augment} />
								))}
						</div>
					</div>
					<div className="flex flex-col gap-3">
						<h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 text-center tracking-wide">MINOR AUGMENTS</h4>
						<div className="flex justify-evenly items-center gap-6">
							{ammoMod.augments
								.filter(augment => augment.type === "Minor")
								.map(augment => (
									<AugmentTooltipClient key={augment.id} augment={augment} />
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
