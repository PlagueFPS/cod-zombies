import type { MapId } from "@/map-configs"
import { MapSettingsProvider } from "@/contexts/interactive-map-settings"

interface IInteractiveMapLayoutProps {
	children: React.ReactNode
	params: Promise<{ id: MapId }>
}

export default function InteractiveMapLayout({ children }: IInteractiveMapLayoutProps) {
	return <MapSettingsProvider>{children}</MapSettingsProvider>
}
