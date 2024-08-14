"use client"
import { useScreen } from "@/hooks/useScreen"
import { useTableOfContents } from "@/hooks/useTableOfContents"
import type { Heading } from "@/types/Heading"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

interface MobileTableOfContentsProps {
  headings: Heading[]
}

export default function MobileTableOfContents({ headings }: MobileTableOfContentsProps) {
  const { activeHeading } = useTableOfContents(headings)
  const { isDesktop } = useScreen()
  
  return (
    <>
      { !isDesktop ? (
        <div className="sticky top-20 z-30 p-3 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
          <Sheet>
            <SheetTrigger className="flex gap-2 items-center">
              <Menu className="h-5 w-5" />
              <div className="font-bold">On this page</div>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-4">
              <SheetHeader className="border-b pb-3">
                <SheetTitle>On this page</SheetTitle>
                <SheetDescription className="sr-only">Table of contents for this page</SheetDescription>
              </SheetHeader>
              <ScrollArea>
                <nav className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-3 text-foreground/90 font-medium text-sm max-h-full">
                    { headings.map(heading => (
                      <li 
                        key={ heading.id } 
                        className={cn("hover:text-primary w-fit transition-all", 
                          { 'pl-4 text-muted-foreground': heading.type === 'heading-3',
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
      ) : null}
    </>
  )
}
