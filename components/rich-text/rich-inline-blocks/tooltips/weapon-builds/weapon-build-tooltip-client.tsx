"use client"
import type { MinifiedWeaponBuild } from "@/data/weapon-builds"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import IconImage from "@/components/icon-image/icon-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		if (!weaponBuild.buildCode) return
		await navigator.clipboard.writeText(weaponBuild.buildCode)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="w-full max-w-96 border-border/50 bg-card/80 shadow-lg backdrop-blur-md">
			<div className="p-5">
				{/* Weapon Header with Larger Image */}
				<div className="mb-5 flex items-start gap-4">
					<div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/20">
						<IconImage
							featuredImage={weaponBuild.image}
							alt={weaponBuild.title}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className="flex-1 pt-1">
						<h3 className="text-balance font-bold text-foreground text-lg leading-tight">
							{weaponBuild.title}
						</h3>
					</div>
				</div>

				{/* Build Code with Glass Effect */}
				{weaponBuild.buildCode && (
					<div className="mb-5">
						<div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-3 backdrop-blur-sm">
							<code className="flex-1 font-mono font-semibold text-primary/90 text-sm">
								{weaponBuild.buildCode}
							</code>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleCopy}
								className="h-7 w-7 rounded-md p-0 text-primary/70 hover:bg-primary/10 hover:text-primary"
							>
								{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
							</Button>
						</div>
					</div>
				)}

				{/* Attachments with Subtle Dividers */}
				{weaponBuild.attachments.length > 0 && (
					<div>
						<div className="mb-3 flex items-center gap-2">
							<div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
							<span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary text-xs">
								ATTACHMENTS
							</span>
							<div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
						</div>
						<div className="space-y-2.5">
							{weaponBuild.attachments.map(attachment => (
								<div
									key={attachment.id}
									className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-muted/20"
								>
									<span className="font-medium text-foreground text-sm">{attachment.title}</span>
									<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
										{attachment.type}
									</Badge>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Empty State */}
				{weaponBuild.attachments.length === 0 && !weaponBuild.buildCode && (
					<div className="py-6 text-center">
						<div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
							<div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
						</div>
						<p className="text-muted-foreground text-sm">Stock configuration</p>
					</div>
				)}
			</div>
		</div>
	)
	// return (
	// 	<div className="relative flex w-full flex-col rounded-md px-4 py-2">
	// 		{weaponBuild.image.url ? (
	// 			<div className="relative flex items-center justify-center">
	// 				<div className="absolute top-0 right-0 bottom-0 left-0 z-9 mx-auto w-20 rounded-full bg-opacity-25" />
	// 				<IconImage
	// 					featuredImage={weaponBuild.image}
	// 					alt={`${weaponBuild.title} Image`}
	// 					sizes="80px"
	// 					className="relative z-10 h-20 w-auto p-2"
	// 				/>
	// 			</div>
	// 		) : null}
	// 		<div className="relative z-10">
	// 			<div className="px-4 text-center font-bold text-lg text-orange-700 dark:text-orange-200">
	// 				{`${weaponBuild.title} Weapon Build`}
	// 			</div>
	// 			<div className="mx-auto mt-2 grid grid-cols-1 place-content-center gap-2 text-orange-800 text-sm dark:text-orange-200">
	// 				{weaponBuild.buildCode ? (
	// 					<span>{weaponBuild.buildCode}</span>
	// 				) : (
	// 					weaponBuild.attachments.map(attachment => (
	// 						<div
	// 							key={attachment.id}
	// 							className="mx-auto flex w-full items-center justify-start gap-1"
	// 						>
	// 							<span>{attachment.type}:</span>
	// 							<span>{attachment.title}</span>
	// 						</div>
	// 					))
	// 				)}
	// 			</div>
	// 		</div>
	// 	</div>
	// )
}
