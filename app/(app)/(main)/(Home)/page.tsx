import type { Metadata } from "next"
import { Suspense } from "react"
import GridSection from "@/components/grid-section/grid-section"
import HeroSection from "@/components/hero-section/hero-section"
import GridLoader from "@/components/loaders/grid-loader"
import MainQuestFilters from "@/components/quest-filters/main-quest-filters"
import QuestGridClient from "@/components/quest-grid/quest-grid"
import { getClientMainQuests } from "@/data/main-quests"
import { getServerUrl } from "@/utils/functions"

export const metadata: Metadata = {
	alternates: {
		canonical: `${getServerUrl()}`,
	},
}

export default function Home() {
	const mainQuests = getClientMainQuests()

	return (
		<div className="container flex flex-col items-center justify-center gap-12">
			<HeroSection />
			<GridSection title="Main Quests">
				<MainQuestFilters />
				<Suspense fallback={<GridLoader />}>
					<QuestGridClient quests={mainQuests} />
				</Suspense>
			</GridSection>
		</div>
	)
}
