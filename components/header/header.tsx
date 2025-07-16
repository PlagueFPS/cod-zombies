import Image from "next/image"
import { Suspense } from "react"
import AppSidebar from "@/components/app-sidebar/app-sidebar"
import { CustomLink } from "@/components/custom-link/custom-link"
import FeedbackForm from "@/components/feedback-form/feedback-form"
import SearchBarLoader from "@/components/loaders/search-bar-loader"
import NavLink from "@/components/nav-link/nav-link"
import SearchBar from "@/components/search-bar/search-bar"
import ThemeToggleWrapper from "@/components/theme-toggle/theme-toggle-wrapper"
import Logo from "@/public/logo.webp"
import { IN_DEVELOPMENT, ROUTES } from "@/utils/constants"
import LocalCacheButton from "../ui/local-cache-button"
import { Separator } from "../ui/separator"

export default function Header() {
	return (
		<header className="sticky top-0 z-500 w-full">
			<div className="flex h-16 w-full max-w-screen items-center border-b bg-background/90 px-4 backdrop-blur-xs supports-backdrop-filter:backdrop-blur-xs">
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
					<div className="text-center font-extrabold text-xl">
						<span className="dark:dark-text-gradient text-gradient">COD:</span>
						<span className="text-primary-gradient"> Zombies Guides</span>
					</div>
				</CustomLink>
				<nav className="mr-8 hidden h-full w-fit items-center justify-center gap-8 xl:flex">
					{/* Custom draft mode toggle for development */}
					{IN_DEVELOPMENT && <LocalCacheButton />}
					{ROUTES.map(route => (
						<NavLink
							key={route.id}
							href={route.href}
							aria-label={`Go to ${route.title} page`}
							className="flex items-center justify-center gap-2 transition-all hover:text-primary hover:dark:text-orange-200"
						>
							<route.icon className="size-4 text-orange-400 dark:text-orange-200" />
							<span className="font-medium">{route.title}</span>
						</NavLink>
					))}
				</nav>
				<div className="flex h-full w-fit items-center justify-center gap-2 self-end">
					<FeedbackForm className="hidden lg:flex" />
					<Suspense fallback={<SearchBarLoader />}>
						<SearchBar />
					</Suspense>
					<div className="hidden items-center gap-2 lg:inline-flex">
						<Separator orientation="vertical" className="min-h-6" />
						<ThemeToggleWrapper className="mr-1 xl:mr-0" />
					</div>
				</div>
				<AppSidebar />
			</div>
		</header>
	)
}
