import type { Heading } from "@/types/Heading"
import { useEffect, useState } from "react"

export const useTableOfContents = (headings: Heading[]) => {
  const [activeHeading, setActiveHeading] = useState('')

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

    return () => {
      headings.forEach(heading => {
        const element = document.getElementById(heading.id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [headings])

  return { activeHeading }
}
