"use client"
import { useState, useEffect } from "react"

/**
 * 
 * @param breakpoint - The breakpoint to check against. Defaults to 1280px.
 * @returns boolean representing if the current screen size is greater than the breakpoint
 */
export const useMediaQuery = (breakpoint: number | undefined = 1280) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`)
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mediaQuery.matches)

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [breakpoint])

  return matches
}