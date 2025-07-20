import "./globals.css"
import type { Metadata, Viewport } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { BotIdClient } from "botid/client"
import { Geist } from "next/font/google"
import { HashLinkHandler } from "@/components/custom-link/custom-link"
import Header from "@/components/header/header"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/contexts/theme-provider"
import { env } from "@/env"
import { GLOBAL_OG_PROPS, PROTECTED_ROUTES, SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants"

interface LayoutProps {
	children: React.ReactNode
}

export const metadata: Metadata = {
	metadataBase: new URL(`${env.NEXT_PUBLIC_WEBSITE_URL}`),
	title: {
		template: `%s - ${SITE_TITLE}`,
		default: SITE_TITLE,
	},
	description: SITE_DESCRIPTION,
	creator: "Angel Pichardo",
	verification: {
		google: "wgrEcrtUWVglsvPl05UfwC8pqkk8KfP-uQellDbz-gs",
	},
	category: "gaming",
	openGraph: {
		...GLOBAL_OG_PROPS.openGraph,
		title: {
			template: `%s - ${SITE_TITLE}`,
			default: SITE_TITLE,
		},
		description: SITE_DESCRIPTION,
		url: "/",
	},
	twitter: {
		title: {
			template: `%s - ${SITE_TITLE}`,
			default: SITE_TITLE,
		},
		description: SITE_DESCRIPTION,
		card: "summary_large_image",
	},
}

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#09090b" },
	],
}

const geist = Geist({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist",
})

export default function RootLayout({ children }: LayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<BotIdClient protect={PROTECTED_ROUTES} />
			</head>
			<body
				className={`${geist.className} ${geist.variable} flex min-h-dvh flex-col [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb:hover]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2 `}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					{children}
					<Toaster richColors position="top-center" closeButton />
				</ThemeProvider>
				<Analytics debug={false} />
				<SpeedInsights debug={false} />
				<HashLinkHandler />
				<GoogleAnalytics gaId="G-2M6PMT6Z3R" />
			</body>
		</html>
	)
}
