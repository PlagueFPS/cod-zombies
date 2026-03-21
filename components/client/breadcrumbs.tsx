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

export interface Link<T extends string> {
	href: Route<T>
	title: string
}

interface BreadcrumbsProps<T extends string> {
	links: Link<T>[]
	className?: string
}

export function Breadcrumbs<T extends string>({ links, className }: BreadcrumbsProps<T>) {
	const isMobile = useIsMobile(640)
	const showEllipsis = links.length >= 4 && isMobile
	const menuLinks = showEllipsis ? links.slice(0, -1) : []

	return (
		<Breadcrumb className={cn("mr-auto", className)}>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink render={<NavLink href="/">Home</NavLink>} />
				</BreadcrumbItem>
				{links.map((link, index) => {
					// For the links cut-off by the ellipsis
					if (showEllipsis && index === 1) {
						return (
							<Fragment key="links-ellipsis">
								<BreadcrumbSeparator>
									<Slash />
								</BreadcrumbSeparator>
								<BreadcrumbItem>
									<CustomEllipsis menuLinks={menuLinks} />
								</BreadcrumbItem>
							</Fragment>
						)
					}

					// skip rendering links cut-off by the ellipsis
					if (showEllipsis && index < links.length - 1) return null

					// For the last item in the array, does not matter if showEllipsis is true/false here
					if (index === links.length - 1) {
						return (
							<Fragment key={`${link.title}-${link.href}`}>
								<BreadcrumbSeparator>
									<Slash />
								</BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbLink render={<NavLink href={link.href}>{link.title}</NavLink>} />
								</BreadcrumbItem>
							</Fragment>
						)
					}

					// For all items when showEllipsis is false
					return (
						<Fragment key={`${link.title}-${link.href}`}>
							<BreadcrumbSeparator>
								<Slash />
							</BreadcrumbSeparator>
							<BreadcrumbItem>
								<BreadcrumbLink render={<NavLink href={link.href}>{link.title}</NavLink>} />
							</BreadcrumbItem>
						</Fragment>
					)
				})}
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
