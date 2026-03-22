"use client"
import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { formatRelativeTimeAgo } from "@/utils/last-updated-format"

const MS_HOUR = 3_600_000

export interface LastUpdatedDisplayProps {
	/** Last modified epoch ms timestamp from `getLastModified`. */
	lastModified: number
	/** Preformatted calendar date from `getLastModified` (tooltip / title). */
	lastModifiedFormatted: string
	/** Visible prefix before the relative time (default "Updated"). */
	label?: string
	className?: string
}

export function LastUpdatedDisplay({
	lastModified,
	lastModifiedFormatted,
	label = "Updated",
	className,
}: LastUpdatedDisplayProps) {
	const [relative, setRelative] = useState<string | null>(null)

	const absoluteDate = lastModifiedFormatted.trim()
	const iso = new Date(lastModified).toISOString()

	useEffect(() => {
		const locale = navigator.language
		const tick = () => {
			setRelative(formatRelativeTimeAgo(lastModified, Date.now(), locale, absoluteDate))
		}
		tick()

		const ageMs = Date.now() - lastModified
		if (ageMs < 0 || ageMs >= MS_HOUR) {
			return
		}

		const stopAt = lastModified + MS_HOUR
		const id = window.setInterval(() => {
			tick()
			if (Date.now() >= stopAt) {
				window.clearInterval(id)
			}
		}, 60_000)

		return () => window.clearInterval(id)
	}, [lastModified, absoluteDate])

	return (
		<Tooltip>
			<TooltipTrigger
				className={cn(
					"inline-flex cursor-help items-baseline gap-0 rounded-sm border-0 bg-transparent p-0 text-left font-inherit text-muted-foreground text-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
					className,
				)}
				aria-label={absoluteDate}
			>
				<span className="flex items-center justify-center gap-1 whitespace-nowrap">
					{label}:
					<time dateTime={iso} className="tabular-nums">
						{relative ?? absoluteDate}
					</time>
				</span>
			</TooltipTrigger>
			<TooltipContent side="bottom" className="max-w-xs">
				{absoluteDate}
			</TooltipContent>
		</Tooltip>
	)
}
