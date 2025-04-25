import type { DetailedHTMLProps, HTMLAttributes } from "react"
import Link from "next/link"
import LinkSVG from "@/SVGs/LinkSVG"
import { cn } from "@/lib/utils"

interface Heading2Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {}

export default function Heading3({ id, className, children }: Heading2Props) {
  return (
    <h3 id={ id } className={cn("text-xl md:text-2xl lg:text-3xl font-bold scroll-m-36 md:scroll-m-8", className)}>
      <Link 
        href={ `#${id}` } 
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
