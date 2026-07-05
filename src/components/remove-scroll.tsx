import { useEffect, useRef, type ReactNode } from "react"
import { lockDocumentScroll, unlockDocumentScroll } from "@/utils/scroll-lock/document-lock"
import { gestureAllowsScroll, resolveGestureScrollParent } from "@/utils/scroll-lock/gesture-scroll"

interface RemoveScrollProps {
	children: ReactNode
	/** When false, no document lock or global listeners (use while overlays are closed). */
	enabled?: boolean
}

const scrollLockRoots = new Set<HTMLElement>()

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

			const resolved = resolveGestureScrollParent(target, root, scrollLockRoots)
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

			const resolved = resolveGestureScrollParent(target, root, scrollLockRoots)
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
