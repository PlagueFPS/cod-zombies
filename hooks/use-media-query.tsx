import { useEffect, useState } from "react"

export const useMediaQuery = (breakpoint: number | undefined = 1280) => {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`)

		const handleChange = (event: MediaQueryListEvent) => {
			setMatches(event.matches)
		}

		// Set initial value
		setMatches(mediaQuery.matches)

		// Add listener for subsequent changes
		mediaQuery.addEventListener("change", handleChange)

		// Clean up listener on component unmount
		return () => {
			mediaQuery.removeEventListener("change", handleChange)
		}
	}, [breakpoint])

	return matches
}
