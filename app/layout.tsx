import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/utils/constants";

interface LayoutProps {
  children: React.ReactNode
}

const inter = Inter({ 
  subsets: ["latin"]
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
          <Navbar />
          <main className="mt-10 mb-4">
          { children }
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
