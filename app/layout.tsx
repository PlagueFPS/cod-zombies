import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist } from 'next/font/google'
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { env } from "@/env";
import { GLOBAL_OG_PROPS, IN_DEVELOPMENT, SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import DraftMode from "@/components/DraftMode/DraftMode";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GoogleAnalytics } from "@next/third-parties/google";

interface LayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  metadataBase: new URL(`${env.NEXT_PUBLIC_WEBSITE_URL}`),
  title: {
    template: `%s - ${SITE_TITLE}`,
    default: SITE_TITLE
  },
  description: SITE_DESCRIPTION,
  creator: 'Angel Pichardo',
  verification: {
    google: 'wgrEcrtUWVglsvPl05UfwC8pqkk8KfP-uQellDbz-gs'
  },
  category: "gaming",
  openGraph: {
    ...GLOBAL_OG_PROPS.openGraph,
    title: {
      template: `%s - ${SITE_TITLE}`,
      default: SITE_TITLE
    },
    description: SITE_DESCRIPTION,
    url: '/',
  },
  twitter: {
    title: {
      template: `%s - ${SITE_TITLE}`,
      default: SITE_TITLE
    },
    description: SITE_DESCRIPTION,
    card: 'summary_large_image',
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
}

const geist = Geist({
  subsets: ['latin'],
  display: "swap",
  variable: "--font-geist"
})

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ `${geist.className} ${geist.variable} flex flex-col min-h-dvh` }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="mt-10 mb-4 grow" role="main" tabIndex={ -1 }>
            { children }
          </main>
          <Footer />
          <Toaster richColors position="top-center" closeButton />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-2M6PMT6Z3R" />
        {/* Custom draft mode toggle for development */}
        { IN_DEVELOPMENT && (
          <Suspense fallback={<Skeleton className="rounded-full size-10" />}>
            <DraftMode />
          </Suspense>
          )}
      </body>
    </html>
  );
}
