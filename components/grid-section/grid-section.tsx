import { cn } from "@/lib/utils"

interface MapSectionProps {
	title: string
	children: React.ReactNode
	className?: string
}

export default function GridSection({ title, children, className }: MapSectionProps) {
	return (
		<section className={cn("flex w-full flex-col justify-center gap-8", className)}>
			<h2 className="dark:dark-text-gradient font-extrabold text-5xl text-gradient tracking-tight lg:text-6xl">
				{title}
			</h2>
			{children}
		</section>
	)
}
