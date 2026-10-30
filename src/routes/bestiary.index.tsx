import { createFileRoute } from "@tanstack/react-router"
import { Predicate, Option, Array as Arr, String as Str } from "effect"
import { BestiaryGrid } from "@/components/bestiary-grid"
import { Breadcrumbs } from "@/components/breadcrumbs"
import {
	GridFilters,
	toFilterGroup,
	type FilterGroup,
	type FilterOption,
} from "@/components/grid-filters"
import { GridPagination } from "@/components/grid-pagination"
import { GridSection } from "@/components/grid-section"
import { GridSort } from "@/components/grid-sort"
import { getAmmoModByKey } from "@/data/ammo-mods"
import { getGames } from "@/data/games"
import { getMaps } from "@/data/maps"
import { getZombieSortOptions, getZombies, type Zombie } from "@/data/zombies"
import {
	applyFilters,
	applySort,
	paginate,
	type FilterSpec,
	type SortSpec,
} from "@/utils/filter-helpers"
import { encodeZombie } from "@/utils/rsc-wire"
import {
	createSeoTitle,
	slugify,
	sortDates,
	sortZombieSpeeds,
	sortZombieTypes,
} from "@/utils/shared-functions"
import { StandardBestiarySearchParamsSchema } from "@/utils/validation-schemas"

export const Route = createFileRoute("/bestiary/")({
	validateSearch: StandardBestiarySearchParamsSchema,
	loaderDeps: ({ search }) => ({
		game: search.game,
		map: search.map,
		type: search.type,
		weakness: search.weakness,
		sort: search.sort,
		page: search.page ?? 1,
	}),
	loader: ({ deps, context }) => {
		const serverUrl = context.serverUrl
		const title = createSeoTitle("Bestiary")

		const description =
			"Discover the weaknesses, behavior, and strategies for defeating all enemy types in Call of Duty: Zombies."

		const allZombies = getZombies()

		const games = Arr.map(getGames(), game => ({
			value: game.id,
			label: game.title,
		}))

		const maps = Arr.map(getMaps(), map => ({
			value: map.id,
			label: map.title,
		}))

		const typeFilters = Arr.map(
			Array.from(new Set(Arr.map(allZombies, zombie => zombie.type).sort(sortZombieTypes))),
			type => ({
				value: slugify(type),
				label: type,
			}),
		)

		const weaknessFilters = Arr.flatMap(
			Array.from(new Set(Arr.flatMap(allZombies, zombie => zombie.elementalWeakness))),
			weakness =>
				Option.match(getAmmoModByKey(weakness), {
					onSome: ammoMod => [
						{
							value: weakness,
							label: ammoMod.title,
						},
					],
					onNone: () => [],
				}),
		)

		const filterSpecs: FilterSpec<Zombie>[] = [
			{
				values: deps.game,
				match: (z, id) => z.id === "zombie" || Arr.some(z.games, game => game === id),
			},
			{
				values: deps.map,
				match: (z, id) => z.id === "zombie" || Arr.some(z.maps, map => map === id),
			},
			{
				values: deps.type,
				match: (z, slug) => Str.toLowerCase(z.type) === slug,
			},
			{
				values: deps.weakness,
				match: (z, slug) => Arr.some(z.elementalWeakness, weakness => weakness === slug),
			},
		]

		const sortSpecs: SortSpec<Zombie>[] = [
			{
				key: "latest",
				compare: (a, b) => sortDates(b.releaseDate, a.releaseDate),
			},
			{
				key: "oldest",
				compare: (a, b) => sortDates(a.releaseDate, b.releaseDate),
			},
			{ key: "type-asc", compare: (a, b) => sortZombieTypes(a.type, b.type) },
			{ key: "type-desc", compare: (a, b) => sortZombieTypes(b.type, a.type) },
			{ key: "speed-asc", compare: (a, b) => sortZombieSpeeds(a.speed, b.speed) },
			{ key: "speed-desc", compare: (a, b) => sortZombieSpeeds(b.speed, a.speed) },
		]

		const filtered = applyFilters(allZombies, filterSpecs)
		const sorted = applySort(filtered, deps.sort, sortSpecs, "latest")
		const pageResult = paginate(sorted, deps.page)

		return {
			serverUrl,
			title,
			description,
			zombies: Arr.map(pageResult.items, encodeZombie),
			totalCount: pageResult.totalCount,
			pageSize: pageResult.pageSize,
			sortOptions: getZombieSortOptions(),
			games,
			maps,
			typeFilters,
			weaknessFilters,
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{ title: loaderData?.title },
			{ name: "description", content: loaderData?.description },
			{ property: "og:title", content: loaderData?.title },
			{ property: "og:description", content: loaderData?.description },
			{ property: "og:url", content: `${loaderData?.serverUrl}/bestiary` },
			{
				property: "og:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-bestiary.png`,
			},
			{ property: "og:image:height", content: "1200" },
			{ property: "og:image:width", content: "630" },
			{ property: "og:image:type", content: "image/png" },
			{ property: "twitter:title", content: loaderData?.title },
			{ property: "twitter:description", content: loaderData?.description },
			{
				property: "twitter:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-bestiary.png`,
			},
		],
		links: [{ rel: "canonical", href: `${loaderData?.serverUrl}/bestiary` }],
	}),
	component: Bestiary,
	staleTime: Infinity,
})

function Bestiary() {
	const data = Route.useLoaderData()
	const { game, map, type, weakness, page } = Route.useSearch()
	const navigate = Route.useNavigate()

	const groups: FilterGroup[] = [
		toFilterGroup("Type", data.typeFilters),
		toFilterGroup("Weakness", data.weaknessFilters),
		toFilterGroup("Game", data.games),
		toFilterGroup("Map", data.maps),
	]

	const filterValue: FilterOption[] = []

	for (const g of groups) {
		const values = Arr.filter(
			g.items,
			i =>
				(Predicate.isNotNullish(type) && Arr.some(type, t => t === i.value)) ||
				(Predicate.isNotNullish(weakness) && Arr.some(weakness, w => w === i.value)) ||
				(Predicate.isNotNullish(map) && Arr.some(map, d => d === i.value)) ||
				(Predicate.isNotNullish(game) && Arr.some(game, g => g === i.value)),
		)

		if (values.length > 0) filterValue.push(...values)
	}

	const onFilterChange = (next: FilterOption[]) => {
		const selected = new Map<string, string[]>()

		for (const g of groups) {
			const matched = Arr.flatMap(g.items, item =>
				Arr.some(next, selected => selected.value === item.value) ? [item.value] : [],
			)

			if (matched.length > 0) {
				selected.set(slugify(g.label), matched)
			}
		}

		void navigate({
			search: prev => ({
				...prev,
				page: undefined,
				game: selected.get("game"),
				map: selected.get("map"),
				type: selected.get("type"),
				weakness: selected.get("weakness"),
			}),
			replace: true,
		})
	}

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Bestiary", href: "/bestiary" }]} />
				<GridSection title="Bestiary">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Discover the weaknesses, behavior, and strategies for defeating all enemy types in Call
						of Duty: Zombies.
					</p>
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<GridFilters
							groups={groups}
							value={filterValue}
							onValueChange={onFilterChange}
							placeholder="Type, Game, Map, or Weakness"
						/>
						<GridSort from="/bestiary/" options={data.sortOptions} />
					</div>
					<BestiaryGrid zombies={data.zombies} />
					<GridPagination
						from="/bestiary/"
						page={page ?? 1}
						pageSize={data.pageSize}
						totalCount={data.totalCount}
					/>
				</GridSection>
			</div>
		</div>
	)
}
