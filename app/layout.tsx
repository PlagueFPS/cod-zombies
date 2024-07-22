import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants";
import Footer from "@/components/Footer/Footer";

interface LayoutProps {
  children: React.ReactNode
}

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap'
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={ inter.className }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="mt-28 xl:mt-10 mb-4 flex-grow">
              { children }
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
