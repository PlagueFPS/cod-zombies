import { useCallback, useRef, type Ref } from "react"

/**
 * Returns a single ref callback that assigns the same element instance to two
 * refs: useful when a component must forward a ref to a parent and also keep
 * a local ref (e.g. for measurements or focus).
 *
 * Unmounts run stored cleanups: function refs that return a disposer, and
 * object refs that get cleared when the node is released.
 */
export function useMergeRef<TElement>(refA: Ref<TElement>, refB: Ref<TElement>): Ref<TElement> {
	const cleanupA = useRef<() => void>(null)
	const cleanupB = useRef<() => void>(null)

	return useCallback(
		(current: TElement | null) => {
			if (current === null) {
				const cleanupFnA = cleanupA.current
				if (cleanupFnA) {
					cleanupA.current = null
					cleanupFnA()
				}

				const cleanupFnB = cleanupB.current
				if (cleanupFnB) {
					cleanupB.current = null
					cleanupFnB()
				}
			} else {
				if (refA) {
					cleanupA.current = applyRef(refA, current)
				}
				if (refB) {
					cleanupB.current = applyRef(refB, current)
				}
			}
		},
		[refA, refB],
	)
}

function applyRef<TElement>(refA: NonNullable<Ref<TElement>>, current: TElement) {
	if (typeof refA === "function") {
		const cleanup = refA(current)
		if (typeof cleanup === "function") {
			return cleanup
		} else {
			return () => refA(null)
		}
	} else {
		refA.current = current
		return () => {
			refA.current = null
		}
	}
}
