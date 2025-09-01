import type { SerializedTableCellNode, SerializedTableRowNode } from "@payloadcms/richtext-lexical"
import type { SerializedLexicalNode } from "@payloadcms/richtext-lexical/lexical"
import type {
	JSXConverters,
	SerializedLexicalNodeWithParent,
} from "@payloadcms/richtext-lexical/react"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RichTableProps {
	headerRow: SerializedTableRowNode
	bodyRows: SerializedTableRowNode[]
	nodesToJSX: (args: {
		converters?: JSXConverters
		disableIndent?: boolean | string[]
		disableTextAlign?: boolean | string[]
		nodes: SerializedLexicalNode[]
		parent?: SerializedLexicalNodeWithParent
	}) => React.ReactNode[]
}

export default function RichTable({ headerRow, bodyRows, nodesToJSX }: RichTableProps) {
	return (
		<div className="my-8 overflow-x-auto rounded-lg border shadow-xl dark:shadow-none">
			<Table>
				<TableHeader className="rounded-t-xl dark:border-orange-700">
					<TableRow>
						{headerRow.children.map((cell, index) => {
							if (cell.type === "tablecell") {
								const node = cell as SerializedTableCellNode
								return (
									<TableHead
										key={`table-header-${index + 1}`}
										className="text-orange-900 dark:text-orange-400"
									>
										{nodesToJSX({ nodes: node.children })}
									</TableHead>
								)
							}
							return null
						})}
					</TableRow>
				</TableHeader>
				<TableBody>
					{bodyRows.map((row, index) => (
						<TableRow key={`table-row-${index + 1}`}>
							{nodesToJSX({ nodes: row.children })}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
