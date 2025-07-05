import type { DetailedHTMLProps, HTMLAttributes } from "react"
import Link from "next/link"
import LinkSVG from "@/components/SVGs/LinkSVG"
import { cn } from "@/lib/utils"

export default function Heading3({
	id,
	className,
	children,
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
	return (
		<h3
			id={id}
			className={cn("mt-8 mb-4 scroll-m-36 font-bold text-xl md:text-2xl lg:text-3xl", className)}
		>
			<Link
				href={`#${id}`}
				className="group flex w-fit items-center justify-center gap-4 transition-all hover:text-primary"
			>
				{children}
				<span className="hidden text-primary transition-all group-hover:block">
					<LinkSVG className="h-4 w-4" />
				</span>
			</Link>
		</h3>
	)
}
