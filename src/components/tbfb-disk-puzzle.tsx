import { cn } from "cn"
import { Array as Arr } from "effect"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import { Fragment, useState } from "react"
import {
	SolverCard,
	SolverHeader,
	SolverResetButton,
	SolverResult,
} from "@/components/solver-primitives"
import { CardContent } from "@/components/ui/card"
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
				return Arr.filter(current, id => id !== symbolId)
			}

			if (current.length === DISK_SELECTION_SIZE) return current

			return [...current, symbolId]
		})
	}

	return (
		<SolverCard className="max-w-xl">
			<SolverHeader
				title="Floppy Disk Order"
				description="Select the four symbols on your disks. Matching paths are listed in left-to-right insertion order."
				badge={
					<span className="tabular-nums">
						{selected.length} / {DISK_SELECTION_SIZE} selected
					</span>
				}
			/>
			<CardContent className="space-y-4 px-5">
				<div className="mx-auto w-fit rounded-2xl border border-border/80 bg-zinc-950/90 p-3 shadow-inner">
					<div className="grid grid-cols-4 gap-2" role="group" aria-label="Disk symbols">
						{Arr.map(TBFB_DISK_SYMBOLS, symbol => {
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
										"relative flex size-16 items-center justify-center rounded-xl bg-white text-zinc-950 ring-2 ring-transparent transition-[transform,opacity,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:ring-ring sm:size-20",
										!isLocked && "hover:shadow-md active:scale-[0.96]",
										isSelected && "shadow-sm ring-primary",
										isLocked && "opacity-40",
									)}
								>
									<symbol.Icon className="size-11 sm:size-13" />
									{isSelected ? (
										<span
											aria-hidden="true"
											className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs"
										>
											<CheckIcon className="size-2.5 stroke-[3]" />
										</span>
									) : null}
								</button>
							)
						})}
					</div>
				</div>

				<div className="flex justify-center">
					<SolverResetButton onClick={() => setSelected([])} disabled={selected.length === 0} />
				</div>

				{selectionIsFull ? (
					<SolverResult
						tone={orders.length === 0 ? "warning" : "solved"}
						label={
							orders.length === 1
								? "Insertion Order"
								: orders.length > 1
									? "Matching Orders"
									: "No Match"
						}
					>
						{orders.length === 0 ? (
							<p className="text-center text-sm text-amber-800 dark:text-amber-200">
								{NO_MATCH_MESSAGE}
							</p>
						) : (
							<div className="space-y-3">
								<p className="text-center text-sm text-foreground/90">
									{orders.length === 1
										? "Insert the disks from left to right."
										: SEVERAL_ORDERS_MESSAGE}
								</p>
								<ul className="list-none space-y-2.5 pl-0">
									{Arr.map(orders, order => (
										<li key={Arr.join(order, ":")}>
											<div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
												{Arr.map(order, (symbolId, stepIndex) => {
													const symbol = getTbfbDiskSymbol(symbolId)

													return (
														<Fragment key={symbolId}>
															<div
																className="relative flex size-12 items-center justify-center rounded-lg bg-white text-zinc-950 shadow-xs ring-1 ring-black/10"
																title={symbol.label}
															>
																<span
																	aria-hidden="true"
																	className="absolute -top-1.5 -left-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground tabular-nums shadow-xs"
																>
																	{stepIndex + 1}
																</span>
																<symbol.Icon className="size-8" />
																<span className="sr-only">{symbol.label}</span>
															</div>
															{stepIndex < order.length - 1 ? (
																<ChevronRightIcon
																	aria-hidden="true"
																	className="size-4 shrink-0 text-muted-foreground/70"
																/>
															) : null}
														</Fragment>
													)
												})}
											</div>
										</li>
									))}
								</ul>
							</div>
						)}
					</SolverResult>
				) : null}
			</CardContent>
		</SolverCard>
	)
}

function distinctInsertionOrders(
	matches: readonly TbfbDiskPathMatch[],
): readonly (readonly TbfbDiskSymbolId[])[] {
	const orders: TbfbDiskSymbolId[][] = []

	for (const match of matches) {
		const listed = Arr.some(
			orders,
			order =>
				order.length === match.order.length &&
				Arr.every(order, (symbolId, index) => symbolId === match.order[index]),
		)

		if (listed) continue

		orders.push([...match.order])
	}

	return orders
}
