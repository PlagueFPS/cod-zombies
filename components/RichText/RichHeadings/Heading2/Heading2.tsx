"use client"
import LinkSVG from "@/SVGs/LinkSVG"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { DetailedHTMLProps, HTMLAttributes } from "react"

interface Heading2Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  children: string[]
}

export default function Heading2({ id, children }: Heading2Props) {
  const pathname = usePathname()

  return (
    <h2 id={ id } className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold scroll-m-16 mt-16 mb-4">
      <Link 
        href={ `${process.env.NEXT_PUBLIC_WEBSITE_URL}${pathname}#${id}` } 
        className="flex gap-4 justify-center items-center w-fit hover:text-primary transition-all group"
      >
          { children }
        <span className="hidden group-hover:block text-primary">
          <LinkSVG className="h-5 w-5" />
        </span>
      </Link>
    </h2>
  )
}
