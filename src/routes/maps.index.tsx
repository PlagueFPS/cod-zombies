import { createFileRoute } from "@tanstack/react-router"
import { Option } from "effect"
import { Breadcrumbs } from "@/components/breadcrumbs"
import {
	GridFilters,
	toFilterGroup,
	type FilterGroup,
	type FilterOption,
} from "@/components/grid-filters"
import { GridSection } from "@/components/grid-section"
import { MapsGrid } from "@/components/maps-grid"
import { getGameByKey } from "@/data/games"
import { getInteractiveMaps, type InteractiveMap } from "@/data/interactive-map"
import { applyFilters, type FilterSpec } from "@/utils/filter-helpers"
import { encodeInteractiveMap } from "@/utils/rsc-wire"
import { createSeoTitle, slugify } from "@/utils/shared-functions"
import { StandardMapsSearchParamsSchema } from "@/utils/validation-schemas"

export const Route = createFileRoute("/maps/")({
	validateSearch: StandardMapsSearchParamsSchema,
	loaderDeps: ({ search }) => ({
		game: search.game,
	}),
	loader: ({ deps, context }) => {
		const serverUrl = context.serverUrl
		const title = createSeoTitle("Interactive Maps")
		const description =
			"Interactive maps for Call of Duty: Zombies showcasing locations of weapons, perks, objectives, and more to help guide your experience."

		const allMaps = getInteractiveMaps()

		const filterSpecs: FilterSpec<InteractiveMap>[] = [
			{
				values: deps.game,
				match: (m, id) => m.game === id,
			},
		]

		const filtered = applyFilters(allMaps, filterSpecs)

		const gameFilters = [...new Set(allMaps.map(m => m.game))].map(gameKey => {
			const { id, title: gameTitle } = getGameByKey(gameKey).pipe(Option.getOrThrow)
			return {
				value: id,
				label: gameTitle,
			}
		})

		return {
			serverUrl,
			title,
			description,
			maps: filtered.map(encodeInteractiveMap),
			gameFilters,
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{ title: loaderData?.title },
			{ name: "description", content: loaderData?.description },
			{ property: "og:title", content: loaderData?.title },
			{ property: "og:description", content: loaderData?.description },
			{ property: "og:url", content: `${loaderData?.serverUrl}/maps` },
			{
				property: "og:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-maps.png`,
			},
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:type", content: "image/png" },
			{ property: "twitter:title", content: loaderData?.title },
			{ property: "twitter:description", content: loaderData?.description },
			{
				property: "twitter:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-maps.png`,
			},
		],
		links: [{ rel: "canonical", href: `${loaderData?.serverUrl}/maps` }],
	}),
	component: Maps,
	staleTime: Infinity,
})

function Maps() {
	const data = Route.useLoaderData()
	const { game } = Route.useSearch()
	const navigate = Route.useNavigate()

	const groups: FilterGroup[] = [toFilterGroup("Game", data.gameFilters)]

	const filterValue: FilterOption[] = []
	for (const g of groups) {
		const values = g.items.filter(i => game?.some(g => g === i.value))

		if (values.length > 0) filterValue.push(...values)
	}

	const onFilterChange = (next: FilterOption[]) => {
		const selected = new Map<string, string[]>()
		for (const g of groups) {
			const matched = g.items.filter(i => next.some(n => n.value === i.value)).map(i => i.value)
			if (matched.length > 0) {
				selected.set(slugify(g.label), matched)
			}
		}
		void navigate({
			search: prev => ({
				...prev,
				game: selected.get("game"),
			}),
			replace: true,
		})
	}

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Maps", href: "/maps" }]} />
				<GridSection title="Interactive Maps" className="mb-10">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Browse our collection of interactive maps showcasing key spawn points, locations, and
						more.
					</p>
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<GridFilters
							groups={groups}
							value={filterValue}
							onValueChange={onFilterChange}
							placeholder="Game"
						/>
					</div>
					<MapsGrid maps={data.maps} />
				</GridSection>
			</div>
		</div>
	)
}
