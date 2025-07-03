import type { Metadata } from "next"
import { Suspense } from "react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import GridSection from "@/components/grid-section/grid-section"
import GridLoader from "@/components/loaders/grid-loader"
import QuestFilterLoader from "@/components/loaders/quest-filter-loader"
import { SideQuestFilters } from "@/components/quest-filters/quest-filters"
import { SideQuestGrid } from "@/components/quest-grid/quest-grid"
import { env } from "@/env"
import { GLOBAL_OG_PROPS } from "@/utils/constants"

export const metadata: Metadata = {
	title: "Side Quests",
	description:
		"Learn how to complete hidden Side Quests/Easter Eggs in COD Zombies with our detailed step-by-step guides.",
	openGraph: {
		...GLOBAL_OG_PROPS.openGraph,
		title: "Side Quests",
		description:
			"Learn how to complete hidden Side Quests/Easter Eggs in COD Zombies with our detailed step-by-step guides.",
		url: "/side-quests",
	},
	twitter: {
		title: "Side Quests",
		description:
			"Learn how to complete hidden Side Quests/Easter Eggs in COD Zombies with our detailed step-by-step guides.",
		card: "summary_large_image",
	},
	alternates: {
		canonical: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests`,
	},
}

export default function SideQuests() {
	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Side Quests", href: "/side-quests" }]} />
				<GridSection title="Side Quests">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Discover the hidden secrets and rewards beyond the main story.
					</p>
					<Suspense fallback={<QuestFilterLoader />}>
						<SideQuestFilters />
					</Suspense>
					<Suspense fallback={<GridLoader />}>
						<SideQuestGrid />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
}
