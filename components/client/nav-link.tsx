"use client"
import type { Route } from "next"
import type { LinkProps } from "next/link"

import { usePathname } from "next/navigation"

import { CustomLink } from "@/components/client/custom-link"
import { cn } from "@/lib/utils"

interface Props<T extends string> extends LinkProps<T> {
	href: Route<T>
	children: string | React.ReactNode
	className?: string
	ariaLabel?: string
}

export function NavLink<T extends string>({
	href,
	children,
	className,
	ariaLabel,
	...props
}: Props<T>) {
	const pathname = usePathname()
	const isActive = pathname === href

	return (
		<CustomLink
			href={href}
			aria-label={ariaLabel}
			className={cn(className, { "text-primary": isActive })}
			{...props}
		>
			{children}
		</CustomLink>
	)
}
