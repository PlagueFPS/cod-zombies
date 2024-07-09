import type { DetailedHTMLProps, HTMLAttributes } from "react"

interface Heading2Props extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  children: string[]
}

export default function Heading2({ id, children }: Heading2Props) {
  return (
    <h2 id={ id } className=" scroll-m-16 mt-16 mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold">{ children }</h2>
  )
}
