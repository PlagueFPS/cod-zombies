"use client"
import type { Route } from "next"
import type { LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CustomLink } from "../custom-link/custom-link"

interface Props<T extends string> extends LinkProps<T> {
	href: Route<T>
	children: string | React.ReactNode
	className?: string
	ariaLabel?: string
}

export default function NavLink<T extends string>({
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
			className={cn(className, { "text-orange-600 dark:text-orange-200": isActive })}
			{...props}
		>
			{children}
		</CustomLink>
	)
}
