import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react"
import { cn } from "cn"
import { CustomLink } from "@/components/custom-link"
import LinkSVG from "@/components/link-svg"

type HeadingProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>

function HeadingLink({
	id,
	iconClassName,
	children,
}: {
	id: string | undefined
	iconClassName: string
	children: ReactNode
}) {
	return (
		<CustomLink
			hash={id}
			className="group flex w-fit items-center justify-center gap-4 transition-all hover:text-primary"
		>
			<span>{children}</span>
			<span className="hidden shrink-0 text-primary transition-all group-hover:block">
				<LinkSVG className={iconClassName} />
			</span>
		</CustomLink>
	)
}

export function Heading2({ id, className, children }: HeadingProps) {
	return (
		<h2
			id={id}
			className={cn(
				"mt-8 mb-4 scroll-m-36 text-2xl font-extrabold md:text-3xl lg:text-4xl xl:mt-16",
				className,
			)}
		>
			<HeadingLink id={id} iconClassName="h-5 w-5">
				{children}
			</HeadingLink>
		</h2>
	)
}

export function Heading3({ id, className, children }: HeadingProps) {
	return (
		<h3
			id={id}
			className={cn("mt-8 mb-4 scroll-m-36 text-xl font-bold md:text-2xl lg:text-3xl", className)}
		>
			<HeadingLink id={id} iconClassName="h-4 w-4">
				{children}
			</HeadingLink>
		</h3>
	)
}

export function Heading4({ id, className, children }: HeadingProps) {
	return (
		<h4
			id={id}
			className={cn("my-4 scroll-m-36 text-lg font-semibold md:text-xl lg:text-2xl", className)}
		>
			<HeadingLink id={id} iconClassName="h-4 w-4">
				{children}
			</HeadingLink>
		</h4>
	)
}
