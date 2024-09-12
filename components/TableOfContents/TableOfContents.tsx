"use client"
import { useTableOfContents } from "@/hooks/useTableOfContents"
import { useScreen }from "@/hooks/useScreen"
import { useEffect, useRef } from "react"
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
  const { activeHeading } = useTableOfContents(headings)
  const { isDesktop } = useScreen()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const headingRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    if (activeHeading && scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement
      const activeItem = headingRefs.current.get(activeHeading)

      if (scrollViewport && activeItem) {
        const scrollRect = scrollViewport.getBoundingClientRect()
        const itemRect = activeItem.getBoundingClientRect()

        if (itemRect.top < scrollRect.top || itemRect.bottom > scrollRect.bottom) {
          const itemTop = activeItem.offsetTop - scrollViewport.offsetTop
          const targetScrollTop = itemRect.top < scrollRect.top
            ? itemTop // Scroll up
            : itemTop - scrollRect.height + itemRect.height // Scroll down

          scrollViewport.style.scrollBehavior = 'smooth'
          scrollViewport.scrollTop = targetScrollTop
          timeoutId = setTimeout(() => {
            scrollViewport.style.scrollBehavior = 'auto'
          }, 1000)
        }
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [activeHeading])

  const setHeadingRef = (id: string) => (el: HTMLAnchorElement | null) => {
    if (el) {
      headingRefs.current.set(id, el)
    } else {
      headingRefs.current.delete(id)
    }
  }

  return (
    <>
      { isDesktop ? (
        <aside className='sticky top-4 ml-4 flex-shrink-0 w-[340px] h-fit border rounded-lg px-6'>
          <nav className="flex flex-col gap-4 border-b pb-3">
            <div className="font-bold mx-auto mt-4">On this page</div>
            <ScrollArea ref={ scrollAreaRef } className="h-[70vh]">
              <ul className="flex flex-col gap-3 text-foreground/90 font-semibold text-sm">
                { headings.map(heading => (
                  <li 
                    key={ heading.id }
                    className={cn("hover:text-primary w-fit transition-all", 
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