import { MapSettingsProvider } from "@/contexts/interactive-map-settings"

export default function InteractiveMapLayout({ children }: LayoutProps<"/maps/[id]">) {
	return <MapSettingsProvider>{children}</MapSettingsProvider>
}
