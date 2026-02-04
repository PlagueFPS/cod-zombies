import InteractiveMapLoader from "@/components/server/interactive-map-loader"
import SidebarLoader from "@/components/server/sidebar-loader"

export default function InteracitveMapLoading() {
	return (
		<div className="flex">
			<SidebarLoader />
			<InteractiveMapLoader />
		</div>
	)
}
