"use client"

import { useEffect } from "react"

const ADSENSE_SRC =
	"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2572200153117332"

/**
 * Loads AdSense after the window `load` event (or on idle) so the third-party
 * script does not compete with first paint / hydration on the critical path.
 */
export function AdSenseLoader() {
	useEffect(() => {
		if (document.querySelector(`script[src^="${ADSENSE_SRC}"]`)) return

		const inject = () => {
			if (document.querySelector(`script[src^="${ADSENSE_SRC}"]`)) return
			const script = document.createElement("script")
			script.src = ADSENSE_SRC
			script.async = true
			script.crossOrigin = "anonymous"
			document.body.appendChild(script)
		}

		const schedule = () => {
			if (typeof window.requestIdleCallback === "function") {
				window.requestIdleCallback(inject, { timeout: 4000 })
			} else {
				window.setTimeout(inject, 2000)
			}
		}

		if (document.readyState === "complete") {
			schedule()
			return
		}

		window.addEventListener("load", schedule, { once: true })
		return () => window.removeEventListener("load", schedule)
	}, [])

	return null
}
