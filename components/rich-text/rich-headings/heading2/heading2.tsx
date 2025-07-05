import type { DetailedHTMLProps, HTMLAttributes } from "react"
import Link from "next/link"
import LinkSVG from "@/components/SVGs/LinkSVG"

export default function Heading2({
	id,
	children,
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
	return (
		<h2 id={id} className="mt-8 mb-4 scroll-m-36 font-extrabold text-2xl md:text-3xl lg:text-4xl xl:mt-16">
			<Link
				href={`#${id}`}
				className="group flex w-fit items-center justify-center gap-4 transition-all hover:text-primary"
			>
				{children}
				<span className="hidden text-primary group-hover:block">
					<LinkSVG className="h-5 w-5" />
				</span>
			</Link>
		</h2>
	)
}
