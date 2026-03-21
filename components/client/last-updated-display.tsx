"use client"

import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { formatRelativeTimeAgo } from "@/utils/last-updated-format"

const MS_HOUR = 3_600_000

const triggerClassName = (className?: string) => cn(
	"inline-flex cursor-help items-baseline gap-0 rounded-sm border-0 bg-transparent p-0 text-left font-inherit text-muted-foreground text-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
	className,
)

export interface LastUpdatedDisplayProps {
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
	const iso = Number.isFinite(lastModified)
		? new Date(lastModified).toISOString()
		: undefined

	useEffect(() => {
		const tick = () => {
			setRelative(
				formatRelativeTimeAgo(lastModified, Date.now(), undefined, absoluteDate),
			)
		}
		tick()

		const ageMs = Date.now() - lastModified
		if (ageMs < 0 || ageMs >= MS_HOUR) {
			return
		}

		const id = window.setInterval(tick, 60_000)
		return () => window.clearInterval(id)
	}, [lastModified, absoluteDate])

	const titleAndTip = absoluteDate || undefined

	const body = (
		<span className="whitespace-nowrap">
			{label}:{" "}
			{iso ? (
				<time dateTime={iso} className="tabular-nums">
					{relative ?? "—"}
				</time>
			) : (
				<span>—</span>
			)}
		</span>
	)

	if (!absoluteDate) {
		return <span className={triggerClassName(className)}>{body}</span>
	}

	return (
		<Tooltip>
			<TooltipTrigger className={triggerClassName(className)} title={titleAndTip}>
				<span className="contents">
					{body}
					<span className="sr-only">{`. ${absoluteDate}`}</span>
				</span>
			</TooltipTrigger>
			<TooltipContent side="bottom" className="max-w-xs">
				{absoluteDate}
			</TooltipContent>
		</Tooltip>
	)
}
