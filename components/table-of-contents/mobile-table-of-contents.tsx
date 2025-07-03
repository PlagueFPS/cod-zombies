"use client"
import type { Heading } from "@/components/table-of-contents/table-of-contents"
import { ChevronsRight, PanelLeftClose } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"
import { ScrollArea } from "../ui/scroll-area"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"

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
	return (
		<div className="sticky top-16 z-40 block w-full border-b bg-background/90 p-3 backdrop-blur-xs supports-backdrop-filter:backdrop-blur-xs">
			<Sheet>
				<SheetTrigger className="flex flex-col items-center">
					<div className="flex items-center gap-1">
						<ChevronsRight className="size-5" />
						<h3 className="font-bold">{currentHeading?.text || "Introduction"}</h3>
					</div>
					<Progress value={progress} className="absolute right-0 bottom-0 z-50 h-1 w-full" />
				</SheetTrigger>
				<SheetContent side="left" className="z-500 flex flex-col items-center gap-4">
					<SheetHeader className="relative h-fit w-full items-center justify-center p-0">
						<SheetTitle className="mt-4">On This Page</SheetTitle>
						<SheetDescription className="sr-only">Table of contents for this page</SheetDescription>
						<SheetClose asChild>
							<Button variant="ghost" size="icon" className="absolute top-2 right-2">
								<PanelLeftClose className="size-5" />
							</Button>
						</SheetClose>
					</SheetHeader>
					<ScrollArea className="max-h-[90dvh] overflow-hidden border-t px-4 py-4">
						<nav className="flex flex-col gap-4">
							<ul className="flex max-h-full flex-col gap-3 font-medium text-foreground/90 text-sm">
								{headings.map(heading => (
									<li
										key={`mobile-toc-${heading.id}`}
										className={cn("w-fit transition-colors hover:text-primary", {
											"pl-3 font-medium text-foreground/70": heading.type === "heading-3",
											"pl-6 font-normal text-foreground/50": heading.type === "heading-4",
											"text-primary": activeHeading === heading.id,
										})}
									>
										<SheetClose asChild>
											<Link href={`#${heading.id}`}>{heading.text}</Link>
										</SheetClose>
									</li>
								))}
							</ul>
						</nav>
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	)
}
