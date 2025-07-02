import type { DetailedHTMLProps, HTMLAttributes } from "react"
import Link from "next/link"
import LinkSVG from "@/SVGs/LinkSVG"

export default function Heading4({
	id,
	children,
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
	return (
		<h4 id={id} className="my-4 scroll-m-36 font-semibold text-lg md:text-xl lg:text-2xl">
			<Link
				href={`#${id}`}
				className="group flex w-fit items-center justify-center gap-4 transition-all hover:text-primary"
			>
				{children}
				<span className="hidden text-primary transition-all group-hover:block">
					<LinkSVG className="h-4 w-4" />
				</span>
			</Link>
		</h4>
	)
}
