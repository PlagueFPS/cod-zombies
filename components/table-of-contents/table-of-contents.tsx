"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { useTableOfContents } from "@/hooks/use-table-of-contents"
import { cn } from "@/lib/utils"
import { IS_MAC_OS } from "@/utils/constants"
import BackToTopButton from "../back-to-top-button/back-to-top-button"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { ScrollArea } from "../ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
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
	const [isExpanded, setIsExpanded] = useState(true)

	useShortcut("alt+c", () => setIsExpanded(!isExpanded))

	return (
		<>
			<aside className="sticky top-20 z-40 ml-4 hidden h-fit w-85 shrink-0 rounded-lg border bg-background px-6 shadow-md xl:block dark:shadow-none">
				<div className="relative flex flex-col">
					<div className="mt-4 flex flex-col items-center justify-center">
						<div className="mb-2 flex w-full items-center justify-between">
							<span className="text-muted-foreground text-sm">Guide progress</span>
							<span className="font-medium text-xs">{progress}%</span>
						</div>
						<Progress value={progress} className="h-1" />
					</div>
					<div className="flex items-center justify-between border-t py-2">
						<h3 className="font-medium text-muted-foreground text-sm">CURRENT SECTION</h3>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant={"ghost"}
									size={"sm"}
									onClick={() => setIsExpanded(!isExpanded)}
									aria-label={
										isExpanded ? "Collapse table of contents" : "Expand table of contents"
									}
								>
									{isExpanded ? (
										<ChevronUp className="size-4" />
									) : (
										<ChevronDown className="size-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent
								sideOffset={5}
								className="z-999 flex items-center justify-center gap-2"
							>
								<span>Toggle Expanded</span>
								<kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-medium text-muted-foreground text-xs opacity-100">
									{IS_MAC_OS ? "Option+C" : "Alt+C"}
								</kbd>
							</TooltipContent>
						</Tooltip>
					</div>
					<div className="border-b pb-4">
						<Button
							variant={"ghost"}
							className="w-full justify-start truncate rounded-sm bg-accent font-medium dark:bg-accent/50"
							onClick={() => setIsExpanded(!isExpanded)}
						>
							<span className="truncate">{currentHeading?.text || "Introduction"}</span>
						</Button>
					</div>
					<ScrollArea
						className={cn(
							"grid max-h-[50vh] grid-rows-[1fr] gap-1 overflow-hidden transition-all duration-300",
							{
								"animate-toc-expand grid-rows-[0fr] pb-0": !isExpanded,
							},
						)}
					>
						<ul
							className={cn(
								"flex flex-col gap-3 overflow-hidden py-4 pl-1 font-semibold text-foreground/90 text-sm",
								{ "border-none": !isExpanded },
							)}
						>
							{headings.map(heading => (
								<li
									key={`desktop-toc-${heading.id}`}
									className={cn("w-fit transition-colors hover:text-primary", {
										"pl-3 font-medium text-foreground/80": heading.type === "heading-3",
										"pl-6 font-normal text-foreground/60": heading.type === "heading-4",
										"text-primary": activeHeading === heading.id,
									})}
								>
									<Link href={`#${heading.id}`}>{heading.text}</Link>
								</li>
							))}
						</ul>
					</ScrollArea>
					<div className="sticky bottom-0 flex w-full items-center justify-center border-t py-4">
						<BackToTopButton variant={"outline"} />
					</div>
				</div>
			</aside>
			<MobileTableOfContents
				headings={headings}
				activeHeading={activeHeading}
				currentHeading={currentHeading}
				progress={progress}
			/>
			<BackToTopButton mobile variant={"default"} className="right-4 bottom-8 xl:hidden" />
		</>
	)
}
