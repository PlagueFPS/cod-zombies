import type { Metadata } from "next"
import { Effect, Option } from "effect"
import { Suspense } from "react"
import Breadcrumbs from "@/components/breadcrumbs/breadcrumbs"
import GridSection from "@/components/grid-section/grid-section"
import InteractiveMapsFilters from "@/components/interactive-map/interactive-map-filters"
import MapsGrid from "@/components/interactive-map/maps-grid"
import FilterLoader from "@/components/loaders/filter-loader"
import GridLoader from "@/components/loaders/grid-loader"
import { getInteractiveMaps } from "@/data/interactive-map"
import { BasePage } from "@/lib/layers"
import { GLOBAL_OG_PROPS } from "@/utils/constants"

export const metadata: Metadata = {
	title: "Interactive Maps",
	description:
		"Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience.",
	openGraph: {
		...GLOBAL_OG_PROPS.openGraph,
		title: "Interactive Maps",
		description:
			"Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience.",
		url: "/maps",
	},
	twitter: {
		title: "Interactive Maps",
		description:
			"Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience.",
		card: "summary_large_image",
	},
}

const MapsPage = Effect.fn("MapsPage")(function* () {
	const maps = yield* getInteractiveMaps().pipe(
		Effect.map(maps => maps.map(m => ({ ...m, state: Option.getOrNull(m.state) }))),
	)
	const availableGames = new Set(maps.map(map => map.game))

	return (
		<div className="w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Maps", href: "/maps" }]} />
				<GridSection title="Interactive Maps" className="mb-10">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Browse our collection of interactive maps showcasing key spawn points, locations, and
						more.
					</p>
					<Suspense fallback={<FilterLoader filters={["Game"]} />}>
						<InteractiveMapsFilters availableGames={availableGames} />
					</Suspense>
					<Suspense fallback={<GridLoader />}>
						<MapsGrid maps={maps} />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
})

export default BasePage.build(MapsPage)
