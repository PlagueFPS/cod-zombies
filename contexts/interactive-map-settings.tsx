"use client"
import { createContext, use } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

const defaultSettings = {
	markers: {
		iconSize: 32,
		opacity: 1, // 100% opacity
	},
	popups: {
		disableGradients: false,
		disableAnimations: false,
	},
}

export type TMapSettings = typeof defaultSettings

interface IInteractiveMapSettings {
	settings: TMapSettings
	updateSettings: (newSettings: Partial<TMapSettings>) => void
	resetSettings: () => void
}

const MapSettingsContext = createContext<IInteractiveMapSettings>({
	settings: defaultSettings,
	updateSettings: () => {},
	resetSettings: () => {},
})

export function MapSettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useLocalStorage("map-settings", defaultSettings)
	
	const updateSettings = (newSettings: Partial<typeof defaultSettings>) => {
		setSettings(current => ({
			...current,
			...newSettings,
		}))
	}

	const resetSettings = () => {
		setSettings(defaultSettings)
	}

	return (
		<MapSettingsContext value={{ settings, updateSettings, resetSettings }}>
			{children}
		</MapSettingsContext>
	)
}

export const useMapSettings = () => {
	const context = use(MapSettingsContext)
	if (!context) {
		throw new Error("useMapSettings must be used within a MapSettingsProvider")
	}

	return context
}
