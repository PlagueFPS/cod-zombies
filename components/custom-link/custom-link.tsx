"use client"
import Link, { type LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type AnchorHTMLAttributes, useEffect } from "react"

interface ICustomLink extends LinkProps {
	children: React.ReactNode
	className?: string
}

export function CustomLink({
	children,
	href,
	...props
}: ICustomLink & AnchorHTMLAttributes<HTMLAnchorElement>) {
	const router = useRouter()

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
	) => {
		const url = new URL(String(href), window.location.href)
		if (
			url.origin === window.location.origin &&
			!e.altKey &&
			!e.shiftKey &&
			!e.ctrlKey &&
			!e.metaKey &&
			(("button" in e && e.button === 0) || ("key" in e && e.key === "Enter"))
		) {
			e.preventDefault()
			router.push(String(href))
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

// This component is neccessary for proper handling of hash links for hard navigations
// In the context of pre-renders, the hash may not be handled by the browser
// since it may not exist yet, so we need to handle it manually
export const HashLinkHandler = () => {
	const pathname = usePathname()

	// biome-ignore lint/correctness/useExhaustiveDependencies(pathname): we want to re-run this effect when the pathname changes
	useEffect(() => {
		const handleHashScroll = () => {
			const hash = window.location.hash
			if (!hash) return

			// Remove the # from the hash
			const elementId = hash.substring(1)

			// Try to find the element
			const element = document.getElementById(elementId)

			if (element) {
				// Add a small delay to ensure the page is fully rendered
				setTimeout(() => {
					element.scrollIntoView({
						behavior: "smooth",
						block: "start",
					})
				}, 100)
			} else {
				// If element doesn't exist yet, keep trying for a few seconds
				let attempts = 0
				const maxAttempts = 100 // Try for 10 seconds (100 * 100ms)

				const retryScroll = setInterval(() => {
					const retryElement = document.getElementById(elementId)
					attempts++

					if (retryElement) {
						retryElement.scrollIntoView({
							behavior: "smooth",
							block: "start",
						})
						clearInterval(retryScroll)
					} else if (attempts >= maxAttempts) {
						clearInterval(retryScroll)
					}
				}, 100)
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
