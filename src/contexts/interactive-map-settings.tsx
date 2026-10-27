import { Effect, Predicate, Schema } from "effect"
import { createContext, useContext } from "react"
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
		opacity: 1,
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

const SettingsSchema = Schema.Struct({
	_version: Schema.Int.pipe(
		Schema.withDecodingDefaultKey(Effect.succeed(CURRENT_VERSION), { encodingStrategy: "omit" }),
	),
	markers: Schema.Struct({ iconSize: Schema.Finite, opacity: Schema.Finite }),
	popups: Schema.Struct({ disableGradients: Schema.Boolean, disableAnimations: Schema.Boolean }),
	general: Schema.Struct({
		disableZoomAnimation: Schema.Boolean,
		disableFlyToAnimation: Schema.Boolean,
	}),
})

/** Type representing validated map settings. */
export type TMapSettings = typeof SettingsSchema.Type

/** Union type representing all nested setting paths */
export type TSettingPath = {
	[K in keyof TMapSettings]: TMapSettings[K] extends object
		? {
				[P in keyof TMapSettings[K]]: `${K & string}.${P & string}`
			}[keyof TMapSettings[K]]
		: never
}[keyof TMapSettings]

interface IMapSettingsContext {
	/** Default settings */
	defaultSettings: TMapSettings
	/** Current map settings */
	settings: TMapSettings
	/** Updates the current map settings */
	updateSettings: (newSettings: Partial<TMapSettings>) => void
	/** Resets the current map settings to default */
	resetSettings: () => void
}

const MapSettingsContext = createContext<IMapSettingsContext>({
	defaultSettings: DEFAULT_SETTINGS,
	settings: DEFAULT_SETTINGS,
	updateSettings: () => {},
	resetSettings: () => {},
})

export function MapSettingsProvider({ children }: { children: React.ReactNode }) {
	const [settings, setSettings] = useLocalStorage(STORAGE_KEY, DEFAULT_SETTINGS, SettingsSchema)

	if (settings._version < CURRENT_VERSION) {
		setSettings(prev => ({ ...prev, _version: CURRENT_VERSION }))
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
	const context = useContext(MapSettingsContext)

	if (Predicate.isNullish(context)) {
		throw new Error("useMapSettings must be used within a MapSettingsProvider")
	}

	return context
}
