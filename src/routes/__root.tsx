import type { QueryClient } from "@tanstack/react-query"
import "@/env"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
	Outlet,
	HeadContent,
	Scripts,
	ScriptOnce,
	createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import ReactScan from "@/components/react-scan"
import { Toaster } from "@/components/ui/sonner"
import { IN_DEVELOPMENT, SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants"
import appCss from "@/globals.css?url"

interface RouterContext {
	serverUrl: string
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
			{ name: "theme-color", content: "#ffffff", media: "(prefers-color-scheme: light)" },
			{ name: "theme-color", content: "#09090b", media: "(prefers-color-scheme: dark)" },
			{ title: SITE_TITLE },
			{ name: "description", content: SITE_DESCRIPTION },
			{ name: "creator", content: "Angel Pichardo" },
			{ name: "verification", content: "wgrEcrtUWVglsvPl05UfwC8pqkk8KfP-uQellDbz-gs" },
			{ name: "category", content: "gaming" },
			{ property: "og:title", content: SITE_TITLE },
			{ property: "og:description", content: SITE_DESCRIPTION },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", href: "/logo.png" },
		],
		scripts: [
			{
				src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2572200153117332",
			},
			{
				src: "https://www.googletagmanager.com/gtag/js?id=G-2M6PMT6Z3R",
			},
		],
	}),
	shellComponent: RootLayout,
})

const themeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme') || 'system';
      const isDark = theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', isDark);
    } catch (e) {}
  })();
`

function RootLayout() {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				<ScriptOnce>{themeScript}</ScriptOnce>
			</head>
			<body className="flex min-h-screen flex-col">
				<Header />
				<main className="mt-10 mb-4 grow">
					<Outlet />
				</main>
				<Footer />
				<Toaster richColors position="top-center" closeButton />
				<Scripts />
				<TanStackDevtools
					config={{ position: "bottom-left" }}
					eventBusConfig={{ connectToServerBus: true }}
					plugins={[
						{
							name: "TanStack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						{
							name: "TanStack Query",
							render: <ReactQueryDevtools />,
						},
					]}
				/>
			</body>
			{IN_DEVELOPMENT && <ReactScan />}
		</html>
	)
}
