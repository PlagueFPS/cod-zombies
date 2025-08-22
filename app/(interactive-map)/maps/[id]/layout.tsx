import { MapSettingsProvider } from "@/contexts/interactive-map-settings"

// Opt-out of PPR since it contains no dynamic server-streamed content
// Will use SSG instead since child segments use generateStaticParams
export const experimental_ppr = false

export default function InteractiveMapLayout({ children }: LayoutProps<"/maps/[id]">) {
	return <MapSettingsProvider>{children}</MapSettingsProvider>
}
