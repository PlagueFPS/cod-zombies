/**
 * DOM helpers for {@link CustomCarousel} indicator anchoring.
 * Prefers Embla's first slide node, then falls back to the first `[data-slot="carousel-item"]`.
 */
import type { CarouselApi } from "@/components/ui/carousel"

export function firstSlideEl(root: HTMLElement, api: CarouselApi | undefined): HTMLElement | null {
	const n = api?.slideNodes()[0]
	if (n instanceof HTMLElement) return n
	const q = root.querySelector('[data-slot="carousel-item"]')
	return q instanceof HTMLElement ? q : null
}

export function firstSlideImg(
	root: HTMLElement,
	api: CarouselApi | undefined,
): HTMLImageElement | undefined {
	const el = firstSlideEl(root, api)
	const img = el?.querySelector("img")
	return img instanceof HTMLImageElement ? img : undefined
}
