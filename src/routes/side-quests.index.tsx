import { createFileRoute } from "@tanstack/react-router"
import { Option, Predicate } from "effect"
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
import { QuestGrid } from "@/components/quest-grid"
import { getGames } from "@/data/games"
import { getMapByKey, getMaps } from "@/data/maps"
import { getSideQuestSortOptions, getSideQuests, type SideQuest } from "@/data/side-quests"
import {
	applyFilters,
	applySort,
	paginate,
	type FilterSpec,
	type SortSpec,
} from "@/utils/filter-helpers"
import { encodeSideQuest } from "@/utils/rsc-wire"
import { compareByOptionalSome, createSeoTitle, slugify, sortDates } from "@/utils/shared-functions"
import { StandardSideQuestSearchParamsSchema } from "@/utils/validation-schemas"

export const Route = createFileRoute("/side-quests/")({
	validateSearch: StandardSideQuestSearchParamsSchema,
	loaderDeps: ({ search }) => ({
		game: search.game,
		map: search.map,
		sort: search.sort,
		page: search.page ?? 1,
	}),
	loader: ({ deps, context }) => {
		const serverUrl = context.serverUrl
		const title = createSeoTitle("Side Quests")
		const description =
			"Learn how to complete hidden Side Quests/Easter Eggs in COD Zombies with our detailed step-by-step guides."

		const maps = getMaps()
		const allQuests = getSideQuests()
		const games = getGames()

		const filterSpecs: FilterSpec<SideQuest>[] = [
			{
				values: deps.game,
				match: (item, gameId) => {
					const map = getMapByKey(item.map)
					return Option.isSome(map) && map.value.game === gameId
				},
			},
			{
				values: deps.map,
				match: (item, mapId) => {
					const map = getMapByKey(item.map)
					return Option.isSome(map) && map.value.id === mapId
				},
			},
		]

		const sortSpecs: SortSpec<SideQuest>[] = [
			{
				key: "latest",
				compare: (a, b) => {
					const mapA = getMapByKey(a.map)
					const mapB = getMapByKey(b.map)
					return compareByOptionalSome(mapA, mapB, (ma, mb) =>
						sortDates(mb.releaseDate, ma.releaseDate),
					)
				},
			},
			{
				key: "oldest",
				compare: (a, b) => {
					const mapA = getMapByKey(a.map)
					const mapB = getMapByKey(b.map)
					return compareByOptionalSome(mapA, mapB, (ma, mb) =>
						sortDates(ma.releaseDate, mb.releaseDate),
					)
				},
			},
		]

		const filtered = applyFilters(allQuests, filterSpecs)
		const sorted = applySort(filtered, deps.sort, sortSpecs, "latest")
		const pageResult = paginate(sorted, deps.page)

		const questMaps = new Set<string>(allQuests.map(q => q.map))
		const questGames = new Set<string>(
			allQuests
				.map(q => getMapByKey(q.map).valueOrUndefined?.game)
				.filter(Predicate.isNotUndefined),
		)

		const mapFilters = maps.flatMap(map => {
			if (!questMaps.has(map.id)) return []
			return [{ value: map.id, label: map.title }]
		})

		const gameFilters = games.flatMap(game => {
			if (!questGames.has(game.id)) return []
			return [{ value: game.id, label: game.title }]
		})

		return {
			serverUrl,
			title,
			description,
			quests: pageResult.items.map(encodeSideQuest),
			totalCount: pageResult.totalCount,
			pageSize: pageResult.pageSize,
			sortOptions: getSideQuestSortOptions(),
			gameFilters,
			mapFilters,
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{ title: loaderData?.title },
			{ name: "description", content: loaderData?.description },
			{ property: "og:title", content: loaderData?.title },
			{ property: "og:description", content: loaderData?.description },
			{ property: "og:url", content: `${loaderData?.serverUrl}/side-quests` },
			{
				property: "og:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-side-quests.png`,
			},
			{ property: "og:image:height", content: "1200" },
			{ property: "og:image:width", content: "630" },
			{ property: "og:image:alt", content: "Side Quests" },
			{ property: "og:image:type", content: "image/png" },
			{ property: "twitter:title", content: loaderData?.title },
			{ property: "twitter:description", content: loaderData?.description },
			{
				property: "twitter:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-side-quests.png`,
			},
			{ property: "twitter:card", content: "summary_large_image" },
		],
		links: [{ rel: "canonical", href: `${loaderData?.serverUrl}/side-quests` }],
	}),
	component: SideQuests,
	staleTime: Infinity,
})

function SideQuests() {
	const data = Route.useLoaderData()
	const { map, game, page } = Route.useSearch()
	const navigate = Route.useNavigate()

	const groups: FilterGroup[] = [
		toFilterGroup("Game", data.gameFilters),
		toFilterGroup("Map", data.mapFilters),
	]

	const filterValue: FilterOption[] = []
	for (const g of groups) {
		const values = g.items.filter(
			i => map?.some(d => d === i.value) || game?.some(g => g === i.value),
		)

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
				page: undefined,
				game: selected.get("game"),
				map: selected.get("map"),
			}),
			replace: true,
		})
	}

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Side Quests", href: "/side-quests" }]} />
				<GridSection title="Side Quests">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Discover the hidden secrets and rewards beyond the main story.
					</p>
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<GridFilters
							groups={groups}
							value={filterValue}
							onValueChange={onFilterChange}
							placeholder="Game or Map"
						/>
						<GridSort from="/side-quests/" options={data.sortOptions} />
					</div>
					<QuestGrid quests={data.quests} />
					<GridPagination
						from="/side-quests/"
						page={page ?? 1}
						pageSize={data.pageSize}
						totalCount={data.totalCount}
					/>
				</GridSection>
			</div>
		</div>
	)
}
