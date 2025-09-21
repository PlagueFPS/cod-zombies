"use client"
import IconImage from "@/components/icon-image/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
	type FieldUpgrade,
	type FieldUpgradeKey,
	getFieldUpgradeByKey,
} from "@/data/field-upgrades"
import { useIsMobile } from "@/hooks/use-mobile"
import AugmentTooltip from "./augment-tooltip"

export default function FieldUpgradeTooltip({
	fieldUpgradeKey,
}: {
	fieldUpgradeKey: FieldUpgradeKey
}) {
	const isMobile = useIsMobile(640)
	const fieldUpgrade = getFieldUpgradeByKey(fieldUpgradeKey)

	if (!isMobile)
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger
					className="group relative inline-flex cursor-default items-baseline justify-center gap-1 align-baseline"
					asChild
				>
					<span>
						<IconImage
							featuredImage={fieldUpgrade.image}
							alt={`${fieldUpgrade.title} Image`}
							sizes="64px"
							className="my-auto h-6 w-auto"
						/>
						<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
							{fieldUpgrade.title}
						</span>
					</span>
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className="w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200"
				>
					{<FieldUpgradeTooltipContent fieldUpgrade={fieldUpgrade} />}
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger
				className="group relative inline-flex cursor-default items-baseline justify-center gap-1 align-baseline"
				asChild
			>
				<span>
					<IconImage
						featuredImage={fieldUpgrade.image}
						alt={`${fieldUpgrade.title} Image`}
						sizes="64px"
						className="my-auto h-6 w-auto"
					/>
					<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
						{fieldUpgrade.title}
					</span>
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className="w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200"
			>
				{<FieldUpgradeTooltipContent fieldUpgrade={fieldUpgrade} />}
			</PopoverContent>
		</Popover>
	)
}

const FieldUpgradeTooltipContent = ({ fieldUpgrade }: { fieldUpgrade: FieldUpgrade }) => {
	return (
		<div className="relative flex w-full flex-col rounded-md px-4 py-2">
			<div className="relative flex items-center justify-center">
				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
				<IconImage
					featuredImage={fieldUpgrade.image}
					alt={`${fieldUpgrade.title} Image`}
					sizes="64px"
					className="relative z-10 h-20 w-auto p-2"
				/>
			</div>
			<div className="-mt-3 relative z-10">
				<h3 className="px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200">
					{fieldUpgrade.title}
				</h3>
				<div className="mt-2 pb-4">
					<p className="text-center text-orange-800 text-sm dark:text-orange-200">
						{fieldUpgrade.description}
					</p>
				</div>
				{fieldUpgrade.augments ? (
					<>
						<Separator />
						<div className="my-4 flex flex-col items-center justify-center">
							<div className="flex flex-col gap-3">
								<h4 className="text-start font-semibold text-major-augment text-sm">
									MAJOR AUGMENTS
								</h4>
								<div className="flex flex-wrap gap-3">
									{fieldUpgrade.augments
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
									{fieldUpgrade.augments
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
