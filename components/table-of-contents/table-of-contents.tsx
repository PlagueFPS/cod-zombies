"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useShortcut } from "@/hooks/use-keyboard-shortcuts"
import { useTableOfContents } from "@/hooks/use-table-of-contents"
import { cn } from "@/lib/utils"
import { IS_MAC_OS } from "@/utils/constants"
import BackToTopButton from "../back-to-top-button/back-to-top-button"
import Shortcut from "../shortcut/shortcut"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import MobileTableOfContents from "./mobile-table-of-contents"
import { useIsMobile } from "@/hooks/use-mobile"

export interface Heading {
	type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
	text: string
	id: string
}

interface TableOfContentsProps {
	headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
	const { activeHeading, currentHeading, progress } = useTableOfContents(headings, "body")
	const [isExpanded, setIsExpanded] = useState(headings.length > 4)
	const isMobile = useIsMobile(1280)

	useShortcut("alt+c", () => setIsExpanded(!isExpanded))

	return (
		<>
			{ !isMobile ? (
				<aside className="sticky top-20 z-40 ml-4 hidden h-fit w-85 shrink-0 bg-background px-6 shadow-md xl:block dark:shadow-none">
					<div className="relative flex flex-col">
						<div className="mt-4 flex flex-col items-center justify-center">
							<div className="mb-2 flex w-full items-center justify-between">
								<span className="text-muted-foreground text-sm">Guide progress</span>
								<span className="font-medium text-xs">{progress}%</span>
							</div>
							<Progress value={progress} className="h-1" />
						</div>
						<div className="flex items-center justify-between border-t py-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={"ghost"}
										size={"sm"}
										onClick={() => setIsExpanded(!isExpanded)}
										aria-label={
											isExpanded ? "Collapse table of contents" : "Expand table of contents"
										}
										className="w-full justify-between hover:dark:bg-input/30"
									>
										<h3 className="font-medium text-muted-foreground text-sm">CURRENT SECTION</h3>
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
									<Shortcut
										shortcuts={IS_MAC_OS ? ["Option", "C"] : ["Alt", "C"]}
										size="sm"
										variant="ghost"
									/>
									<span>Toggle Expanded</span>
								</TooltipContent>
							</Tooltip>
						</div>
						<div className="border-b pb-4">
							<Button
								variant={"ghost"}
								className="w-full justify-start truncate rounded-sm bg-accent font-medium dark:bg-input/30"
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
									"flex flex-col gap-3 overflow-hidden py-4 font-semibold text-foreground/90 text-sm",
									{ "border-none": !isExpanded },
								)}
							>
								{headings.map(heading => (
									<li
										key={`desktop-toc-${heading.id}`}
										className={cn("w-fit pl-1 transition-colors hover:text-primary", {
											"pl-4 font-medium text-foreground/80": heading.type === "h3",
											"pl-7 font-normal text-foreground/60": heading.type === "h4",
											"text-primary": activeHeading === heading.id,
										})}
									>
										<Link href={`#${heading.id}`}>{heading.text}</Link>
									</li>
								))}
							</ul>
							<ScrollBar orientation="vertical" />
						</ScrollArea>
						<div
							className={cn(
								"sticky bottom-0 mt-4 flex w-full items-center justify-center border-t py-4 transition-all duration-300",
								{
									"mt-0 border-none": !isExpanded,
								},
							)}
						>
							<BackToTopButton variant={"outline"} />
						</div>
					</div>
				</aside>
			): (
				<MobileTableOfContents
					headings={headings}
					activeHeading={activeHeading}
					currentHeading={currentHeading}
					progress={progress}
				/>
			)}
		</>
	)
}
