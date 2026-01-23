import type { Metadata } from "next"
import { Option } from "effect"
import { Suspense } from "react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import GridSection from "@/components/grid-section/grid-section"
import GridLoader from "@/components/loaders/grid-loader"
import MainQuestFilters from "@/components/quest-filters/main-quest-filters"
import QuestGridClient from "@/components/quest-grid/quest-grid"
import { getMainQuests } from "@/data/main-quests"
import { GLOBAL_OG_PROPS } from "@/utils/constants"
import { getServerUrl } from "@/utils/functions"

export const metadata: Metadata = {
	title: "Main Quests",
	description:
		"Learn how to complete every Main Quest/Easter Egg in COD Zombies with our detailed step-by-step guides.",
	openGraph: {
		...GLOBAL_OG_PROPS.openGraph,
		title: "Main Quests",
		description:
			"Learn how to complete every Main Quest/Easter Egg in COD Zombies with our detailed step-by-step guides.",
		url: "/main-quests",
	},
	twitter: {
		title: "Main Quests",
		description:
			"Learn how to complete every Main Quest/Easter Egg in COD Zombies with our detailed step-by-step guides.",
		card: "summary_large_image",
	},
	alternates: {
		canonical: `${getServerUrl()}/main-quests`,
	},
}

export default function MainQuests() {
	const mainQuests = getMainQuests().map(quest => {
		const { content, state, difficulty, ...rest } = quest
		return {
			...rest,
			state: Option.getOrNull(state),
			difficulty: Option.getOrNull(difficulty),
		}
	})

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Main Quests", href: "/main-quests" }]} />
				<GridSection title="Main Quests">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Unlock the secret stories of Call of Duty: Zombies.
					</p>
					<MainQuestFilters />
					<Suspense fallback={<GridLoader />}>
						<QuestGridClient quests={mainQuests} />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
}
