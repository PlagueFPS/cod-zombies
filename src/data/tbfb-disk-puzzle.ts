import ChevronSymbol from "@/components/floppy-symbols/chevron"
import ChevronBarSymbol from "@/components/floppy-symbols/chevron-bar"
import CornerBracketsSymbol from "@/components/floppy-symbols/corner-brackets"
import EagleSymbol from "@/components/floppy-symbols/eagle"
import FourTrianglesSymbol from "@/components/floppy-symbols/four-triangles"
import LambdaSymbol from "@/components/floppy-symbols/lambda"
import SlantedNSymbol from "@/components/floppy-symbols/n"
import SkewedPlusSymbol from "@/components/floppy-symbols/plus"
import TripleSlashSymbol from "@/components/floppy-symbols/triple-slash"
import WingsDiamondSymbol from "@/components/floppy-symbols/wings-diamond"
import WingsTriangleSymbol from "@/components/floppy-symbols/wings-triangle"
import XSymbol from "@/components/floppy-symbols/x"

export const TBFB_DISK_SYMBOLS = [
	{ id: "x", label: "X", Icon: XSymbol },
	{ id: "n", label: "Slanted N", Icon: SlantedNSymbol },
	{ id: "four-triangles", label: "Four triangles", Icon: FourTrianglesSymbol },
	{ id: "corner-brackets", label: "Corner brackets", Icon: CornerBracketsSymbol },
	{ id: "chevron", label: "Chevron", Icon: ChevronSymbol },
	{ id: "wings-diamond", label: "Wings and diamond", Icon: WingsDiamondSymbol },
	{ id: "triple-slash", label: "Three slashes", Icon: TripleSlashSymbol },
	{ id: "plus", label: "Skewed plus", Icon: SkewedPlusSymbol },
	{ id: "eagle", label: "Eagle", Icon: EagleSymbol },
	{ id: "lambda", label: "Lambda", Icon: LambdaSymbol },
	{ id: "wings-triangle", label: "Wings and triangle", Icon: WingsTriangleSymbol },
	{ id: "chevron-bar", label: "Chevron bar", Icon: ChevronBarSymbol },
] as const

export type TbfbDiskSymbol = (typeof TBFB_DISK_SYMBOLS)[number]

export type TbfbDiskSymbolId = TbfbDiskSymbol["id"]

export const TBFB_DISK_PATHS = [
	{
		id: 1,
		symbols: ["n", "four-triangles", "corner-brackets", "chevron", "x", "wings-diamond"],
	},
	{
		id: 2,
		symbols: ["triple-slash", "wings-diamond", "eagle", "lambda", "plus", "n"],
	},
	{
		id: 3,
		symbols: ["lambda", "wings-triangle", "plus", "eagle", "triple-slash", "n"],
	},
	{
		id: 4,
		symbols: ["lambda", "chevron", "corner-brackets", "x", "wings-diamond", "four-triangles"],
	},
	{
		id: 5,
		symbols: ["n", "chevron-bar", "corner-brackets", "four-triangles", "x", "wings-diamond"],
	},
	{
		id: 6,
		symbols: ["chevron", "chevron-bar", "x", "four-triangles", "wings-diamond", "eagle"],
	},
] as const satisfies readonly {
	id: number
	symbols: readonly TbfbDiskSymbolId[]
}[]

export type TbfbDiskPathMatch = {
	path: number
	order: TbfbDiskSymbolId[]
}

const DISK_SELECTION_SIZE = 4

/** Insertion order is the picked symbols in the order they appear on the path. */
export function solveTbfbDiskPuzzle(
	selected: readonly TbfbDiskSymbolId[],
): readonly TbfbDiskPathMatch[] {
	if (selected.length !== DISK_SELECTION_SIZE) return []

	const picked = new Set(selected)

	if (picked.size !== DISK_SELECTION_SIZE) return []

	return TBFB_DISK_PATHS.flatMap(path => {
		const order = path.symbols.filter(symbol => picked.has(symbol))

		if (order.length !== DISK_SELECTION_SIZE) return []

		return [{ path: path.id, order: [...order] }]
	})
}

export function getTbfbDiskSymbol(id: TbfbDiskSymbolId): TbfbDiskSymbol {
	const symbol = TBFB_DISK_SYMBOLS.find(entry => entry.id === id)

	if (!symbol) {
		throw new Error(`Unknown disk symbol: ${id}`)
	}

	return symbol
}
