"use client"
import type { Heading } from "@/components/TableOfContents/TableOfContents"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronsRight } from "lucide-react"

interface MobileTableOfContentsProps {
  headings: Heading[]
  activeHeading: string
  currentHeading: Heading | undefined
}

export default function MobileTableOfContents({ headings, activeHeading, currentHeading }: MobileTableOfContentsProps) {
  return (
    <div className="block xl:hidden sticky top-16 z-40 p-3 border-b bg-background/90 backdrop-blur-xs supports-backdrop-filter:backdrop-blur-xs w-full">
      <Sheet>
        <SheetTrigger className="flex gap-1 items-center">
          <ChevronsRight className="size-5" />
          <h3 className="font-bold">{ currentHeading?.text || "Introduction" }</h3>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col items-center gap-4 z-100">
          <SheetHeader>
            <SheetTitle>On this page</SheetTitle>
            <SheetDescription className="sr-only">Table of contents for this page</SheetDescription>
          </SheetHeader>
          <ScrollArea className="max-h-[85dvh] overflow-hidden px-4 border-t py-4">
            <nav className="flex flex-col gap-4">
              <ul className="flex flex-col gap-3 text-foreground/90 font-medium text-sm max-h-full">
                { headings.map(heading => (
                  <li 
                    key={ `mobile-toc-${heading.id}` }
                    className={cn("hover:text-primary w-fit transition-colors", 
                      { 'pl-3 text-foreground/70 font-medium': heading.type === 'heading-3',
                        'pl-6 text-foreground/50 font-normal': heading.type === 'heading-4',
                        'text-primary': activeHeading === heading.id,
                      })}
                  >
                    <SheetClose asChild>
                      <Link href={ `#${heading.id}` }>
                        { heading.text }
                      </Link>
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
