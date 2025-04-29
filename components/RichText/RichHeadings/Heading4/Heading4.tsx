import type { DetailedHTMLProps, HTMLAttributes } from "react"
import Link from "next/link"
import LinkSVG from "@/SVGs/LinkSVG"

interface Heading4Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {}

export default function Heading4({ id, children }: Heading4Props) {
  return (
    <h4 id={ id } className="text-lg md:text-xl lg:text-2xl font-semibold scroll-m-36 mb-4">
      <Link 
        href={ `#${id}` } 
        className="flex gap-4 justify-center items-center w-fit hover:text-primary transition-all group"
      >
          { children }
        <span className="hidden group-hover:block text-primary transition-all">
          <LinkSVG className="h-4 w-4" />
        </span>
      </Link>
    </h4>
  )
}
