import { createFileRoute } from "@tanstack/react-router"
import { Option } from "effect"
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
import {
	compareMapReleaseDescending,
	getMainQuestSortOptions,
	getMapsWithMainQuest,
	MAIN_QUEST_TIME_RANGE_FILTERS,
	mainQuestMidpointMatchesAnyTimeSlug,
	type MainQuestDifficulty,
	type MapEntry,
} from "@/data/maps"
import {
	applyFilters,
	applySort,
	paginate,
	type FilterSpec,
	type SortSpec,
} from "@/utils/filter-helpers"
import { encodeMap } from "@/utils/rsc-wire"
import {
	compareByOptionalSome,
	createSeoTitle,
	getEstimatedTimeMidpoint,
	slugify,
	sortDifficulties,
	sortEstimatedTime,
} from "@/utils/shared-functions"
import { StandardMainQuestSearchParamsSchema } from "@/utils/validation-schemas"

export const Route = createFileRoute("/main-quests/")({
	validateSearch: StandardMainQuestSearchParamsSchema,
	loaderDeps: ({ search }) => ({
		game: search.game,
		difficulty: search.difficulty,
		time: search.time,
		sort: search.sort,
		page: search.page ?? 1,
	}),
	loader: ({ deps, context }) => {
		const serverUrl = context.serverUrl
		const title = createSeoTitle("Main Quests")
		const description =
			"Learn how to complete all main quests/easter eggs in COD Zombies with our detailed step-by-step guides."

		const allMainQuests = getMapsWithMainQuest()
		const games = getGames()

		const filterSpecs: FilterSpec<MapEntry>[] = [
			{
				values: deps.game,
				match: (item, id) => item.game === id,
			},
			{
				values: deps.difficulty,
				match: (item, slug) =>
					Option.isSome(item.difficulty) && slugify(item.difficulty.value) === slug,
			},
			{
				values: deps.time,
				match: item => {
					if (Option.isNone(item.estimatedTimeMins)) return false
					const midpoint = getEstimatedTimeMidpoint(item.estimatedTimeMins.value)
					return mainQuestMidpointMatchesAnyTimeSlug(midpoint, deps.time)
				},
			},
		]

		const sortSpecs: SortSpec<MapEntry>[] = [
			{ key: "latest", compare: (a, b) => compareMapReleaseDescending(a, b) },
			{ key: "oldest", compare: (a, b) => compareMapReleaseDescending(b, a) },
			{
				key: "difficulty-asc",
				compare: (a, b) => compareByOptionalSome(a.difficulty, b.difficulty, sortDifficulties),
			},
			{
				key: "difficulty-desc",
				compare: (a, b) => compareByOptionalSome(b.difficulty, a.difficulty, sortDifficulties),
			},
			{
				key: "time-asc",
				compare: (a, b) =>
					compareByOptionalSome(a.estimatedTimeMins, b.estimatedTimeMins, sortEstimatedTime),
			},
			{
				key: "time-desc",
				compare: (a, b) =>
					compareByOptionalSome(b.estimatedTimeMins, a.estimatedTimeMins, sortEstimatedTime),
			},
		]

		const filtered = applyFilters(allMainQuests, filterSpecs)
		const sorted = applySort(filtered, deps.sort, sortSpecs, "latest")
		const pageResult = paginate(sorted, deps.page)

		const questGames = new Set<string>(allMainQuests.map(q => q.game))
		const questDifficulties = new Set<MainQuestDifficulty>()

		for (const quest of allMainQuests) {
			if (Option.isSome(quest.difficulty)) {
				questDifficulties.add(quest.difficulty.value)
			}
		}

		const gameFilters = games
			.filter(g => questGames.has(g.id))
			.map(g => ({
				value: g.id,
				label: g.title,
			}))

		const difficultyFilters = Array.from(questDifficulties)
			.sort(sortDifficulties)
			.map(difficulty => ({
				value: slugify(difficulty),
				label: difficulty,
			}))

		const timeFilters = MAIN_QUEST_TIME_RANGE_FILTERS.map(range => ({
			value: range.id,
			label: range.title,
		}))

		return {
			serverUrl,
			title,
			description,
			mainQuests: pageResult.items.map(encodeMap),
			totalCount: pageResult.totalCount,
			pageSize: pageResult.pageSize,
			sortOptions: getMainQuestSortOptions(),
			gameFilters,
			difficultyFilters,
			timeFilters,
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{ title: loaderData?.title },
			{ name: "description", content: loaderData?.description },
			{ property: "og:title", content: loaderData?.title },
			{ property: "og:description", content: loaderData?.description },
			{ property: "og:url", content: `${loaderData?.serverUrl}/main-quests` },
			{
				property: "og:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-main-quests.png`,
			},
			{ property: "og:image:height", content: "1200" },
			{ property: "og:image:width", content: "630" },
			{ property: "og:image:type", content: "image/png" },
			{ property: "twitter:title", content: loaderData?.title },
			{ property: "twitter:description", content: loaderData?.description },
			{
				property: "twitter:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-main-quests.png`,
			},
		],
		links: [{ rel: "canonical", href: `${loaderData?.serverUrl}/main-quests` }],
	}),
	component: MainQuests,
	staleTime: Infinity,
})

function MainQuests() {
	const data = Route.useLoaderData()
	const { difficulty, game, time, page } = Route.useSearch()
	const navigate = Route.useNavigate()

	const groups: FilterGroup[] = [
		toFilterGroup("Difficulty", data.difficultyFilters),
		toFilterGroup("Completion Time", data.timeFilters),
		toFilterGroup("Game", data.gameFilters),
	]

	const filterValue: FilterOption[] = []
	for (const g of groups) {
		const values = g.items.filter(
			i =>
				difficulty?.some(d => d === i.value) ||
				game?.some(g => g === i.value) ||
				time?.some(t => t === i.value),
		)

		if (values.length > 0) filterValue.push(...values)
	}

	const onFilterChange = (next: FilterOption[]) => {
		const selected = new Map<string, string[]>()

		for (const g of groups) {
			const value = g.items.filter(i => next.some(n => n.value === i.value)).map(i => i.value)

			if (value.length > 0) {
				selected.set(slugify(g.label), value)
			}
		}

		void navigate({
			search: prev => ({
				...prev,
				page: undefined, // reset page on filter change
				game: selected.get("game"),
				difficulty: selected.get("difficulty") as "easy" | "medium" | "hard" | undefined,
				time: selected.get("completion-time") as
					| "under-30"
					| "30-60"
					| "60-120"
					| "120-plus"
					| undefined,
			}),
			replace: true,
		})
	}

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Main Quests", href: "/main-quests" }]} />
				<GridSection title="Main Quests">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						Discover the main story told from within the mode.
					</p>
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<GridFilters
							groups={groups}
							value={filterValue}
							onValueChange={onFilterChange}
							placeholder="Game, Difficulty, Completion Time"
						/>
						<GridSort from="/main-quests/" options={data.sortOptions} />
					</div>
					<QuestGrid quests={data.mainQuests} />
					<GridPagination
						from="/main-quests/"
						page={page ?? 1}
						totalCount={data.totalCount}
						pageSize={data.pageSize}
					/>
				</GridSection>
			</div>
		</div>
	)
}
