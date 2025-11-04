"use client"
import type { Heading } from "@/components/table-of-contents/table-of-contents"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { RemoveScroll } from "react-remove-scroll"
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { Progress } from "../ui/progress"
import { ScrollArea } from "../ui/scroll-area"

interface MobileTableOfContentsProps {
	headings: Heading[]
	activeHeading: string
	currentHeading: Heading | undefined
	progress: number
}

export default function MobileTableOfContents({
	headings,
	activeHeading,
	currentHeading,
	progress,
}: MobileTableOfContentsProps) {
	const [open, setOpen] = useState(false)

	return (
		<div className="sticky top-16 z-10 block w-full bg-background/90 backdrop-blur-xs supports-backdrop-filter:backdrop-blur-xs xl:hidden">
			<Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
				<CollapsibleTrigger asChild>
					<div className="relative flex w-full flex-col items-center p-3">
						<div className="flex w-full items-center gap-1 overflow-hidden">
							<h3 className="truncate font-bold">{currentHeading?.text || "Introduction"}</h3>
							<ChevronDown className="ml-auto size-5 shrink-0 group-data-[state=open]/collapsible:rotate-180" />
						</div>
						<Progress
							value={progress}
							className="absolute right-0 bottom-0 z-50 h-1 w-full rounded-none"
						/>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent className="flex flex-col justify-center gap-4">
					<RemoveScroll>
						<ScrollArea className="max-h-[90dvh] overflow-y-scroll border-t bg-background px-4 py-4">
							<nav className="flex flex-col gap-4 pb-12">
								<ul className="flex max-h-full flex-col gap-3 font-medium text-foreground/90 text-sm">
									{headings.map(heading => (
										<li
											key={`mobile-toc-${heading.id}`}
											className={cn("w-fit transition-colors hover:text-primary", {
												"pl-3 font-medium text-foreground/70": heading.type === "h3",
												"pl-6 font-normal text-foreground/50": heading.type === "h4",
												"text-primary": activeHeading === heading.id,
											})}
										>
											<Link href={`#${heading.id}`} onNavigate={() => setOpen(false)}>
												{heading.text}
											</Link>
										</li>
									))}
								</ul>
							</nav>
						</ScrollArea>
					</RemoveScroll>
				</CollapsibleContent>
			</Collapsible>
		</div>
	)
}
