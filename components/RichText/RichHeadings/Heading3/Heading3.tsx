"use client"
import LinkSVG from "@/SVGs/LinkSVG"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { DetailedHTMLProps, HTMLAttributes } from "react"

interface Heading2Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  children: string[]
}

export default function Heading3({ id, children }: Heading2Props) {
  const pathname = usePathname()

  return (
    <h3 id={ id } className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold scroll-m-8">
      <Link 
        href={ `${process.env.NEXT_PUBLIC_WEBSITE_URL}${pathname}#${id}` } 
        className="flex gap-4 justify-center items-center w-fit hover:text-primary transition-all group"
      >
          { children }
        <span className="hidden group-hover:block text-primary transition-all">
          <LinkSVG className="h-4 w-4" />
        </span>
      </Link>
    </h3>
  )
}
