import type { Heading } from "@/types/Heading"
import { useEffect, useRef, useState } from "react"
/**
 * 
 * @returns `activeHeading` - the current heading of the section within view
 */
export const useTableOfContents = (headings: Heading[]) => {
  const [activeHeading, setActiveHeading] = useState('')

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

  return { activeHeading }
}
