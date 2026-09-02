import { cn } from "cn"
import { type DetailedHTMLProps, type HTMLAttributes } from "react"

interface CopyrightProps extends DetailedHTMLProps<
	HTMLAttributes<HTMLParagraphElement>,
	HTMLParagraphElement
> {
	className?: string
}

export default function Copyright({ className }: CopyrightProps) {
	const year = new Date().getFullYear()

	return (
		<div
			className={cn(
				"flex flex-col gap-1.5 border-t py-4 text-xs text-muted-foreground md:border-none md:py-0",
				className,
			)}
		>
			<p>&copy; {year} Call of Duty: Zombies Guides</p>
			<p className="md:pr-12">
				This website is an independent, unofficial Call of Duty: Zombies fan site. It is not
				affiliated with or endorsed by Activision Blizzard. All trademarks, service marks, trade
				names, trade dress, product names, and logos appearing on this site are the property of
				their respective owners.
			</p>
		</div>
	)
}
