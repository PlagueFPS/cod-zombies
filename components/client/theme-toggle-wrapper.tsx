"use client"
import dynamic from "next/dynamic"

import ThemeToggleLoader from "@/components/server/theme-toggle-loader"

// dynamic import to avoid hydration error for theme based styles
const ThemeToggle = dynamic(() => import("@/components/client/theme-toggle"), {
	ssr: false,
	loading: () => <ThemeToggleLoader />,
})

export function ThemeToggleWrapper({ className }: { className?: string }) {
	return <ThemeToggle className={className} />
}
