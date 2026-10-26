import { Array as Arr, String as Str, Option } from "effect"

export const VARIANT_WIDTHS_LIST = [384, 1200] as const

export type VariantWidth = (typeof VARIANT_WIDTHS_LIST)[number]

export type ImageVariantMetadata = {
	readonly sourceWidth: number
	readonly widths: readonly VariantWidth[]
}

const VARIANT_SUFFIX_RE = new RegExp(
	`-(${Arr.join(Arr.map(VARIANT_WIDTHS_LIST, String), "|")})\\.webp$`,
	"i",
)

export function toWebImagePath(path: string): string {
	return Str.startsWith("/")(path) ? path : `/${path}`
}

export function isVariantImagePath(path: string): boolean {
	return VARIANT_SUFFIX_RE.test(toWebImagePath(path))
}

export function variantWebPath(baseWebPath: string, width: VariantWidth): string {
	const dot = Option.getOrElse(Str.lastIndexOf(".")(baseWebPath), () => -1)

	if (dot === -1) return `${baseWebPath}-${width}`

	return `${Str.slice(0, dot)(baseWebPath)}-${width}${Str.slice(dot)(baseWebPath)}`
}
