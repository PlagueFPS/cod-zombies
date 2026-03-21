"use client"
import type { Route } from "next"
import Link, { type LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

interface ICustomLink<T extends string> extends LinkProps<T> {
	href: Route<T>
}

export function CustomLink<T extends string>({ children, href, ...props }: ICustomLink<T>) {
	const router = useRouter()

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
	) => {
		if (!href) return
		const url = new URL(href, window.location.href)
		if (
			url.origin === window.location.origin &&
			!e.altKey &&
			!e.shiftKey &&
			!e.ctrlKey &&
			!e.metaKey &&
			(("button" in e && e.button === 0) || ("key" in e && e.key === "Enter"))
		) {
			e.preventDefault()
			router.push(href)
		}
	}

	return (
		<Link
			{...props}
			href={href}
			onMouseDown={handleNavigation}
			onKeyDown={handleNavigation}
			// We use this to prevent double navigations since we use `router.push()`
			// for mouse/key down navigations, resulting in a seemingly faster experience.
			onNavigate={e => {
				e.preventDefault()
				props?.onNavigate?.(e)
			}}
		>
			{children}
		</Link>
	)
}
/**
 * This component properly handles the scrolling of hash links for hard navigations
 * since it may not exist yet, so we need to handle it manually
 * @see https://nextjs.org/docs/app/api-reference/components/link#scrolling-to-an-id
 */
export const HashLinkHandler = () => {
	const pathname = usePathname()

	useEffect(() => {
		const handleHashScroll = () => {
			const hash = window.location.hash
			if (!hash) return

			const elementId = hash.substring(1)
			const element = document.getElementById(elementId)

			if (element) {
				// Add a small delay to ensure the page is fully rendered
				setTimeout(() => {
					element.scrollIntoView({
						behavior: "instant",
						block: "start",
					})
				}, 50)
			} else {
				// If element doesn't exist yet, keep trying for a few seconds
				let attempts = 0
				const maxAttempts = 20 // 1 second (20 * 50ms)

				const retryScroll = setInterval(() => {
					const retryElement = document.getElementById(elementId)
					attempts++

					if (retryElement) {
						retryElement.scrollIntoView({
							behavior: "instant",
							block: "start",
						})
						clearInterval(retryScroll)
					} else if (attempts >= maxAttempts) {
						clearInterval(retryScroll)
					}
				}, 50)
			}
		}

		// Handle initial page load
		if (typeof window !== "undefined") {
			// Wait for the page to be fully loaded
			if (document.readyState === "complete") {
				handleHashScroll()
			} else {
				window.addEventListener("load", handleHashScroll)
			}
		}

		return () => {
			window.removeEventListener("load", handleHashScroll)
		}
	}, [pathname])

	return null
}
