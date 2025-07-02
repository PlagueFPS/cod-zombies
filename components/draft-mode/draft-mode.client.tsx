"use client"
import { Eye, EyeOff } from "lucide-react"
import { usePathname } from "next/navigation"
import { toggleDraftMode } from "@/data/actions"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface IDraftModeButton {
	draftMode: boolean
}

export default function DraftModeButton({ draftMode }: IDraftModeButton) {
	const pathname = usePathname()

	return (
		<TooltipProvider>
			<Tooltip delayDuration={200}>
				<TooltipTrigger className="fixed right-16 bottom-8 flex w-fit items-center justify-center">
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={async () => await toggleDraftMode(undefined, { pathname })}
						title={draftMode ? "Disable Draft Mode" : "Enable Draft Mode"}
						aria-label={draftMode ? "Disable Draft Mode" : "Enable Draft Mode"}
						className="size-10 rounded-full p-1.5"
						asChild
					>
						{draftMode ? <EyeOff /> : <Eye />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>{draftMode ? "Disable Draft Mode" : "Enable Draft Mode"}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
