"use client"
import type { Filter } from "@/components/filters-combobox/filters-combobox"
import ClearFiltersButton from "@/components/filters-combobox/clear-filters-button"
import FiltersCombobox from "@/components/filters-combobox/filters-combobox"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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
	const { mapParams, difficultyParams, gameParams, toggleParam, clearParam, clearAllFilters } =
		useFilterParams()

	const toggleGame = (game: string) => {
		toggleParam("game", game, gameParams)
	}

	const toggleMap = (map: string) => {
		toggleParam("map", map, mapParams)
	}

	const toggleDifficulty = (difficulty: string) => {
		toggleParam("difficulty", difficulty, difficultyParams)
	}

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
				{gameParams.length > 0 || mapParams.length > 0 || difficultyParams.length > 0 ? (
					<ClearFiltersButton onClick={clearAllFilters} />
				) : null}
			</div>
			<ScrollBar orientation="horizontal" className="sr-only" />
		</ScrollArea>
	)
}
