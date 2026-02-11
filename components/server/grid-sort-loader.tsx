import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GridSortLoader() {
	return (
		<Select>
			<SelectTrigger className="w-full sm:w-72" disabled aria-disabled>
				<SelectValue placeholder="Sort by" />
			</SelectTrigger>
		</Select>
	)
}
