"use client"
import { Headings } from "@/types/Headings"
import Link from "next/link"
import BackToTopButton from "../BackToTopButton/BackToTopButton"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useScreen }from "@/hooks/useScreen"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"

interface TableOfContentsProps {
  headings: Headings[]
}

interface MobileTableOfContentsProps extends TableOfContentsProps {
  activeSection: string
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState('')
  const { isDesktop } = useScreen()

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
    <>
      { isDesktop ? (
        <aside className="sticky top-4 h-full">
          <nav className="flex flex-col gap-4">
            <div className="font-bold">On this page</div>
            <ScrollArea>
              <ul className="flex flex-col gap-3 text-foreground/90 font-medium text-sm max-h-[70vh]">
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
            </ScrollArea>
            <BackToTopButton type="button" size="sm" variant="outline" />
          </nav>
        </aside>
      ) : (
        <MobileTableOfContents headings={ headings } activeSection={ activeSection } />
      )}
    </>
  )
}


const MobileTableOfContents = ({ headings, activeSection }: MobileTableOfContentsProps) => {
  return (
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
                        'text-primary': activeSection === heading.id,
                      })}
                  >
                    <Link href={ `#${heading.id}` }>
                      { heading.text }
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
