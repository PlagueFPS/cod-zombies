import type { Route } from "next"
import { ArrowRightIcon } from "lucide-react"
import { CustomLink } from "@/components/client/custom-link"
import { cn } from "@/lib/utils"

interface MapSectionProps {
	title: string
	children: React.ReactNode
	className?: string
	/** When set, shows a "View all" link with arrow in the top right of the section header */
	viewAllHref?: Route
	mobileTitleSize?: "sm" | "md" | "lg"
}

export function GridSection({ title, children, className, viewAllHref, mobileTitleSize = "lg" }: MapSectionProps) {
	return (
		<section className={cn("flex w-full flex-col justify-center gap-8", className)}>
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h2 className={cn("dark:dark-text-gradient font-extrabold text-3xl text-gradient tracking-tight lg:text-6xl", {
					"text-xl": mobileTitleSize === "sm",
					"text-2xl": mobileTitleSize === "md",
					"text-3xl": mobileTitleSize === "lg",
				})}>
					{title}
				</h2>
				{viewAllHref ? (
					<CustomLink
						href={viewAllHref}
						className="group inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-primary"
					>
						View All
						<ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
					</CustomLink>
				) : null}
			</div>
			{children}
		</section>
	)
}
