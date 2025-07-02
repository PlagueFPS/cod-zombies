"use client"
import type { Heading } from "@/components/table-of-contents/table-of-contents"
import { ChevronsRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"

interface MobileTableOfContentsProps {
	headings: Heading[]
	activeHeading: string
	currentHeading: Heading | undefined
}

export default function MobileTableOfContents({ headings, activeHeading, currentHeading }: MobileTableOfContentsProps) {
	return (
		<div className="sticky top-16 z-40 block w-full border-b bg-background/90 p-3 backdrop-blur-xs supports-backdrop-filter:backdrop-blur-xs xl:hidden">
			<Sheet>
				<SheetTrigger className="flex items-center gap-1">
					<ChevronsRight className="size-5" />
					<h3 className="font-bold">{currentHeading?.text || "Introduction"}</h3>
				</SheetTrigger>
				<SheetContent side="left" className="z-100 flex flex-col items-center gap-4">
					<SheetHeader>
						<SheetTitle>On this page</SheetTitle>
						<SheetDescription className="sr-only">Table of contents for this page</SheetDescription>
					</SheetHeader>
					<ScrollArea className="max-h-[85dvh] overflow-hidden border-t px-4 py-4">
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
