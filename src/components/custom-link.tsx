"use client"
import { Link, type LinkProps, type NavigateOptions, useNavigate } from "@tanstack/react-router"

interface ICustomLink extends LinkProps {
	className?: string
	tabIndex?: number
	"aria-disabled"?: React.AriaAttributes["aria-disabled"]
}

/**
 * TanStack `Link` omits `href` only when `disabled` is true. The prerender crawler
 * follows every `<a href>`, so Coming Soon cards must disable the link — `aria-disabled`
 * and `pointer-events-none` alone still emit a crawlable URL that 404s the build.
 */
export function isDisabledCustomLink(
	disabled: boolean | undefined,
	ariaDisabled: React.AriaAttributes["aria-disabled"],
): boolean {
	return disabled === true || ariaDisabled === true || ariaDisabled === "true"
}

export function CustomLink({
	children,
	tabIndex,
	disabled,
	"aria-disabled": ariaDisabled,
	...linkProps
}: ICustomLink) {
	const navigate = useNavigate()
	const isDisabled = isDisabledCustomLink(disabled, ariaDisabled)

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
		if (isDisabled) return
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
			aria-disabled={ariaDisabled}
			disabled={isDisabled}
		>
			{children}
		</Link>
	)
}
