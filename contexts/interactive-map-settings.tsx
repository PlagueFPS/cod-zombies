"use client"
import { createContext, use } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

const STORAGE_KEY = "map-settings"
const CURRENT_VERSION = 1

const DEFAULT_SETTINGS = {
	/**Current version of the settings */
	_version: CURRENT_VERSION,
	markers: {
		/**
		 * The size of the icon for each marker in pixels.
		 * @default 32
		 */
		iconSize: 32,
		/**
		 * The opacity of the marker icons. 0 is fully transparent, 1 is fully opaque.
		 * @default 1
		 */
		opacity: 1, // 100% opacity
	},
	popups: {
		/**
		 * Disable the gradient background of popups.
		 * @default false
		 */
		disableGradients: false,
		/**
		 * Disable the animation entrance and exit animation of popups.
		 * @default false
		 */
		disableAnimations: false,
	},
	general: {
		/**
		 * Disable the map/marker zoom animation.
		 * @default false
		 */
		disableZoomAnimation: false,
		/**
		 * Disable the flyTo animation when the user clicks on a new marker.
		 * @default false
		 */
		disableFlyToAnimation: false,
	},
}

export type TMapSettings = typeof DEFAULT_SETTINGS

interface IMapSettingsContext {
	defaultSettings: TMapSettings
	settings: TMapSettings
	updateSettings: (newSettings: Partial<TMapSettings>) => void
	resetSettings: () => void
}

const MapSettingsContext = createContext<IMapSettingsContext>({
	defaultSettings: DEFAULT_SETTINGS,
	settings: DEFAULT_SETTINGS,
	updateSettings: () => {},
	resetSettings: () => {},
})

// This migration does not handle any changes to existing props (renaming, deletion, data structure changes, etc.)
// Current version is only meant for adding new props
// If a more robust migration is needed in the future, this function MUST be changed
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
	const migratedSettings =
		settings._version !== CURRENT_VERSION ? migrateSettings(settings) : settings

	if (settings._version !== migratedSettings._version) {
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
		<MapSettingsContext
			value={{ defaultSettings: DEFAULT_SETTINGS, settings, updateSettings, resetSettings }}
		>
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
