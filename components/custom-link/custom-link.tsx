"use client"
import Link, { type LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { type AnchorHTMLAttributes, useEffect, useState } from "react"

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

// This component is neccessary for proper handling of hash links
// In the context of pre-renders, the hash link is not handled by the browser
// since it does not exist yet, so we need to handle it manually
export const HashLinkHandler = () => {
	const [attemptCount, setAttemptCount] = useState(0)

	useEffect(() => {
		const handleHashChange = () => {
			if (!window.location.hash || attemptCount >= 5) return
			const id = window.location.hash.substring(1)
			const element = document.getElementById(id)

			if (element) {
				element.scrollIntoView({ behavior: "instant" })
			} else if (attemptCount < 5) {
				const timer = setTimeout(() => {
					// this is fine because we only set this state a max of 5 times every 100ms
					setAttemptCount(prev => prev + 1)
				}, 100)
				return () => clearTimeout(timer)
			}
		}

		window.addEventListener("hashchange", handleHashChange)
		return () => window.removeEventListener("hashchange", handleHashChange)
	}, [attemptCount])

	return null
}
