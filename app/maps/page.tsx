import type { Metadata } from "next"
import { Effect, Option } from "effect"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/client/breadcrumbs"
import { GridFilters } from "@/components/client/grid-filters"
import { MapsGrid } from "@/components/client/maps-grid"
import { FilterLoader } from "@/components/server/filter-loader"
import { GridLoader } from "@/components/server/grid-loader"
import { GridSection } from "@/components/server/grid-section"
import { getGameByKey } from "@/data/games"
import { getInteractiveMaps } from "@/data/interactive-map"
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

export default async function MapsPage() {
	return await Effect.runPromise(mapsPageUI())
}

const mapsPageUI = Effect.fn("MapsPage")(function* () {
	const maps = yield* getInteractiveMaps().pipe(
		Effect.map(maps => maps.map(m => ({ ...m, state: Option.getOrNull(m.state) }))),
	)
	const gameFilters = [...new Set(maps.map(m => m.game))].map(gameKey => {
		const { id, title } = getGameByKey(gameKey)
		return {
			value: id,
			label: title,
		}
	})

	return (
		<div className="w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Maps", href: "/maps" }]} />
				<GridSection title="Interactive Maps" className="mb-10">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Browse our collection of interactive maps showcasing key spawn points, locations, and
						more.
					</p>
					<Suspense fallback={<FilterLoader placeholder="Game" />}>
						<GridFilters type="map" games={gameFilters} placeholder="Game" />
					</Suspense>
					<Suspense fallback={<GridLoader />}>
						<MapsGrid maps={maps} />
					</Suspense>
				</GridSection>
			</div>
		</div>
	)
})
