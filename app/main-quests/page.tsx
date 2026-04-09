import type { Metadata } from "next"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/client/breadcrumbs"
import { GridSort } from "@/components/client/grid-sort"
import { QuestGrid } from "@/components/client/quest-grid"
import { GridLoader } from "@/components/server/grid-loader"
import { GridSection } from "@/components/server/grid-section"
import { GridSortLoader } from "@/components/server/grid-sort-loader"
import { MainQuestFilters } from "@/components/server/main-quest-filters"
import { getMainQuestSortOptions, getMapsWithMainQuest } from "@/data/maps"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { encodeMap } from "@/utils/rsc-wire"
import { getServerUrl } from "@/utils/server-functions"

export const metadata: Metadata = {
	title: "Main Quests",
	description:
		"Learn how to complete all main quests/easter eggs in COD Zombies with our detailed step-by-step guides.",
	openGraph: {
		...GLOBAL_OG_PROPS,
		title: "Main Quests",
		description:
			"Learn how to complete all main quests/easter eggs in COD Zombies with our detailed step-by-step guides.",
		url: "/main-quests",
	},
	twitter: {
		title: "Main Quests",
		description:
			"Learn how to complete all main quests/easter eggs in COD Zombies with our detailed step-by-step guides.",
		card: "summary_large_image",
	},
	alternates: {
		canonical: `${getServerUrl()}/main-quests`,
	},
}

export default function MainQuests() {
	const mainQuests = getMapsWithMainQuest().map(encodeMap)

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Main Quests", href: "/main-quests" }]} />
				<GridSection title="Main Quests">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Discover the main story told from within the mode.
					</p>
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<MainQuestFilters />
						<Suspense fallback={<GridSortLoader />}>
							<GridSort options={getMainQuestSortOptions()} />
						</Suspense>
					</div>
					<Suspense fallback={<GridLoader />}>
						<QuestGrid quests={mainQuests} />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
}
