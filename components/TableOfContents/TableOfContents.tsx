"use client"
import { Heading } from "@/types/Heading"
import Link from "next/link"
import BackToTopButton from "../BackToTopButton/BackToTopButton"
import { cn } from "@/lib/utils"
import { useTableOfContents } from "@/hooks/useTableOfContents"
import { useScreen }from "@/hooks/useScreen"
import { ScrollArea } from "../ui/scroll-area"
import MobileTableOfContents from "./MobileTableOfContents"

interface TableOfContentsProps {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const { activeHeading } = useTableOfContents(headings)
  const { isDesktop } = useScreen()

  return (
    <>
      { isDesktop ? (
        <aside className="sticky top-4 h-fit">
          <nav className="flex flex-col gap-4">
            <div className="font-bold">On this page</div>
            <ScrollArea>
              <ul className="flex flex-col gap-3 text-foreground/90 font-medium text-sm max-h-[70vh]">
                { headings.map(heading => (
                  <li 
                    key={ heading.id } 
                    className={cn("hover:text-primary w-fit transition-all", 
                      { 'pl-4 text-muted-foreground': heading.type === 'heading-3',
                        'text-primary': activeHeading === heading.id,
                      })}
                  >
                    <Link href={ `#${heading.id}` }>
                      { heading.text }
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </nav>
          <BackToTopButton type="button" size="sm" variant="outline" className="mt-4" />
        </aside>
      ) : <MobileTableOfContents headings={ headings } activeHeading={ activeHeading } /> }
    </>
  )
}