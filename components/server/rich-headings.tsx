import type { DetailedHTMLProps, HTMLAttributes } from "react"
import Link from "next/link"
import LinkSVG from "@/components/server/link-svg"
import { cn } from "@/lib/utils"

export function Heading2({
	id,
	children,
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
	return (
		<h2
			id={id}
			className="mt-8 mb-4 scroll-m-36 text-2xl font-extrabold md:text-3xl lg:text-4xl xl:mt-16"
		>
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

export function Heading3({
	id,
	className,
	children,
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
	return (
		<h3
			id={id}
			className={cn("mt-8 mb-4 scroll-m-36 text-xl font-bold md:text-2xl lg:text-3xl", className)}
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

export function Heading4({
	id,
	children,
}: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>) {
	return (
		<h4 id={id} className="my-4 scroll-m-36 text-lg font-semibold md:text-xl lg:text-2xl">
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
