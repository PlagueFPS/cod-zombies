import type { Heading } from "@/types/Heading"
import { useEffect, useRef, useState } from "react"
/**
 * 
 * @returns `activeHeading` - the current heading of the section within view
 * @returns `scrollAreaRef` - ref to pass into the `ScrollArea` component's `ref` attribute
 * @returns `setHeadingRef` - function to pass into the element rendering the heading text's `ref` attribute
 */
export const useTableOfContents = (headings: Heading[]) => {
  const [activeHeading, setActiveHeading] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const headingRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  // Effect for handling detecting the activeHeading
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveHeading(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px 0px -75% 0px',
      threshold: 0.75
    })

    headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })
    
    return () => observer.disconnect()
  }, [headings])

  /**
   * 
   * @param id the heading id
   */
  const setHeadingRef = (id: string) => (el: HTMLAnchorElement | null) => {
    if (el) {
      headingRefs.current.set(id, el)
    } else {
      headingRefs.current.delete(id)
    }
  }

  return { activeHeading, scrollAreaRef, setHeadingRef }
}
