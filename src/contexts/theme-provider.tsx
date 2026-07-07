import { createContext, useContext, useLayoutEffect, useRef, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
	children: React.ReactNode
	defaultTheme?: Theme
	storageKey?: string
}

type ThemeProviderState = {
	theme: Theme
	resolvedTheme: "light" | "dark"
	setTheme: (theme: Theme) => void
}

function resolvedFromTheme(theme: Theme): "light" | "dark" {
	if (theme === "dark") return "dark"
	if (theme === "light") return "light"
	if (typeof window === "undefined") return "light"
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function ssrResolvedPlaceholder(defaultTheme: Theme): "light" | "dark" {
	if (defaultTheme === "dark") return "dark"
	if (defaultTheme === "light") return "light"
	return "light"
}

function applyThemeToDocument(theme: Theme) {
	const isDark =
		theme === "dark" ||
		(theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
	document.documentElement.classList.toggle("dark", isDark)
}

const ThemeProviderContext = createContext<ThemeProviderState | null>(null)

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "theme",
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(defaultTheme)
	const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
		ssrResolvedPlaceholder(defaultTheme),
	)

	const isFirstLayout = useRef(true)

	useLayoutEffect(() => {
		const sync = (next: Theme) => {
			applyThemeToDocument(next)
			setResolvedTheme(resolvedFromTheme(next))
		}

		if (isFirstLayout.current) {
			isFirstLayout.current = false
			const stored = (localStorage.getItem(storageKey) as Theme) || defaultTheme
			setThemeState(stored)
			sync(stored)
			return
		}

		sync(theme)
	}, [theme, storageKey, defaultTheme])

	const setTheme = (next: Theme) => {
		if (typeof window !== "undefined") {
			localStorage.setItem(storageKey, next)
		}
		setThemeState(next)
	}

	const value: ThemeProviderState = {
		theme,
		resolvedTheme,
		setTheme,
	}

	return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext)

	if (!context) throw new Error("useTheme must be used within a ThemeProvider")

	return context
}
