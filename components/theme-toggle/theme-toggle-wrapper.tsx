"use client"
import dynamic from "next/dynamic"
import ThemeToggleLoader from "../loaders/theme-toggle-loader"

// dynamic import to avoid hydration error for theme based styles
const ThemeToggle = dynamic(() => import("@/components/theme-toggle/theme-toggle"), {
	ssr: false,
	loading: () => <ThemeToggleLoader />,
})

export default function ThemeToggleWrapper({ className }: { className?: string }) {
	return <ThemeToggle className={className} />
}
