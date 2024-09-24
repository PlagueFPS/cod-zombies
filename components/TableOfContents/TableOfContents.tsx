"use client"
import { useTableOfContents } from "@/hooks/useTableOfContents"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { Heading } from "@/types/Heading"
import Link from "next/link"
import BackToTopButton from "../BackToTopButton/BackToTopButton"
import { cn } from "@/lib/utils"
import { ScrollArea } from "../ui/scroll-area"
import MobileTableOfContents from "./MobileTableOfContents"

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const { activeHeading, scrollAreaRef, setHeadingRef } = useTableOfContents(headings)
  const { isDesktop } = useMediaQuery()

  return (
    <>
      { isDesktop ? (
        <aside className='sticky top-4 ml-4 z-40 flex-shrink-0 w-[340px] h-fit border rounded-lg px-6'>
          <nav className="flex flex-col gap-4 border-b pb-3">
            <div className="font-bold mx-auto mt-4">On this page</div>
            <ScrollArea ref={ scrollAreaRef } className="h-[70vh]">
              <ul className="flex flex-col gap-3 text-foreground/90 font-semibold text-sm">
                { headings.map(heading => (
                  <li 
                    key={ heading.id }
                    className={cn("hover:text-primary w-fit transition-colors", 
                      { 'pl-3 text-foreground/70 font-medium': heading.type === 'heading-3',
                        'pl-6 text-muted-foreground font-normal': heading.type === 'heading-4',
                        'text-primary': activeHeading === heading.id,
                      })}
                  >
                    <Link ref={ setHeadingRef(heading.id) } href={ `#${heading.id}` }>
                      { heading.text }
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </nav>
          <BackToTopButton type="button" size="sm" variant="outline" className="my-4" />
        </aside>
      ) : <MobileTableOfContents headings={ headings } activeHeading={ activeHeading } /> }
    </>
  )
}