"use client"
import { Option } from "effect"
import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import IconImage from "@/components/icon-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getWeaponBuildByKey, type WeaponBuild, type WeaponBuildKey } from "@/data/weapon-builds"
import { useIsMobile } from "@/hooks/use-mobile"

export default function WeaponBuildTooltip({ weaponBuildKey }: { weaponBuildKey: WeaponBuildKey }) {
	const isMobile = useIsMobile(640)
	const weaponBuild = getWeaponBuildByKey(weaponBuildKey)
	if (Option.isNone(weaponBuild)) {
		console.error(`Unable to render tooltip for weapon build: ${weaponBuildKey}`)
		return "[MISSING_WEAPON_BUILD]"
	}

	if (!isMobile)
		return (
			<HoverCard>
				<HoverCardTrigger className="group relative inline-flex cursor-default items-baseline justify-center gap-0.5 align-baseline">
					<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
						{weaponBuild.value.title}
					</span>
				</HoverCardTrigger>
				<HoverCardContent side="top" className="w-sm">
					{<WeaponBuildTooltipContent weaponBuild={weaponBuild.value} />}
				</HoverCardContent>
			</HoverCard>
		)

	return (
		<Popover>
			<PopoverTrigger className="group relative inline-flex cursor-default items-baseline justify-center gap-0.5 align-baseline">
				<span className="text-center text-orange-700 underline decoration-orange-700 decoration-dotted underline-offset-4 group-hover:no-underline dark:text-orange-200 dark:decoration-orange-200">
					{weaponBuild.value.title}
				</span>
			</PopoverTrigger>
			<PopoverContent side="top" className="w-sm">
				{<WeaponBuildTooltipContent weaponBuild={weaponBuild.value} />}
			</PopoverContent>
		</Popover>
	)
}

const WeaponBuildTooltipContent = ({ weaponBuild }: { weaponBuild: WeaponBuild }) => {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		if (Option.isNone(weaponBuild.buildCode)) return
		await navigator.clipboard.writeText(weaponBuild.buildCode.value)
		toast.success("Build Code Copied to Clipboard!", { duration: 1500, position: "top-center" })
		setCopied(true)
	}

	return (
		<div className="w-full rounded-md bg-card/80">
			<div className="p-5">
				<div className="mb-4 flex items-start gap-4">
					<div className="relative w-40 shrink-0 overflow-hidden rounded-xl">
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
						<h3 className="text-lg leading-tight font-bold text-balance text-orange-800 dark:text-orange-200">
							{weaponBuild.title}
						</h3>
					</div>
				</div>
				{Option.match(weaponBuild.buildCode, {
					onNone: () => null,
					onSome: buildCode => (
						<div className="mb-5">
							<div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 p-3 backdrop-blur-sm">
								<span className="font-medium">Build Code:</span>
								<code className="flex-1 rounded-sm bg-input/30 p-2 text-sm font-semibold text-primary">
									{buildCode}
								</code>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleCopy}
									className="h-7 w-7 rounded-md p-0 text-orange-700 hover:text-primary dark:text-orange-200"
								>
									{copied ? (
										<Check className="h-3.5 w-3.5 text-green-500" />
									) : (
										<Copy aria-label="Copy to clipboard" className="h-3.5 w-3.5" />
									)}
								</Button>
							</div>
						</div>
					),
				})}
				{Option.match(weaponBuild.attachments, {
					onNone: () => null,
					onSome: attachments => (
						<div>
							<div className="my-3 flex items-center gap-2">
								<div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/60 to-transparent" />
								<span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-orange-800 dark:text-primary">
									ATTACHMENTS
								</span>
								<div className="h-px flex-1 bg-linear-to-r from-transparent via-primary/60 to-transparent" />
							</div>
							<div className="space-y-2.5">
								{attachments.map(attachment => (
									<div
										key={attachment.id}
										className="flex items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-muted/20"
									>
										<span className="text-sm font-medium text-foreground">{attachment.title}</span>
										<Badge className="badge-primary-gradient dark:dark-badge-primary-gradient">
											{attachment.type}
										</Badge>
									</div>
								))}
							</div>
						</div>
					),
				})}

				{/* Empty State */}
				{Option.isNone(weaponBuild.attachments) && Option.isNone(weaponBuild.buildCode) && (
					<div className="py-6 text-center">
						<div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
							<div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
						</div>
						<p className="text-sm text-muted-foreground">Stock configuration</p>
					</div>
				)}
			</div>
		</div>
	)
}
