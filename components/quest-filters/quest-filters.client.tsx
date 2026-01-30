"use client"
import type { Filter } from "@/components/filters-combobox/filters-combobox"
import ClearFiltersButton from "@/components/filters-combobox/clear-filters-button"
import FiltersCombobox from "@/components/filters-combobox/filters-combobox"
import SortSelect from "@/components/sort-select/sort-select"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getMainQuestSortOptions } from "@/data/main-quests"
import { getSideQuestSortOptions } from "@/data/side-quests"
import { useFilterParams } from "@/hooks/use-filter-params"

interface MainQuestFilters {
	type: "main"
	games: Filter[]
	difficulties: Filter[]
}

interface SideQuestFilters {
	type: "side"
	maps: Filter[]
	games: Filter[]
}

type TQuestFiltersClient = MainQuestFilters | SideQuestFilters

export default function QuestFiltersClient(props: TQuestFiltersClient) {
	const { type, games } = props
	const {
		mapParams,
		difficultyParams,
		gameParams,
		sortParam,
		toggleParam,
		clearParam,
		clearAllFilters,
		updateSort,
	} = useFilterParams()

	const toggleGame = (game: string) => {
		toggleParam("game", game, gameParams)
	}

	const toggleMap = (map: string) => {
		toggleParam("map", map, mapParams)
	}

	const toggleDifficulty = (difficulty: string) => {
		toggleParam("difficulty", difficulty, difficultyParams)
	}
	
	const sortOptions = type === "main" ? getMainQuestSortOptions() : getSideQuestSortOptions()
	const defaultSort = sortOptions.at(0)?.value ?? "latest"
	const validSortValue = sortParam && sortOptions.some(option => option.value === sortParam) ? sortParam : defaultSort	

	return (
		<ScrollArea className="-mt-4">
			<div className="flex w-full items-center gap-2 py-1 pl-0.5">
				{type === "main" ? (
					<>
						<FiltersCombobox
							data={games}
							currentSelection={gameParams}
							title="Game"
							toggleParam={toggleGame}
							clearParam={() => clearParam("game")}
						/>
						<FiltersCombobox
							data={props.difficulties}
							currentSelection={difficultyParams}
							title="Difficulty"
							toggleParam={toggleDifficulty}
							clearParam={() => clearParam("difficulty")}
						/>
					</>
				) : (
					<>
						<FiltersCombobox
							data={props.maps}
							currentSelection={mapParams}
							title="Map"
							enableInput
							inputPlaceholder="Search Map"
							toggleParam={toggleMap}
							clearParam={() => clearParam("map")}
						/>
						<FiltersCombobox
							data={games}
							currentSelection={gameParams}
							title="Game"
							toggleParam={toggleGame}
							clearParam={() => clearParam("game")}
						/>
					</>
				)}
				<SortSelect
					value={validSortValue}
					options={sortOptions}
					onValueChange={updateSort}
					triggerClass="ml-auto"
				/>
				{gameParams.length > 0 || mapParams.length > 0 || difficultyParams.length > 0 ? (
					<ClearFiltersButton onClick={clearAllFilters} />
				) : null}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	)
}
