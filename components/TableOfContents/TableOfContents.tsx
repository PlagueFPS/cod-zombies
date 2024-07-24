"use client"
import { Headings } from "@/types/Headings"
import Link from "next/link"
import BackToTopButton from "../BackToTopButton/BackToTopButton"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  headings: Headings[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
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

  return (
    <nav className="flex flex-col gap-4">
      <div className="font-bold">On this page</div>
      <ul className="flex flex-col gap-3 text-foreground/90 font-medium text-sm">
        { headings.map(heading => (
          <li 
            key={ heading.id } 
            className={cn("hover:text-primary w-fit transition-all", 
              { 'pl-4 text-muted-foreground': heading.type === 'heading-3',
                'text-primary': activeSection === heading.id,
              })}
          >
            <Link href={ `#${heading.id}` }>
              { heading.text }
            </Link>
          </li>
        ))}
      </ul>
      <BackToTopButton size="sm" variant="outline" />
    </nav>
  )
}
