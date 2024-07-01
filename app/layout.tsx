import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { ThemeProvider } from "@/contexts/ThemeProvider";

interface LayoutProps {
  children: React.ReactNode
}

const manrope = Manrope({ 
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Cod Zombies Guides",
  description: "Unlock the secrets of Call of Duty Zombies by reading our comprehensive guides to the most challenging and rewarding easter eggs in the Call of Duty Zombies universe",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={ manrope.className }>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="mt-20 mb-4">
          { children }
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
