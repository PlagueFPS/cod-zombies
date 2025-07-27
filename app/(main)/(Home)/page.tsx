import type { Metadata } from "next"
import { Suspense } from "react"
import GridSection from "@/components/grid-section/grid-section"
import HeroSection from "@/components/hero-section/hero-section"
import GridLoader from "@/components/loaders/grid-loader"
import QuestFilterLoader from "@/components/loaders/quest-filter-loader"
import { MainQuestFilters } from "@/components/quest-filters/quest-filters"
import { MainQuestGrid } from "@/components/quest-grid/quest-grid"
import { env } from "@/env"

export const metadata: Metadata = {
	alternates: {
		canonical: `${env.NEXT_PUBLIC_WEBSITE_URL}`,
	},
}

export default function Home() {
	return (
		<div className="container flex flex-col items-center justify-center gap-12">
			<HeroSection />
			<GridSection title="Main Quests">
				<Suspense fallback={<QuestFilterLoader filters={["Game", "Difficulty"]} />}>
					<MainQuestFilters />
				</Suspense>
				<Suspense fallback={<GridLoader />}>
					<MainQuestGrid />
				</Suspense>
			</GridSection>
		</div>
	)
}
