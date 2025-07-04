import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { formatTableCellData } from "@/utils/contentful-utils"
import { slugify } from "@/utils/functions"
import ItemTooltip from "../rich-embeds/item-tooltip"

interface RichTableProps {
	headings: string[]
	bodyRows: unknown[]
}

export default function RichTable({ headings, bodyRows }: RichTableProps) {
	return (
		<div className="my-8 overflow-x-auto rounded-lg border shadow-xl dark:shadow-none">
			<Table>
				<TableHeader className="rounded-t-xl dark:border-orange-700">
					<TableRow>
						{headings.map(heading => (
							<TableHead key={`table-heading-${slugify(heading)}`} className="text-orange-900 dark:text-orange-500">
								{heading}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{bodyRows.map((row, index) => (
						<TableRow
							key={`table-row-${index + 1}`}
							className={cn("hover:bg-orange-100 dark:hover:bg-muted/50", {
								"bg-orange-50 dark:bg-background": index % 2 === 0,
							})}
						>
							{Array.isArray(row) &&
								row.map((cell: any, cellIndex: number) => {
									const { values, badgeItems, embeddedItems } = formatTableCellData(cell.content[0].content)

									return (
										<TableCell key={`table-cell-${cellIndex + 1}`} className="text-orange-800 dark:text-orange-200">
											{values.map(value => {
												if (value) return value
                        return null
											})}
											{badgeItems.length > 0 && (
												<span className="inline-flex flex-col items-start gap-2">
													{badgeItems.map((item, index) => {
														if (item)
															return (
																<Badge
																	key={`table-cell-badge-${index + 1}`}
																	className="badge-primary-gradient dark:dark-badge-primary-gradient"
																	variant={"outline"}
																>
																	{item}
																</Badge>
															)
															return null
														})}
												</span>
											)}
											{embeddedItems.length > 0 && (
												<span className="inline-flex flex-col items-start gap-2">
													{embeddedItems.map((item, index) => (
														<ItemTooltip key={`${item.title}-${index}`} item={item} />
													))}
												</span>
											)}
										</TableCell>
									)
								})}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
