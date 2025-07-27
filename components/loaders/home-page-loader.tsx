import GridSection from "@/components/grid-section/grid-section"
import HeroSection from "@/components/hero-section/hero-section"
import GridLoader from "@/components/loaders/grid-loader"
import GridPaginationLoader from "@/components/loaders/grid-pagination-loader"
import QuestFilterLoader from "@/components/loaders/quest-filter-loader"

export default function HomeLoader() {
	return (
		<div className="container flex flex-col items-center justify-center gap-12">
			<HeroSection />
			<GridSection title="Main Quests">
				<QuestFilterLoader filters={["Game", "Difficulty"]} />
				<GridLoader />
				<GridPaginationLoader />
			</GridSection>
		</div>
	)
}
