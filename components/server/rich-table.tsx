import { Fragment } from "react"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface RichTableProps {
	headerCells: React.ReactNode[]
	bodyRows: React.ReactNode[]
}

export function RichTable({ headerCells, bodyRows }: RichTableProps) {
	return (
		<div className="my-8 overflow-x-auto rounded-lg border shadow-xl dark:shadow-none">
			<Table>
				<TableHeader className="rounded-t-xl dark:border-orange-700">
					<TableRow>
						{headerCells.map((cell, index) => (
							<TableHead
								key={`table-header-${index + 1}`}
								className="text-orange-900 dark:text-orange-400"
							>
								{cell}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{bodyRows.map((row, index) => (
						<Fragment key={`table-body-row-${index + 1}`}>{row}</Fragment>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export function RichBodyRow({
	children,
	alternate,
}: {
	children: React.ReactNode
	alternate?: boolean
}) {
	return (
		<TableRow
			className={cn(
				"text-orange-800 hover:bg-orange-100 dark:text-orange-200 dark:hover:bg-muted/50",
				{
					"bg-orange-50 dark:bg-muted/10": alternate,
				},
			)}
		>
			{children}
		</TableRow>
	)
}
