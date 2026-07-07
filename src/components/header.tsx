import { CustomLink } from "@/components/custom-link"
import { FeedbackForm } from "@/components/feedback-form"
import { Image } from "@/components/image"
import { MobileNav } from "@/components/mobile-nav"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { NAV_ROUTES } from "@/utils/nav-routes"

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xs supports-backdrop-filter:backdrop-blur-xs">
			<div className="container flex h-16 w-full items-center bg-transparent px-4">
				<CustomLink
					to="/"
					aria-label="Go to Home Page"
					className="mr-auto flex items-center justify-center gap-2"
				>
					<Image
						unoptimized
						src="/logo.webp"
						width={128}
						height={128}
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
						<CustomLink
							key={route.id}
							to={route.href}
							activeOptions={{ exact: true, includeHash: true, includeSearch: false }}
							activeProps={{ className: "text-primary" }}
							aria-label={`Go to ${route.title} page`}
							className="flex items-center justify-center gap-2 text-foreground/80 transition-all hover:text-foreground"
						>
							<span className="font-medium">{route.title}</span>
						</CustomLink>
					))}
				</nav>
				<div className="flex h-full w-fit items-center justify-center gap-2 self-end">
					<SearchBar />
					<FeedbackForm className="hidden lg:flex" />
					<div className="hidden items-center gap-2 lg:inline-flex">
						<Separator orientation="vertical" className="min-h-6" />
						<ThemeToggle className="mr-1 xl:mr-0" />
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
