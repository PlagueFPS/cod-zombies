import { Skeleton } from "../ui/skeleton"
import { TableCell } from "../ui/table"

export default function RichTableCellLoader({ rowAmount }: { rowAmount: number }) {
	return Array.from({ length: rowAmount }, (_, index) => (
		<TableCell key={`table-cell-loader-${index + 1}`}>
			<Skeleton className="h-7 w-full" />
		</TableCell>
	))
}
