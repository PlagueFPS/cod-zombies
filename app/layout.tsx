import "./globals.css"
import type { Metadata, Viewport } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { HashLinkHandler } from "@/components/custom-link/custom-link"
import Footer from "@/components/footer/footer"
import Header from "@/components/header/header"
import ReactScanWrapper from "@/components/react-scan/react-scan-wrapper"
import { Toaster } from "@/components/ui/sonner"
import { KeyboardShortcutsProvider } from "@/contexts/keyboard-shortcuts"
import { ThemeProvider } from "@/contexts/theme-provider"
import { GLOBAL_OG_PROPS, IN_DEVELOPMENT, SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants"
import { getServerUrl } from "@/utils/functions"

interface LayoutProps {
	children: React.ReactNode
}

export const metadata: Metadata = {
	metadataBase: new URL(getServerUrl()),
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

const geistMono = Geist_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist-mono",
})

export default function RootLayout({ children }: LayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			{IN_DEVELOPMENT && <ReactScanWrapper />}
			<body
				className={`${geist.className} ${geist.variable} ${geistMono.variable} flex min-h-dvh flex-col [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500 dark:[&::-webkit-scrollbar-thumb:hover]:bg-neutral-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-400 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-2`}
			>
				<KeyboardShortcutsProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Header />
						<main className="mt-10 mb-4 grow">{children}</main>
						<Footer />
						<Toaster richColors position="top-center" closeButton />
					</ThemeProvider>
					<HashLinkHandler />
					<GoogleAnalytics gaId="G-2M6PMT6Z3R" />
					<Script
						crossOrigin="anonymous"
						src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2572200153117332"
					/>
				</KeyboardShortcutsProvider>
			</body>
		</html>
	)
}
