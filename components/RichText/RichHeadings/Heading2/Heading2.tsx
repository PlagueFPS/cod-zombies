import type { DetailedHTMLProps, HTMLAttributes } from "react"
import Link from "next/link"
import LinkSVG from "@/SVGs/LinkSVG"

interface Heading2Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {}

export default function Heading2({ id, children }: Heading2Props) {
  return (
    <h2 id={ id } className="text-2xl md:text-3xl lg:text-4xl font-extrabold scroll-m-36 mt-8 xl:mt-16 mb-4">
      <Link 
        href={ `#${id}` }
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
