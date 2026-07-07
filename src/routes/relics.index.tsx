import { createFileRoute } from "@tanstack/react-router"
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
import { RelicGrid } from "@/components/relic-grid"
import { getMaps } from "@/data/maps"
import { getRelics, getRelicSortOptions, type Relic } from "@/data/relics"
import {
	applyFilters,
	applySort,
	paginate,
	type FilterSpec,
	type SortSpec,
} from "@/utils/filter-helpers"
import { encodeRelic } from "@/utils/rsc-wire"
import {
	createSeoTitle,
	slugify,
	sortEstimatedTime,
	sortDates,
	sortRelicTypes,
} from "@/utils/shared-functions"
import { StandardRelicSearchParamsSchema } from "@/utils/validation-schemas"

export const Route = createFileRoute("/relics/")({
	validateSearch: StandardRelicSearchParamsSchema,
	loaderDeps: ({ search }) => ({
		map: search.map,
		type: search.type,
		sort: search.sort,
		page: search.page ?? 1,
	}),
	loader: ({ deps, context }) => {
		const serverUrl = context.serverUrl
		const title = createSeoTitle("Cursed Relics")
		const description = "Learn how to unlock the most desired relics in Black Ops 7's Cursed mode."

		const maps = getMaps()
		const allRelics = getRelics()
		const relicMaps = new Set<string>(allRelics.map(r => r.map))
		const typeFilters = [...new Set(allRelics.map(r => r.type))].map(type => ({
			value: slugify(type),
			label: type,
		}))
		const mapFilters = maps.flatMap(m => {
			if (!relicMaps.has(m.id)) return []
			return [{ value: m.id, label: m.title }]
		})

		const filterSpecs: FilterSpec<Relic>[] = [
			{
				values: deps.map,
				match: (item, id) => item.map === id,
			},
			{
				values: deps.type,
				match: (item, slug) => item.type.toLowerCase() === slug,
			},
		]

		const sortSpecs: SortSpec<Relic>[] = [
			{
				key: "discovered-desc",
				compare: (a, b) => sortDates(b.discoveredDate, a.discoveredDate),
			},
			{
				key: "discovered-asc",
				compare: (a, b) => sortDates(a.discoveredDate, b.discoveredDate),
			},
			{ key: "type-asc", compare: (a, b) => sortRelicTypes(a.type, b.type) },
			{ key: "type-desc", compare: (a, b) => sortRelicTypes(b.type, a.type) },
			{
				key: "time-asc",
				compare: (a, b) => sortEstimatedTime(a.estimatedTimeMins, b.estimatedTimeMins),
			},
			{
				key: "time-desc",
				compare: (a, b) => sortEstimatedTime(b.estimatedTimeMins, a.estimatedTimeMins),
			},
		]

		const filtered = applyFilters(allRelics, filterSpecs)
		const sorted = applySort(filtered, deps.sort, sortSpecs, "discovered-desc")
		const pageResult = paginate(sorted, deps.page ?? 1)

		return {
			serverUrl,
			title,
			description,
			relics: pageResult.items.map(encodeRelic),
			totalCount: pageResult.totalCount,
			pageSize: pageResult.pageSize,
			page: pageResult.page,
			sortOptions: getRelicSortOptions(),
			mapFilters,
			typeFilters,
		}
	},
	head: ({ loaderData }) => ({
		meta: [
			{ title: loaderData?.title },
			{ name: "description", content: loaderData?.description },
			{ property: "og:title", content: loaderData?.title },
			{ property: "og:description", content: loaderData?.description },
			{ property: "og:url", content: `${loaderData?.serverUrl}/relics` },
			{
				property: "og:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-relics.png`,
			},
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:type", content: "image/png" },
			{ property: "twitter:title", content: loaderData?.title },
			{ property: "twitter:description", content: loaderData?.description },
			{
				property: "twitter:image",
				content: `${loaderData?.serverUrl}/opengraph-images/opengraph-relics.png`,
			},
		],
		links: [{ rel: "canonical", href: `${loaderData?.serverUrl}/relics` }],
	}),
	component: Relics,
	staleTime: Infinity,
})

function Relics() {
	const data = Route.useLoaderData()
	const { map, type, page } = Route.useSearch()
	const navigate = Route.useNavigate()

	const groups: FilterGroup[] = [
		toFilterGroup("Type", data.typeFilters),
		toFilterGroup("Map", data.mapFilters),
	]

	const filterValue: FilterOption[] = []
	for (const g of groups) {
		const values = g.items.filter(
			i => map?.some(d => d === i.value) || type?.some(t => t === i.value),
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
				map: selected.get("map"),
				type: selected.get("type") as "grim" | "sinister" | "wicked" | undefined,
			}),
			replace: true,
		})
	}

	return (
		<div className="flex w-full flex-col items-center justify-center">
			<div className="container flex flex-col items-center justify-center gap-6">
				<Breadcrumbs links={[{ title: "Relics", href: "/relics" }]} />
				<GridSection title="Cursed Relics">
					<p className="-mt-6 mb-2 text-muted-foreground sm:text-lg">
						View all discovered relics hidden within the Cursed mode on each map.
					</p>
					<div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
						<GridFilters
							groups={groups}
							value={filterValue}
							onValueChange={onFilterChange}
							placeholder="Map, Type"
						/>
						<GridSort from="/relics/" options={data.sortOptions} />
					</div>
					<RelicGrid relics={data.relics} />
					<GridPagination
						from="/relics/"
						page={page ?? 1}
						totalCount={data.totalCount}
						pageSize={data.pageSize}
					/>
				</GridSection>
			</div>
		</div>
	)
}
