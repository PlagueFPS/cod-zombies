"use client"
import type { Heading } from "@/types/Heading"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
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
    <Drawer direction="left">
      <div className="block xl:hidden sticky top-20 z-40 p-3 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
        <DrawerTrigger className="flex gap-2 items-center">
          <Menu className="h-5 w-5" />
          <div className="font-bold">On this page</div>
        </DrawerTrigger>
      </div>
    <DrawerContent className="flex flex-col gap-4 top-0 after:hidden inset-x-auto left-0 bottom-0 rounded-lg mt-0 w-[320px] ml-2 my-2">
      <DrawerHeader className="flex justify-center items-center border-b pb-3 px-3">
          <DrawerTitle>On this page</DrawerTitle>
          <DrawerDescription className="sr-only">Table of contents for this page</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="px-4 pb-8">
          <nav className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3 text-foreground/90 font-medium text-sm max-h-full">
              { headings.map(heading => (
                <li 
                  key={ heading.id } 
                  className={cn("hover:text-primary w-fit transition-colors", 
                    { 'pl-3 text-foreground/70 font-medium': heading.type === 'heading-3',
                      'pl-6 text-muted-foreground font-normal': heading.type === 'heading-4',
                      'text-primary': activeHeading === heading.id,
                    })}
                >
                  <DrawerClose asChild>
                    <Link href={ `#${heading.id}` }>
                      { heading.text }
                    </Link>
                  </DrawerClose>
                </li>
              ))}
            </ul>
          </nav>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}
