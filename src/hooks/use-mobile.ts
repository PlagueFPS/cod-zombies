import * as React from "react"

/**
 * Checks if the user is on a mobile device, by checking the window's innerWidth
 * against a provided mobileBreakpoint (default is 768px).
 *
 * @param mobileBreakpoint - The width at which the returned value
 *   switches from false to true.
 *
 * @returns True if the user is currently on a mobile device based on the breakpoint.
 */

export function useIsMobile(mobileBreakpoint: number = 768) {
	const subscribe = React.useCallback(
		(onChange: () => void) => {
			const mql = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`)
			mql.addEventListener("change", onChange)
			return () => mql.removeEventListener("change", onChange)
		},
		[mobileBreakpoint],
	)

	return React.useSyncExternalStore(
		subscribe,
		() => window.innerWidth < mobileBreakpoint,
		() => false,
	)
}
