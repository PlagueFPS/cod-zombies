"use client"
import { useTableOfContents } from "@/hooks/useTableOfContents"
import { Heading } from "@/types/Heading"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import MobileTableOfContents from "./MobileTableOfContents"
import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Progress } from "../ui/progress"

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const { activeHeading, currentHeading, progress } = useTableOfContents(headings, "body")
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <aside className='hidden xl:block sticky top-24 ml-4 z-40 shrink-0 w-85 h-fit border rounded-lg px-6 shadow-md dark:shadow-none'>
        <div className="flex flex-col gap-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">CURRENT SECTION</h3>
            <Button 
              variant={"ghost"} 
              size={"sm"} 
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={ isExpanded ? "Collapse table of contents" : "Expand table of contents" }
              >
              { isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" /> }
            </Button>
          </div>
          <div>
            <Button
              variant={"ghost"}
              className="w-full justify-start font-medium rounded-sm bg-accent dark:bg-accent/50"
              onClick={() => setIsExpanded(!isExpanded)}
              >
                { currentHeading?.text || "Introduction" }
            </Button>
          </div>
          <ScrollArea className={cn("max-h-[60vh] overflow-hidden grid gap-1 transition-all duration-300 grid-rows-[0fr]", { 'grid-rows-[1fr]': isExpanded })}>
            <ul className={cn("flex flex-col gap-3 text-foreground/90 font-semibold text-sm overflow-hidden border-t py-4 pl-1", { 'border-none': !isExpanded })}>
              { headings.map(heading => (
                <li 
                  key={ `desktop-toc-${heading.id}` }
                  className={cn("hover:text-primary w-fit transition-colors", 
                    { 'pl-3 text-foreground/70 font-medium': heading.type === 'heading-3',
                      'pl-6 text-foreground/50 font-normal': heading.type === 'heading-4',
                      'text-primary': activeHeading === heading.id,
                    })}
                >
                  <Link href={ `#${heading.id}` } onNavigate={ () => setIsExpanded(false) }>
                    { heading.text }
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
        <div className="mt-4 py-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Guide progress</span>
            <span className="text-xs font-medium">{ progress }%</span>
          </div>
          <Progress value={ progress } className="h-1" />
        </div>
      </aside>
    <MobileTableOfContents headings={ headings } activeHeading={ activeHeading } currentHeading={ currentHeading } />
   </>
  )
}