"use client"
import type { Filter } from "../filters-combobox/filters-combobox"
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
	const { mapParams, gameParams, typeParams, toggleParam, clearAllFilters, clearParam } = useFilterParams()

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
				{gameParams.length > 0 || mapParams.length > 0 || typeParams.length > 0 ? (
					<ClearFiltersButton onClick={clearAllFilters} />
				) : null}
			</div>
			<ScrollBar orientation="horizontal" className="sr-only" />
		</ScrollArea>
	)
}
