"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useTableOfContents } from "@/hooks/use-table-of-contents"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { ScrollArea } from "../ui/scroll-area"
import MobileTableOfContents from "./mobile-table-of-contents"

export interface Heading {
	type: string
	text: string
	id: string
}

interface TableOfContentsProps {
	headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
	const { activeHeading, currentHeading, progress } = useTableOfContents(headings, "body")
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<>
			<aside className="sticky top-24 z-40 ml-4 hidden h-fit w-85 shrink-0 rounded-lg border px-6 shadow-md xl:block dark:shadow-none">
				<div className="flex flex-col gap-4 pt-4">
					<div className="flex items-center justify-between">
						<h3 className="font-medium text-muted-foreground text-sm">CURRENT SECTION</h3>
						<Button
							variant={"ghost"}
							size={"sm"}
							onClick={() => setIsExpanded(!isExpanded)}
							aria-label={isExpanded ? "Collapse table of contents" : "Expand table of contents"}
						>
							{isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
						</Button>
					</div>
					<div>
						<Button
							variant={"ghost"}
							className="w-full justify-start rounded-sm bg-accent font-medium dark:bg-accent/50"
							onClick={() => setIsExpanded(!isExpanded)}
						>
							{currentHeading?.text || "Introduction"}
						</Button>
					</div>
					<ScrollArea
						className={cn("grid max-h-[60vh] grid-rows-[0fr] gap-1 overflow-hidden transition-all duration-300", {
							"grid-rows-[1fr]": isExpanded,
						})}
					>
						<ul
							className={cn(
								"flex flex-col gap-3 overflow-hidden border-t py-4 pl-1 font-semibold text-foreground/90 text-sm",
								{ "border-none": !isExpanded },
							)}
						>
							{headings.map(heading => (
								<li
									key={`desktop-toc-${heading.id}`}
									className={cn("w-fit transition-colors hover:text-primary", {
										"pl-3 font-medium text-foreground/70": heading.type === "heading-3",
										"pl-6 font-normal text-foreground/50": heading.type === "heading-4",
										"text-primary": activeHeading === heading.id,
									})}
								>
									<Link href={`#${heading.id}`} onNavigate={() => setIsExpanded(false)}>
										{heading.text}
									</Link>
								</li>
							))}
						</ul>
					</ScrollArea>
				</div>
				<div className="mt-4 border-t py-4">
					<div className="mb-2 flex items-center justify-between">
						<span className="text-muted-foreground text-sm">Guide progress</span>
						<span className="font-medium text-xs">{progress}%</span>
					</div>
					<Progress value={progress} className="h-1" />
				</div>
			</aside>
			<MobileTableOfContents headings={headings} activeHeading={activeHeading} currentHeading={currentHeading} />
		</>
	)
}
