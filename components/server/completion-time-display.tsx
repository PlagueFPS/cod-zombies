import type { TimeRange } from "@/types/data"
import { Hourglass } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatEstimatedTimeRange } from "@/utils/shared-functions"

interface EstCompletionTimeProps {
	timeRange: TimeRange
}

export function CompletionTimeDisplay({ timeRange }: EstCompletionTimeProps) {
	if (timeRange.reason) {
		return (
			<Tooltip>
				<TooltipTrigger className="flex cursor-help items-center gap-1 rounded-sm text-left text-sm text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
					<Hourglass className="size-4 shrink-0" aria-hidden />
					<span>Est. completion: {formatEstimatedTimeRange(timeRange)}</span>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="max-w-xs">
					{timeRange.reason}
				</TooltipContent>
			</Tooltip>
		)
	}

	return (
		<div className="flex items-center gap-1 text-sm text-muted-foreground">
			<Hourglass className="size-4 shrink-0" aria-hidden />
			<span>Est. completion: {formatEstimatedTimeRange(timeRange)}</span>
		</div>
	)
}
