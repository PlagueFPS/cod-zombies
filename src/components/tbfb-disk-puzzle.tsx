import { cn } from "cn"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
	getTbfbDiskSymbol,
	solveTbfbDiskPuzzle,
	TBFB_DISK_SYMBOLS,
	type TbfbDiskPathMatch,
	type TbfbDiskSymbolId,
} from "@/data/tbfb-disk-puzzle"

const DISK_SELECTION_SIZE = 4

const NO_MATCH_MESSAGE =
	"Double-check the symbols on your disks. No path contains all four of them."

const SEVERAL_ORDERS_MESSAGE =
	"These symbols match more than one order. A symbol may have been misread."

export default function TbfbDiskPuzzle() {
	const [selected, setSelected] = useState<TbfbDiskSymbolId[]>([])
	const orders = distinctInsertionOrders(solveTbfbDiskPuzzle(selected))
	const selectionIsFull = selected.length === DISK_SELECTION_SIZE

	const toggleSymbol = (symbolId: TbfbDiskSymbolId) => {
		setSelected(current => {
			if (current.includes(symbolId)) {
				return current.filter(id => id !== symbolId)
			}

			if (current.length === DISK_SELECTION_SIZE) return current

			return [...current, symbolId]
		})
	}

	return (
		<Card className="mx-auto w-full max-w-xl bg-transparent shadow-lg dark:shadow-none">
			<CardHeader className="items-center justify-items-center text-center">
				<CardTitle className="text-xl">Floppy Disk Order</CardTitle>
				<CardDescription>
					Select the four symbols on your disks. Matching paths are listed in left-to-right
					insertion order.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="mx-auto w-fit rounded-2xl bg-zinc-900 p-3">
					<div className="grid grid-cols-4 gap-2" role="group" aria-label="Disk symbols">
						{TBFB_DISK_SYMBOLS.map(symbol => {
							const isSelected = selected.includes(symbol.id)
							const isLocked = selectionIsFull && !isSelected

							return (
								<button
									key={symbol.id}
									type="button"
									aria-pressed={isSelected}
									aria-disabled={isLocked}
									aria-label={symbol.label}
									onClick={() => {
										if (isLocked) return

										toggleSymbol(symbol.id)
									}}
									className={cn(
										"flex size-16 items-center justify-center rounded-xl bg-white text-black ring-2 ring-transparent transition outline-none focus-visible:ring-ring sm:size-20",
										isSelected && "ring-amber-400",
										isLocked && "opacity-40",
									)}
								>
									<symbol.Icon className="size-12 sm:size-14" />
								</button>
							)
						})}
					</div>
				</div>

				<div className="flex justify-center">
					<Button
						type="button"
						variant="destructive"
						size="lg"
						onClick={() => setSelected([])}
						disabled={selected.length === 0}
					>
						Reset
					</Button>
				</div>

				{selectionIsFull ? (
					<div className="space-y-3 rounded-sm bg-input p-3 dark:bg-input/20">
						{orders.length === 0 ? (
							<p className="text-center text-sm">{NO_MATCH_MESSAGE}</p>
						) : (
							<>
								<p className="text-center text-sm">
									{orders.length === 1
										? "Insert the disks from left to right."
										: SEVERAL_ORDERS_MESSAGE}
								</p>
								<ul className="space-y-3">
									{orders.map(order => (
										<li key={order.join(":")}>
											<div className="flex items-center justify-center gap-2">
												{order.map(symbolId => {
													const symbol = getTbfbDiskSymbol(symbolId)

													return (
														<div
															key={symbolId}
															className="flex size-12 items-center justify-center rounded-lg bg-white text-black"
															title={symbol.label}
														>
															<symbol.Icon className="size-9" />
															<span className="sr-only">{symbol.label}</span>
														</div>
													)
												})}
											</div>
										</li>
									))}
								</ul>
							</>
						)}
					</div>
				) : null}
			</CardContent>
		</Card>
	)
}

function distinctInsertionOrders(
	matches: readonly TbfbDiskPathMatch[],
): readonly (readonly TbfbDiskSymbolId[])[] {
	const orders: TbfbDiskSymbolId[][] = []

	for (const match of matches) {
		const listed = orders.some(
			order =>
				order.length === match.order.length &&
				order.every((symbolId, index) => symbolId === match.order[index]),
		)

		if (listed) continue

		orders.push([...match.order])
	}

	return orders
}
