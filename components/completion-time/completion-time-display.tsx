import type { MainQuestTimeRange } from "@/data/main-quests"
import { Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatEstimatedTimeRange } from "@/utils/functions.client"

interface EstCompletionTimeProps {
	timeRange: MainQuestTimeRange
}

export function CompletionTimeDisplay({ timeRange }: EstCompletionTimeProps) {
	if (timeRange.reason) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						className="flex cursor-help items-center gap-1 rounded-sm text-left text-muted-foreground text-sm hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
					>
						<Clock className="size-4 shrink-0" aria-hidden />
						<span>Est. completion: {formatEstimatedTimeRange(timeRange)}</span>
					</button>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="max-w-xs">
					{timeRange.reason}
				</TooltipContent>
			</Tooltip>
		)
	}

	return (
		<div className="flex items-center gap-1 text-muted-foreground text-sm">
			<Clock className="size-4 shrink-0" aria-hidden />
			<span>Est. completion: {formatEstimatedTimeRange(timeRange)}</span>
		</div>
	)
}
