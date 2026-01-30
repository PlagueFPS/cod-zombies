"use client"
import type { Filter } from "@/components/filters-combobox/filters-combobox"
import FiltersCombobox from "@/components/filters-combobox/filters-combobox"
import SortSelect, { type SortOption } from "@/components/sort-select/sort-select"
import { useFilterParams } from "@/hooks/use-filter-params"
import ClearFiltersButton from "../filters-combobox/clear-filters-button"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

interface RelicFiltersClientProps {
	maps: Filter[]
	types: Filter[]
}

export default function RelicFiltersClient({ maps, types }: RelicFiltersClientProps) {
	const {
		mapParams,
		typeParams,
		sortParam,
		toggleParam,
		clearParam,
		clearAllFilters,
		updateSort,
	} = useFilterParams()

	const sortOptions: SortOption[] = [
		{ value: "discovered-desc", label: "Newest Discovered" },
		{ value: "discovered-asc", label: "Oldest Discovered" },
		{ value: "type-asc", label: "Type: Grim to Wicked" },
		{ value: "type-desc", label: "Type: Wicked to Grim" },
	]

	const toggleMap = (map: string) => {
		toggleParam("map", map, mapParams)
	}

	const toggleType = (type: string) => {
		toggleParam("type", type, typeParams)
	}

	return (
		<ScrollArea className="-mt-4">
			<div className="flex w-full items-center gap-2 py-1 pl-0.5">
				<FiltersCombobox
					data={maps}
					currentSelection={mapParams}
					title="Map"
					toggleParam={toggleMap}
					clearParam={() => clearParam("map")}
				/>
				<FiltersCombobox
					data={types}
					currentSelection={typeParams}
					title="Type"
					toggleParam={toggleType}
					clearParam={() => clearParam("type")}
				/>
				<SortSelect
					value={sortParam || "discovered-desc"}
					options={sortOptions}
					onValueChange={updateSort}
				/>
				{mapParams.length > 0 || typeParams.length > 0 ? (
					<ClearFiltersButton onClick={clearAllFilters} />
				) : null}
			</div>
			<ScrollBar orientation="horizontal" className="sr-only" />
		</ScrollArea>
	)
}
