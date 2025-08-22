import { MapSettingsProvider } from "@/contexts/interactive-map-settings"

export const experimental_ppr = false

export default function InteractiveMapLayout({ children }: LayoutProps<"/maps/[id]">) {
	return <MapSettingsProvider>{children}</MapSettingsProvider>
}
