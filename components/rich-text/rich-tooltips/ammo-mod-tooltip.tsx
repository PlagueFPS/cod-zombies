"use client"
import IconImage from "@/components/icon-image/icon-image"
import AugmentTooltip from "@/components/rich-text/rich-tooltips/augment-tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { type AmmoMod, type AmmoModKey, getAmmoModByKey } from "@/data/ammo-mods"
import { useIsMobile } from "@/hooks/use-mobile"

interface AmmoModTooltipPropsWithKey {
	ammoModKey: AmmoModKey
	ammoMod?: never
}

interface AmmoModTooltipPropsWithAmmoMod {
	ammoModKey?: never
	ammoMod: AmmoMod
}

type AmmoModTooltipProps = AmmoModTooltipPropsWithKey | AmmoModTooltipPropsWithAmmoMod

export default function AmmoModTooltip(props: AmmoModTooltipProps) {
	const isMobile = useIsMobile(640)
	const ammoMod = props.ammoModKey ? getAmmoModByKey(props.ammoModKey) : props.ammoMod

	if (!isMobile)
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger
					className="group relative inline-flex cursor-default items-baseline justify-center gap-0.5 align-baseline"
					asChild
				>
					<span>
						<IconImage
							featuredImage={ammoMod.image}
							alt={`${ammoMod.title} Image`}
							width={64}
							height={24}
							sizes="64px"
							className="my-auto h-6 w-auto"
						/>
						<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
							{ammoMod.title}
						</span>
					</span>
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className="w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200"
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
					<IconImage
						featuredImage={ammoMod.image}
						alt={`${ammoMod.title} Image`}
						width={64}
						height={24}
						sizes="64px"
						className="my-auto h-6 w-auto"
					/>
					<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
						{ammoMod.title}
					</span>
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className="w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200"
			>
				{<AmmoModTooltipContent ammoMod={ammoMod} />}
			</PopoverContent>
		</Popover>
	)
}

const AmmoModTooltipContent = ({ ammoMod }: { ammoMod: AmmoMod }) => {
	return (
		<div className="relative flex w-full flex-col rounded-md px-4 py-2">
			<div className="relative flex items-center justify-center">
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
				<IconImage
					featuredImage={ammoMod.image}
					alt={`${ammoMod.title} Image`}
					width={64}
					height={80}
					sizes="64px"
					className="relative z-10 h-20 w-auto p-2"
				/>
			</div>
			<div className="-mt-3 relative z-10">
				<div className="px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200">
					{ammoMod.title}
				</div>
				<div className="mt-2 pb-4">
					<p className="text-center text-orange-800 text-sm dark:text-orange-200">
						{ammoMod.description}
					</p>
				</div>
				{ammoMod.augments ? (
					<>
						<Separator />
						<div className="my-4 flex flex-col items-center justify-center">
							<div className="flex w-full flex-col gap-3">
								<h4 className="text-start font-semibold text-major-augment text-sm">
									MAJOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{ammoMod.augments
										.filter(augment => augment.type === "Major")
										.map(augment => (
											<div key={augment.id} className="shrink-0">
												<AugmentTooltip augment={augment} />
											</div>
										))}
								</div>
							</div>
							<Separator className="my-4" />
							<div className="flex w-full flex-col gap-3">
								<h4 className="text-start font-semibold text-orange-700 text-sm tracking-wide dark:text-orange-300">
									MINOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{ammoMod.augments
										.filter(augment => augment.type === "Minor")
										.map(augment => (
											<div key={augment.id} className="shrink-0">
												<AugmentTooltip augment={augment} />
											</div>
										))}
								</div>
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	)
}
