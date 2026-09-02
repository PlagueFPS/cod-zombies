"use client"
import type { FileRoutesByTo } from "@/routeTree.gen"
import { cn } from "cn"
import { Slash } from "lucide-react"
import { Fragment } from "react"
import { CustomLink } from "@/components/custom-link"
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

export interface Link {
	href: keyof FileRoutesByTo
	title: string
	search?: Record<string, unknown>
	params?: Record<string, string | undefined>
}

interface BreadcrumbsProps {
	links: Link[]
	className?: string
}

type TrailPiece = { kind: "link"; link: Link } | { kind: "ellipsis" }

/** Above this character count on the leaf label, omit the first trail segment on mobile so more fits on one line */
export const LONG_LAST_LABEL_CHARS = 24

/** When `showEllipsis` is true, callers normally pass `links.length >= 3`; otherwise returns an empty trail. */
export function trailAfterHome(
	links: Link[],
	showEllipsis: boolean,
	collapseAggressive: boolean,
): TrailPiece[] {
	if (!showEllipsis) {
		return links.map(link => ({ kind: "link" as const, link }))
	}

	if (showEllipsis && links.length < 3) {
		console.warn("`trailAfterHome` called with `showEllipsis` but `links` has less than 3 items")
		return []
	}

	// SAFETY: From this point onwards, `links` has at least 3 items (checked above)
	const last = links.at(-1)!
	const head: TrailPiece[] = []
	if (!collapseAggressive) {
		head.push({ kind: "link", link: links[0]! })
	}
	return [...head, { kind: "ellipsis" as const }, { kind: "link", link: last }]
}

export function Breadcrumbs({ links, className }: BreadcrumbsProps) {
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
					<BreadcrumbLink
						render={
							<CustomLink
								to="/"
								activeOptions={{ exact: true, includeHash: true }}
								activeProps={{ className: "text-primary" }}
							>
								Home
							</CustomLink>
						}
					/>
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
									render={
										<CustomLink
											to={entry.link.href}
											activeOptions={{ exact: true, includeSearch: false }}
											activeProps={{ className: "text-primary" }}
										>
											{entry.link.title}
										</CustomLink>
									}
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

const CustomEllipsis = ({ menuLinks }: { menuLinks: Link[] }) => {
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
						render={
							<CustomLink
								to={link.href}
								params={link.params}
								search={link.search}
								activeOptions={{ exact: true, includeHash: true }}
								activeProps={{ className: "text-primary" }}
							>
								{link.title}
							</CustomLink>
						}
					/>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
