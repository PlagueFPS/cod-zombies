import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/contexts/ThemeProvider";

interface LayoutProps {
  children: React.ReactNode
}

const inter = Inter({ 
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Cod Zombies Guides",
  description: "Unlock the secrets of Call of Duty Zombies by reading our comprehensive guides to the most challenging and rewarding easter eggs in the Call of Duty Zombies universe",
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
