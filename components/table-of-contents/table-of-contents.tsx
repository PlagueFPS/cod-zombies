"use client"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTableOfContents } from "@/hooks/use-table-of-contents"
import { cn } from "@/lib/utils"
import BackToTopButton from "../back-to-top-button/back-to-top-button"
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
	const [isExpanded, setIsExpanded] = useLocalStorage("toc-expanded", true)
	const isMobile = useIsMobile(1280)

	return (
		<>
			{isMobile ? (
				<>
					<MobileTableOfContents
						headings={headings}
						activeHeading={activeHeading}
						currentHeading={currentHeading}
						progress={progress}
					/>
					<BackToTopButton mobile variant={"default"} className="right-4 bottom-8" />
				</>
			) : (
				<aside className="sticky top-20 z-40 ml-4 h-fit w-85 shrink-0 rounded-lg border px-6 shadow-md dark:shadow-none">
					<div className="relative flex flex-col gap-4 pt-0">
						<div className="mt-4 flex flex-col items-center justify-center">
							<div className="mb-2 flex w-full items-center justify-between">
								<span className="text-muted-foreground text-sm">Guide progress</span>
								<span className="font-medium text-xs">{progress}%</span>
							</div>
							<Progress value={progress} className="h-1" />
						</div>
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
							className={cn(
								"grid max-h-[60vh] grid-rows-[0fr] gap-1 overflow-hidden transition-all duration-300",
								{
									"animate-toc-expand grid-rows-[1fr] pb-12": isExpanded,
								},
							)}
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
											"pl-3 font-medium text-foreground/80": heading.type === "heading-3",
											"pl-6 font-normal text-foreground/60": heading.type === "heading-4",
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
						<div className="sticky bottom-0 flex w-full items-center justify-center border-t bg-background py-4">
							<BackToTopButton className="mt-4" variant={"outline"} />
						</div>
					</div>
				</aside>
			)}
		</>
	)
}
