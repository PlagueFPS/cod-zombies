"use client"
import type { Heading } from "@/types/Heading"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

interface MobileTableOfContentsProps {
  headings: Heading[]
  activeHeading: string
}

export default function MobileTableOfContents({ headings, activeHeading }: MobileTableOfContentsProps) {
  return (
    <div className="block xl:hidden sticky top-16 z-40 p-3 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
      <Sheet>
        <SheetTrigger className="flex gap-2 items-center">
          <Menu className="h-5 w-5" />
          <div className="font-bold">On this page</div>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col gap-4 z-[100]">
          <SheetHeader className="border-b pb-3">
            <SheetTitle>On this page</SheetTitle>
            <SheetDescription className="sr-only">Table of contents for this page</SheetDescription>
          </SheetHeader>
          <ScrollArea>
            <nav className="flex flex-col gap-4">
              <ul className="flex flex-col gap-3 text-foreground/90 font-medium text-sm max-h-full">
                { headings.map(heading => (
                  <li 
                    key={ `mobile-toc-${heading.id}` }
                    className={cn("hover:text-primary w-fit transition-colors", 
                      { 'pl-3 text-foreground/70 font-medium': heading.type === 'heading-3',
                        'pl-6 text-muted-foreground font-normal': heading.type === 'heading-4',
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
