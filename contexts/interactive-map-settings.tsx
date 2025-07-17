"use client"
import { createContext, use } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

const STORAGE_KEY = "map-settings"
const CURRENT_VERSION = 1

const DEFAULT_SETTINGS = {
	_version: CURRENT_VERSION,
	markers: {
		iconSize: 32,
		opacity: 1, // 100% opacity
	},
	popups: {
		disableGradients: false,
		disableAnimations: false,
	},
	general: {
		disableZoomAnimation: false,
		disableFlyToAnimation: false
	}
}

export type TMapSettings = typeof DEFAULT_SETTINGS

interface IInteractiveMapSettings {
	settings: TMapSettings
	updateSettings: (newSettings: Partial<TMapSettings>) => void
	resetSettings: () => void
}

const MapSettingsContext = createContext<IInteractiveMapSettings>({
	settings: DEFAULT_SETTINGS,
	updateSettings: () => {},
	resetSettings: () => {},
})

const migrateSettings = (savedSettings: Partial<TMapSettings>) => {
	if (!savedSettings._version || savedSettings._version >= CURRENT_VERSION) {
		return savedSettings
	}

	const migrated = {
		...DEFAULT_SETTINGS,
		...savedSettings,
		_version: CURRENT_VERSION,
	}

	return migrated
}

export function MapSettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useLocalStorage<TMapSettings>(STORAGE_KEY, DEFAULT_SETTINGS)
	const migratedSettings = settings._version !== CURRENT_VERSION ? migrateSettings(settings) : settings

	if (settings !== migratedSettings) {
		setSettings(prev => ({
			...prev,
			...migratedSettings,
		}))
	}
	
	const updateSettings = (newSettings: Partial<TMapSettings>) => {
		setSettings(current => ({
			...current,
			...newSettings,
		}))
	}

	const resetSettings = () => {
		setSettings(DEFAULT_SETTINGS)
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
