import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { GLOBAL_OG_PROPS, SITE_DESCRIPTION, SITE_TITLE, WEBSITE_URL } from "@/utils/constants";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode
}

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(`${WEBSITE_URL}`),
  title: {
    template: `%s - ${SITE_TITLE}`,
    default: SITE_TITLE
  },
  description: SITE_DESCRIPTION,
  creator: 'Angel Pichardo',
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
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
  ]
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={ `${inter.className} flex flex-col min-h-dvh` }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="mt-10 mb-4 flex-grow">
            { children }
          </main>
          <Footer />
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
