import { useHotkey } from "@tanstack/react-hotkeys"
import { cn } from "cn"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { BackToTopButton } from "@/components/back-to-top-button"
import { CustomLink } from "@/components/custom-link"
import { MobileTableOfContents } from "@/components/mobile-table-of-contents"
import { Shortcut } from "@/components/shortcut"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTableOfContents } from "@/hooks/use-table-of-contents"

export interface Heading {
	type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
	text: string
	id: string
}

interface TableOfContentsProps {
	headings: Heading[]
	className?: string
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
	const { activeHeading, currentHeading, progress } = useTableOfContents(headings, "body")
	const [isExpanded, setIsExpanded] = useState(headings.length > 4)
	const isMobile = useIsMobile(1280)

	useHotkey("Alt+C", () => setIsExpanded(!isExpanded))

	return (
		<>
			{!isMobile ? (
				<aside
					className={cn(
						"sticky top-20 z-40 ml-4 hidden h-fit w-85 shrink-0 bg-transparent px-6 xl:block",
						className,
					)}
				>
					<div className="relative flex flex-col">
						<div className="mt-4 flex flex-col items-center justify-center">
							<div className="mb-2 flex w-full items-center justify-between">
								<span className="text-sm text-muted-foreground">Guide progress</span>
								<span className="text-xs font-medium">{progress}%</span>
							</div>
							<Progress value={progress} className="h-1 w-full" />
						</div>
						<div className="flex items-center justify-between border-t py-2">
							<Tooltip>
								<TooltipTrigger
									render={<Button variant="ghost" size="sm" />}
									onClick={() => setIsExpanded(!isExpanded)}
									aria-label={
										isExpanded ? "Collapse table of contents" : "Expand table of contents"
									}
									className="w-full justify-between hover:dark:bg-input/30"
								>
									<h3 className="text-sm font-medium text-muted-foreground">CURRENT SECTION</h3>
									{isExpanded ? (
										<ChevronUp className="size-4" />
									) : (
										<ChevronDown className="size-4" />
									)}
								</TooltipTrigger>
								<TooltipContent
									sideOffset={5}
									className="z-999 flex items-center justify-center gap-2"
								>
									<Shortcut shortcut="Alt+C" size="sm" variant="ghost" />
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
							scrollFade
							className={cn("grid max-h-[50vh] grid-rows-[1fr] gap-1 transition-all duration-300", {
								"animate-toc-expand grid-rows-[0fr] pb-0": !isExpanded,
							})}
						>
							<ul
								className={cn("flex flex-col gap-3 py-4 text-sm font-semibold text-foreground/90", {
									"border-none": !isExpanded,
								})}
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
										<CustomLink hash={heading.id}>{heading.text}</CustomLink>
									</li>
								))}
							</ul>
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
			) : (
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
