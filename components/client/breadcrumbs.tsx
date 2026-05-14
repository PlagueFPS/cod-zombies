"use client"
import type { Route } from "next"
import { Slash } from "lucide-react"
import { Fragment } from "react"
import { NavLink } from "@/components/client/nav-link"
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

/** Above this character count on the leaf label, omit the first trail segment on mobile so more fits on one line */
const LONG_LAST_LABEL_CHARS = 24

export interface Link<T extends string> {
	href: Route<T>
	title: string
}

type TrailPiece<T extends string> = { kind: "link"; link: Link<T> } | { kind: "ellipsis" }

/** When `showEllipsis` is true, callers should pass `links.length >= 3`. */
export function trailAfterHome<T extends string>(
	links: Link<T>[],
	showEllipsis: boolean,
	collapseAggressive: boolean,
): TrailPiece<T>[] {
	if (!showEllipsis) {
		return links.map(link => ({ kind: "link" as const, link }))
	}

	const last = links.at(-1)!
	const head: TrailPiece<T>[] = []
	if (!collapseAggressive) {
		head.push({ kind: "link", link: links[0]! })
	}
	return [...head, { kind: "ellipsis" as const }, { kind: "link", link: last }]
}

interface BreadcrumbsProps<T extends string> {
	links: Link<T>[]
	className?: string
}

export function Breadcrumbs<T extends string>({ links, className }: BreadcrumbsProps<T>) {
	const isMobile = useIsMobile(640)
	const showEllipsis = links.length >= 3 && isMobile
	const lastLen = links.at(-1)?.title.length ?? 0
	const collapseAggressive = lastLen >= LONG_LAST_LABEL_CHARS

	const menuLinks =
		showEllipsis && collapseAggressive ? links.slice(0, -1) : showEllipsis ? links.slice(1, -1) : []

	const trailPieces = trailAfterHome(links, showEllipsis, collapseAggressive)

	return (
		<Breadcrumb className={cn("mr-auto", className)}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<NavLink href="/">Home</NavLink>} />
				</BreadcrumbItem>
				{trailPieces.map(entry => (
					<Fragment
						key={
							entry.kind === "link" ? `${entry.link.href}-${entry.link.title}` : "trail-ellipsis"
						}
					>
						<BreadcrumbSeparator>
							<Slash />
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							{entry.kind === "link" ? (
								<BreadcrumbLink
									render={<NavLink href={entry.link.href}>{entry.link.title}</NavLink>}
								/>
							) : (
								<CustomEllipsis menuLinks={menuLinks} />
							)}
						</BreadcrumbItem>
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}

const CustomEllipsis = <T extends string>({ menuLinks }: { menuLinks: Link<T>[] }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-1">
				<BreadcrumbEllipsis className="size-4" />
				<span className="sr-only">Toggle menu</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{menuLinks.map(link => (
					<DropdownMenuItem
						key={`${link.href}-${link.title}`}
						render={<NavLink href={link.href}>{link.title}</NavLink>}
					/>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
