"use client"
import type { Filter } from "../filters-combobox/filters-combobox"
import SortSelect from "@/components/sort-select/sort-select"
import { getZombieSortOptions } from "@/data/zombies"
import { useFilterParams } from "@/hooks/use-filter-params"
import ClearFiltersButton from "../filters-combobox/clear-filters-button"
import FiltersCombobox from "../filters-combobox/filters-combobox"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

interface BestiaryFiltersClientProps {
	games: Filter[]
	maps: Filter[]
	types: Filter[]
}

export default function BestiaryFiltersClient({ games, maps, types }: BestiaryFiltersClientProps) {
	const {
		mapParams,
		gameParams,
		typeParams,
		sortParam,
		toggleParam,
		clearAllFilters,
		clearParam,
		updateSort,
	} = useFilterParams()

	const sortOptions = getZombieSortOptions()
	const defaultSort = sortOptions.at(0)?.value ?? "latest"
	const validSortValue = sortParam && sortOptions.some(option => option.value === sortParam) ? sortParam : defaultSort	

	const toggleGame = (game: string) => {
		toggleParam("game", game, gameParams)
	}

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
					data={types}
					currentSelection={typeParams}
					title="Type"
					toggleParam={toggleType}
					clearParam={() => clearParam("type")}
				/>
				<FiltersCombobox
					data={games}
					currentSelection={gameParams}
					title="Game"
					toggleParam={toggleGame}
					clearParam={() => clearParam("game")}
				/>
				<FiltersCombobox
					data={maps}
					currentSelection={mapParams}
					title="Map"
					toggleParam={toggleMap}
					enableInput
					inputPlaceholder="Search Map"
					clearParam={() => clearParam("map")}
				/>
				<SortSelect
					value={validSortValue}
					options={sortOptions}
					onValueChange={updateSort}
					triggerClass="ml-auto"
				/>
				{gameParams.length > 0 || mapParams.length > 0 || typeParams.length > 0 ? (
					<ClearFiltersButton onClick={clearAllFilters} />
				) : null}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	)
}
