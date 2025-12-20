import GridSection from "@/components/grid-section/grid-section"
import HeroSection from "@/components/hero-section/hero-section"
import FilterLoader from "@/components/loaders/filter-loader"
import GridLoader from "@/components/loaders/grid-loader"
import GridPaginationLoader from "@/components/loaders/grid-pagination-loader"

export default function HomeLoader() {
	return (
		<div className="container flex flex-col items-center justify-center gap-12">
			<HeroSection />
			<GridSection title="Main Quests">
				<FilterLoader filters={["Game", "Difficulty"]} />
				<GridLoader />
				<GridPaginationLoader />
			</GridSection>
		</div>
	)
}
