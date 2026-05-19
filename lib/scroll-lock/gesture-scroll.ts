export function overflowAllowsScroll(overflow: string): boolean {
	return overflow === "auto" || overflow === "scroll" || overflow === "overlay"
}

export type ScrollAxes = { vy: boolean; hx: boolean }

export type ScrollAxesFn = (el: HTMLElement) => ScrollAxes

export function scrollAxes(el: HTMLElement): ScrollAxes {
	const style = window.getComputedStyle(el)
	return {
		vy: overflowAllowsScroll(style.overflowY) && el.scrollHeight > el.clientHeight + 1,
		hx: overflowAllowsScroll(style.overflowX) && el.scrollWidth > el.clientWidth + 1,
	}
}

export function isDocumentScroller(el: HTMLElement): boolean {
	return el === document.documentElement || el === document.body
}

export function findOverflowScrollParent(
	start: EventTarget | null,
	boundary: HTMLElement,
	getAxes: ScrollAxesFn = scrollAxes,
): HTMLElement | null {
	let el: Element | null =
		start instanceof Element ? start : start instanceof Node ? start.parentElement : null

	while (el) {
		if (!(el instanceof HTMLElement)) break
		if (!boundary.contains(el)) return null
		const { vy, hx } = getAxes(el)
		if (vy || hx) return el
		if (el === boundary) break
		el = el.parentElement
	}

	return null
}

export function consumeVerticalDelta(el: HTMLElement, deltaY: number): boolean {
	const { scrollTop, scrollHeight, clientHeight } = el
	if (deltaY > 0) return scrollTop + clientHeight < scrollHeight - 1
	if (deltaY < 0) return scrollTop > 0
	return true
}

export function consumeHorizontalDelta(el: HTMLElement, deltaX: number): boolean {
	const { scrollLeft, scrollWidth, clientWidth } = el
	if (deltaX > 0) return scrollLeft + clientWidth < scrollWidth - 1
	if (deltaX < 0) return scrollLeft > 0
	return true
}

/** Touch vs wheel intentionally differ on axis ties (`>` vs `>=`). */
export function gestureAllowsScroll(
	el: HTMLElement,
	deltaY: number,
	deltaX: number,
	mode: "touch" | "wheel",
	axes?: ScrollAxes,
): boolean {
	const { vy, hx } = axes ?? scrollAxes(el)
	if (mode === "touch") {
		const canY = Math.abs(deltaY) > Math.abs(deltaX) && vy && consumeVerticalDelta(el, deltaY)
		const canX = Math.abs(deltaX) >= Math.abs(deltaY) && hx && consumeHorizontalDelta(el, deltaX)
		return canY || canX
	}
	const dominantVertical = Math.abs(deltaY) >= Math.abs(deltaX)
	const canY = dominantVertical && vy && consumeVerticalDelta(el, deltaY)
	const canX = !dominantVertical && hx && consumeHorizontalDelta(el, deltaX)
	return canY || canX
}

export type ResolvedGestureTarget =
	| { kind: "pass" }
	| { kind: "lock" }
	| { kind: "scroll"; el: HTMLElement }

function nodeInsideAnyScrollLockRoot(
	node: Node | null,
	scrollLockRoots: ReadonlySet<HTMLElement>,
): boolean {
	if (!node) return false
	for (const r of scrollLockRoots) {
		if (r.contains(node)) return true
	}
	return false
}

export function resolveGestureScrollParent(
	target: Node,
	root: HTMLElement,
	scrollLockRoots: ReadonlySet<HTMLElement>,
	getAxes: ScrollAxesFn = scrollAxes,
): ResolvedGestureTarget {
	if (!root.contains(target)) {
		if (nodeInsideAnyScrollLockRoot(target, scrollLockRoots)) return { kind: "pass" }
		const external = findOverflowScrollParent(target, document.documentElement, getAxes)
		if (external && !isDocumentScroller(external)) return { kind: "scroll", el: external }
		return { kind: "lock" }
	}
	const scrollParent = findOverflowScrollParent(target, root, getAxes)
	if (!scrollParent) return { kind: "lock" }
	return { kind: "scroll", el: scrollParent }
}
