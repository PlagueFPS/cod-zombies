import type { DetailedHTMLProps, HTMLAttributes } from "react"
import { connection } from "next/server"
import { cn } from "@/lib/utils"

interface CopyrightProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
	className?: string
}

export default async function Copyright({ className }: CopyrightProps) {
	await connection()
	return (
		<div
			className={cn(
				"flex flex-col gap-1.5 border-t py-4 text-muted-foreground text-xs md:border-none md:py-0",
				className,
			)}
		>
			<p>&copy; {new Date().getFullYear()} Call of Duty: Zombies Guides</p>
			<p className="md:pr-12">
				This website is an independent, unofficial Call of Duty: Zombies fan site. It is not affiliated with or endorsed
				by Activision Blizzard. All trademarks, service marks, trade names, trade dress, product names, and logos
				appearing on this site are the property of their respective owners.
			</p>
		</div>
	)
}
