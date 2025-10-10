"use client"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import IconImage from "@/components/icon-image/icon-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getWeaponBuildByKey, type WeaponBuild, type WeaponBuildKey } from "@/data/weapon-builds"
import { useIsMobile } from "@/hooks/use-mobile"

export default function WeaponBuildTooltip({ weaponBuildKey }: { weaponBuildKey: WeaponBuildKey }) {
	const isMobile = useIsMobile(640)
	const weaponBuild = getWeaponBuildByKey(weaponBuildKey)

	if (!isMobile)
		return (
			<HoverCard openDelay={200}>
				<HoverCardTrigger
					className="group relative inline-flex cursor-default items-baseline justify-center gap-0.5 align-baseline"
					asChild
				>
					<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 hover:no-underline group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
						{weaponBuild.title}
					</span>
				</HoverCardTrigger>
				<HoverCardContent
					side="top"
					className="w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200"
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
				className="w-sm border-2 border-orange-800/50 bg-background p-0 text-orange-600 dark:border-orange-200/30 dark:text-orange-200"
			>
				{<WeaponBuildTooltipContent weaponBuild={weaponBuild} />}
			</PopoverContent>
		</Popover>
	)
}

const WeaponBuildTooltipContent = ({ weaponBuild }: { weaponBuild: WeaponBuild }) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		if (!weaponBuild.buildCode) return
		await navigator.clipboard.writeText(weaponBuild.buildCode)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className="w-full rounded-md bg-card/80">
			<div className="p-5">
				{/* Weapon Header with Larger Image */}
				<div className="mb-4 flex items-start gap-4">
					<div className="relative w-40 flex-shrink-0 overflow-hidden rounded-xl">
						<IconImage
							featuredImage={weaponBuild.image}
							alt={weaponBuild.title}
							sizes="140px"
							width={140}
							height={80}
							withLoader
							className="h-auto w-full object-cover"
						/>
					</div>
					<div className="flex-1 pt-1">
						<h3 className="text-balance font-bold text-lg text-orange-800 leading-tight dark:text-orange-200">
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
				{weaponBuild.attachments && (
					<div>
						<div className="my-3 flex items-center gap-2">
							<div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
							<span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-orange-800 text-xs dark:text-primary">
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
				{!weaponBuild.attachments && !weaponBuild.buildCode && (
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
}
