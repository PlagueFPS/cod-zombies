import Image from "next/image"
import { Suspense } from "react"
import { CustomLink } from "@/components/client/custom-link"
import { FeedbackForm } from "@/components/client/feedback-form"
import { NavLink } from "@/components/client/nav-link"
import { ThemeToggleWrapper } from "@/components/client/theme-toggle-wrapper"
import { MobileNav } from "@/components/server/mobile-nav"
import { SearchBar } from "@/components/server/search-bar"
import { SearchBarLoader } from "@/components/server/search-bar-loader"
import { Separator } from "@/components/ui/separator"
import Logo from "@/public/logo.webp"
import { NAV_ROUTES } from "@/utils/nav-routes"

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xs supports-backdrop-filter:backdrop-blur-xs">
			<div className="container flex h-16 w-full items-center bg-transparent px-4">
				<CustomLink
					href="/"
					aria-label="Go to Home Page"
					className="mr-auto flex items-center justify-center gap-2"
				>
					<Image
						unoptimized
						src={Logo}
						alt="Call of Duty: Zombies Guides Logo"
						className="size-5 rounded"
					/>
					<div className="text-center text-xl font-extrabold">
						<span className="text-gradient dark:dark-text-gradient">COD:</span>
						<span className="ml-0.5 text-primary-gradient">ZG</span>
					</div>
				</CustomLink>
				<nav className="mx-auto hidden h-full w-fit items-center justify-center gap-8 text-foreground/80 lg:flex">
					{NAV_ROUTES.map(route => (
						<NavLink
							key={route.id}
							href={route.href}
							aria-label={`Go to ${route.title} page`}
							className="flex items-center justify-center gap-2 transition-all hover:text-foreground"
						>
							<span className="font-medium">{route.title}</span>
						</NavLink>
					))}
				</nav>
				<div className="flex h-full w-fit items-center justify-center gap-2 self-end">
					<Suspense fallback={<SearchBarLoader />}>
						<SearchBar />
					</Suspense>
					<FeedbackForm className="hidden lg:flex" />
					<div className="hidden items-center gap-2 lg:inline-flex">
						<Separator orientation="vertical" className="min-h-6" />
						<ThemeToggleWrapper className="mr-1 xl:mr-0" />
					</div>
				</div>
				<div className="inline-flex items-center gap-2 lg:hidden">
					<Separator orientation="vertical" />
					<MobileNav />
				</div>
			</div>
		</header>
	)
}
