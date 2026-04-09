import type { Metadata } from "next"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/client/breadcrumbs"
import { GridSort } from "@/components/client/grid-sort"
import { QuestGrid } from "@/components/client/quest-grid"
import { GridLoader } from "@/components/server/grid-loader"
import { GridSection } from "@/components/server/grid-section"
import { GridSortLoader } from "@/components/server/grid-sort-loader"
import { SideQuestFilters } from "@/components/server/side-quest-filters"
import { getSideQuestSortOptions, getSideQuests } from "@/data/side-quests"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { encodeSideQuest } from "@/utils/rsc-wire"
import { getServerUrl } from "@/utils/server-functions"

export const metadata: Metadata = {
	title: "Side Quests",
	description:
		"Learn how to complete hidden Side Quests/Easter Eggs in COD Zombies with our detailed step-by-step guides.",
	openGraph: {
		...GLOBAL_OG_PROPS,
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
		canonical: `${getServerUrl()}/side-quests`,
	},
}

export default function SideQuests() {
	const quests = getSideQuests().map(encodeSideQuest)

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Side Quests", href: "/side-quests" }]} />
				<GridSection title="Side Quests">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Discover the hidden secrets and rewards beyond the main story.
					</p>
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<SideQuestFilters />
						<Suspense fallback={<GridSortLoader />}>
							<GridSort options={getSideQuestSortOptions()} />
						</Suspense>
					</div>
					<Suspense fallback={<GridLoader />}>
						<QuestGrid quests={quests} />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
}
