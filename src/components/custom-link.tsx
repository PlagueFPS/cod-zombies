"use client"
import { Link, type LinkProps, type NavigateOptions, useNavigate } from "@tanstack/react-router"

interface ICustomLink extends LinkProps {
	className?: string
	tabIndex?: number
}

export function CustomLink({ children, tabIndex, ...linkProps }: ICustomLink) {
	const navigate = useNavigate()

	const navigatePayload: NavigateOptions = {
		from: linkProps.from,
		to: linkProps.to,
		params: linkProps.params,
		search: linkProps.search,
		hash: linkProps.hash,
		state: linkProps.state,
		mask: linkProps.mask,
		href: linkProps.href,
		unsafeRelative: linkProps.unsafeRelative,
		replace: linkProps.replace,
		resetScroll: linkProps.resetScroll,
		viewTransition: linkProps.viewTransition,
		ignoreBlocker: linkProps.ignoreBlocker,
		reloadDocument: linkProps.reloadDocument,
		hashScrollIntoView: linkProps.hashScrollIntoView,
	}

	const handleNavigation = (
		e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>,
	) => {
		if (!linkProps.to && !linkProps.href) return
		const target = linkProps.href ?? linkProps.to
		if (!target) return
		const url = new URL(target, window.location.href)
		if (
			url.origin === window.location.origin &&
			!e.altKey &&
			!e.shiftKey &&
			!e.ctrlKey &&
			!e.metaKey &&
			(("button" in e && e.button === 0) || ("key" in e && e.key === "Enter"))
		) {
			e.preventDefault()
			void navigate(navigatePayload)
		}
	}

	return (
		<Link
			onMouseDown={handleNavigation}
			onKeyDown={handleNavigation}
			tabIndex={tabIndex}
			{...linkProps}
		>
			{children}
		</Link>
	)
}
