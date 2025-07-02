import GridSection from "@/components/grid-section/grid-section"
import HeroSection from "@/components/hero-section/hero-section"
import GridLoader from "@/components/loaders/grid-loader"
import GridPaginationLoader from "@/components/loaders/grid-pagination-loader"
import MapFiltersLoader from "@/components/loaders/map-filters-loader"

export default function HomeLoader() {
	return (
		<div className="container flex flex-col items-center justify-center gap-12">
			<HeroSection />
			<GridSection title="Main Quests">
				<MapFiltersLoader />
				<GridLoader />
				<GridPaginationLoader />
			</GridSection>
		</div>
	)
}
