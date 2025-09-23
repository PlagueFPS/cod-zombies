import InteractiveMapLoader from "@/components/loaders/interactive-map-loader"
import SidebarLoader from "@/components/loaders/sidebar-loader"

export default function InteracitveMapLoading() {
	return (
		<div className="flex">
			<SidebarLoader />
			<InteractiveMapLoader />
		</div>
	)
}
