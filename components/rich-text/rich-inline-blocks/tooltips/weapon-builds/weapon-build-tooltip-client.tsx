"use client"
import type { MinifiedWeaponBuild } from "@/data/weapon-builds"
import IconImage from "@/components/icon-image/icon-image"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useIsMobile } from "@/hooks/use-mobile"

export default function WeaponBuildTooltipClient({
	weaponBuild,
}: {
	weaponBuild: MinifiedWeaponBuild
}) {
	const isMobile = useIsMobile(640)

	if (!isMobile)
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger
					className="group relative inline-flex cursor-default items-baseline justify-center gap-0.5 align-baseline"
					asChild
				>
					<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
						{weaponBuild.title}
					</span>
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className="w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200"
				>
					{<WeaponBuildTooltipContent weaponBuild={weaponBuild} />}
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger
				className="group relative inline-flex cursor-default items-baseline justify-center gap-0.5 align-baseline"
				asChild
			>
				<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
					{weaponBuild.title}
				</span>
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className="w-sm border-orange-600/30 bg-background p-0 text-orange-600 shadow-orange-600 shadow-xs dark:border-orange-200/30 dark:text-orange-200 dark:shadow-orange-200"
			>
				{<WeaponBuildTooltipContent weaponBuild={weaponBuild} />}
			</PopoverContent>
		</Popover>
	)
}

const WeaponBuildTooltipContent = ({ weaponBuild }: { weaponBuild: MinifiedWeaponBuild }) => {
	return (
		<div className="relative flex w-full flex-col rounded-md px-4 py-2">
			{weaponBuild.image.url ? (
				<div className="relative flex items-center justify-center">
					<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
					<IconImage
						featuredImage={weaponBuild.image}
						alt={`${weaponBuild.title} Image`}
						sizes="64px"
						className="relative z-10 h-20 w-auto p-2"
					/>
				</div>
			) : null}
			<div className="-mt-3 relative z-10">
				<div className="px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200">
					{weaponBuild.title}
				</div>
				<div className="mt-6 pb-8">
					<div className="text-center text-orange-800 text-sm dark:text-orange-200">
						{weaponBuild.buildCode
							? weaponBuild.buildCode
							: weaponBuild.attachments.map(attachment => (
									<span key={attachment.id}>
										{attachment.type}: {attachment.title}
									</span>
								))}
					</div>
				</div>
			</div>
		</div>
	)
}
