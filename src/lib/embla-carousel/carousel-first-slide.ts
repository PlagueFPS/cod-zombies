/** Slide nodes used to resolve the first carousel item. */
export type CarouselSlideSource = {
	slideNodes: () => readonly unknown[]
}

/** @returns First carousel slide DOM node (Embla `slideNodes()` or first `[data-slot="carousel-item"]`). */
export function firstSlideEl(
	root: HTMLElement,
	api: CarouselSlideSource | undefined,
): HTMLElement | null {
	const n = api?.slideNodes()[0]

	if (n instanceof HTMLElement) return n
	const q = root.querySelector('[data-slot="carousel-item"]')

	return q instanceof HTMLElement ? q : null
}

/** @returns The first carousel slide image if it exists */
export function firstSlideImg(
	root: HTMLElement,
	api: CarouselSlideSource | undefined,
): HTMLImageElement | undefined {
	return firstSlideEl(root, api)?.querySelector("img") ?? undefined
}
