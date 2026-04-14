import { useEffect, useRef, type ReactNode } from "react"

interface RemoveScrollProps {
	children: ReactNode
	/** When false, no document lock or global listeners (use while overlays are closed). */
	enabled?: boolean
}

let docLockCount = 0
let savedHtmlOverflow = ""
let savedHtmlPaddingRight = ""

const scrollLockRoots = new Set<HTMLElement>()

function nodeInsideAnyScrollLockRoot(node: Node | null): boolean {
	if (!node) return false
	for (const r of scrollLockRoots) {
		if (r.contains(node)) return true
	}
	return false
}

function lockDocumentScroll(): void {
	docLockCount++
	if (docLockCount !== 1) return

	const html = document.documentElement
	savedHtmlOverflow = html.style.overflow
	savedHtmlPaddingRight = html.style.paddingRight

	const gap = Math.max(0, window.innerWidth - html.clientWidth)
	html.style.overflow = "hidden"
	if (gap > 0) html.style.paddingRight = `${gap}px`
}

function unlockDocumentScroll(): void {
	docLockCount = Math.max(0, docLockCount - 1)
	if (docLockCount !== 0) return

	const html = document.documentElement
	html.style.overflow = savedHtmlOverflow
	html.style.paddingRight = savedHtmlPaddingRight
}

function overflowAllowsScroll(overflow: string): boolean {
	return overflow === "auto" || overflow === "scroll" || overflow === "overlay"
}

function scrollAxes(el: HTMLElement): { vy: boolean; hx: boolean } {
	const style = window.getComputedStyle(el)
	return {
		vy: overflowAllowsScroll(style.overflowY) && el.scrollHeight > el.clientHeight + 1,
		hx: overflowAllowsScroll(style.overflowX) && el.scrollWidth > el.clientWidth + 1,
	}
}

function isDocumentScroller(el: HTMLElement): boolean {
	return el === document.documentElement || el === document.body
}

function findOverflowScrollParent(
	start: EventTarget | null,
	boundary: HTMLElement,
): HTMLElement | null {
	let el: Element | null =
		start instanceof Element ? start : start instanceof Node ? start.parentElement : null

	while (el) {
		if (!(el instanceof HTMLElement)) break
		if (!boundary.contains(el)) return null
		const { vy, hx } = scrollAxes(el)
		if (vy || hx) return el
		if (el === boundary) break
		el = el.parentElement
	}

	return null
}

function consumeVerticalDelta(el: HTMLElement, deltaY: number): boolean {
	const { scrollTop, scrollHeight, clientHeight } = el
	if (deltaY > 0) return scrollTop + clientHeight < scrollHeight - 1
	if (deltaY < 0) return scrollTop > 0
	return true
}

function consumeHorizontalDelta(el: HTMLElement, deltaX: number): boolean {
	const { scrollLeft, scrollWidth, clientWidth } = el
	if (deltaX > 0) return scrollLeft + clientWidth < scrollWidth - 1
	if (deltaX < 0) return scrollLeft > 0
	return true
}

/** Touch vs wheel intentionally differ on axis ties (`>` vs `>=`). */
function gestureAllowsScroll(
	el: HTMLElement,
	deltaY: number,
	deltaX: number,
	mode: "touch" | "wheel",
): boolean {
	const { vy, hx } = scrollAxes(el)
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

type ResolvedGestureTarget =
	| { kind: "pass" }
	| { kind: "lock" }
	| { kind: "scroll"; el: HTMLElement }

function resolveGestureScrollParent(target: Node, root: HTMLElement): ResolvedGestureTarget {
	if (!root.contains(target)) {
		if (nodeInsideAnyScrollLockRoot(target)) return { kind: "pass" }
		const external = findOverflowScrollParent(target, document.documentElement)
		if (external && !isDocumentScroller(external)) return { kind: "scroll", el: external }
		return { kind: "lock" }
	}
	const scrollParent = findOverflowScrollParent(target, root)
	if (!scrollParent) return { kind: "lock" }
	return { kind: "scroll", el: scrollParent }
}

export function RemoveScroll({ children, enabled = true }: RemoveScrollProps) {
	const rootRef = useRef<HTMLDivElement>(null)
	const lastTouchYRef = useRef(0)
	const lastTouchXRef = useRef(0)

	useEffect(() => {
		if (!enabled) return

		const root = rootRef.current
		if (!root) return

		scrollLockRoots.add(root)
		lockDocumentScroll()

		const onTouchStart = (e: TouchEvent) => {
			if (e.touches.length !== 1) return
			const t = e.touches.item(0)
			if (!t) return
			lastTouchYRef.current = t.clientY
			lastTouchXRef.current = t.clientX
		}

		const onTouchMove = (e: TouchEvent) => {
			if (e.touches.length !== 1) return
			const touch = e.touches.item(0)
			if (!touch) return
			const target = e.target
			if (!(target instanceof Node)) return

			const resolved = resolveGestureScrollParent(target, root)
			if (resolved.kind === "pass") return

			const deltaY = touch.clientY - lastTouchYRef.current
			const deltaX = touch.clientX - lastTouchXRef.current
			lastTouchYRef.current = touch.clientY
			lastTouchXRef.current = touch.clientX

			if (resolved.kind === "lock") {
				e.preventDefault()
				return
			}
			if (!gestureAllowsScroll(resolved.el, deltaY, deltaX, "touch")) e.preventDefault()
		}

		const onWheel = (e: WheelEvent) => {
			const target = e.target
			if (!(target instanceof Node)) return

			const resolved = resolveGestureScrollParent(target, root)
			if (resolved.kind === "pass") return
			if (resolved.kind === "lock") {
				e.preventDefault()
				return
			}
			if (!gestureAllowsScroll(resolved.el, e.deltaY, e.deltaX, "wheel")) e.preventDefault()
		}

		window.addEventListener("touchstart", onTouchStart, { capture: true, passive: true })
		window.addEventListener("touchmove", onTouchMove, { capture: true, passive: false })
		window.addEventListener("wheel", onWheel, { capture: true, passive: false })

		return () => {
			scrollLockRoots.delete(root)
			window.removeEventListener("touchstart", onTouchStart, { capture: true })
			window.removeEventListener("touchmove", onTouchMove, { capture: true })
			window.removeEventListener("wheel", onWheel, { capture: true })
			unlockDocumentScroll()
		}
	}, [enabled])

	return (
		<div ref={rootRef} className="contents">
			{children}
		</div>
	)
}
