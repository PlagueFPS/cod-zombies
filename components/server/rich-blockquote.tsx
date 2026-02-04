import { Info } from "lucide-react"

interface BlockquoteProps {
	children: React.ReactNode
}

export function RichBlockquote({ children }: BlockquoteProps) {
	return (
		<blockquote className="mt-6 rounded-lg border border-orange-200 bg-orange-100/20 p-4 shadow-lg dark:border-orange-800 dark:bg-orange-900/20">
			<div className="flex items-start text-orange-700 dark:text-orange-300">
				<Info className="mr-2 h-5 w-5 shrink-0 text-orange-800 dark:text-orange-400" />
				<em>{children}</em>
			</div>
		</blockquote>
	)
}
