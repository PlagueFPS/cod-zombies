export const VARIANT_WIDTHS_LIST = [384, 1200] as const
export type VariantWidth = (typeof VARIANT_WIDTHS_LIST)[number]

const VARIANT_SUFFIX_RE = new RegExp(`-(${VARIANT_WIDTHS_LIST.join("|")})\\.webp$`, "i")

export function toWebImagePath(path: string): string {
	return path.startsWith("/") ? path : `/${path}`
}

export function isVariantImagePath(path: string): boolean {
	return VARIANT_SUFFIX_RE.test(toWebImagePath(path))
}

export function variantWebPath(baseWebPath: string, width: VariantWidth): string {
	const dot = baseWebPath.lastIndexOf(".")
	if (dot === -1) return `${baseWebPath}-${width}`
	return `${baseWebPath.slice(0, dot)}-${width}${baseWebPath.slice(dot)}`
}
