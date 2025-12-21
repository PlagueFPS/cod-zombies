"use client"
import { type GameKey, getGameByKey } from "@/data/games"
import { useFilterParams } from "@/hooks/use-filter-params"
import ClearFiltersButton from "../filters-combobox/clear-filters-button"
import FiltersCombobox from "../filters-combobox/filters-combobox"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"

interface InteractiveMapsFiltersProps {
	availableGames: Set<GameKey>
}

export default function InteractiveMapsFilters({ availableGames }: InteractiveMapsFiltersProps) {
	const { gameParams, toggleParam, clearAllFilters, clearParam } = useFilterParams()
	const games = [...availableGames].map(gameKey => {
		const { id, title } = getGameByKey(gameKey)
		return {
			id,
			slug: id,
			title,
		}
	})

	const toggleGame = (game: string) => {
		toggleParam("game", game, gameParams)
	}

	return (
		<ScrollArea className="-mt-4">
			<div className="flex w-full items-center gap-2 py-1 pl-0.5">
				<FiltersCombobox
					data={games}
					currentSelection={gameParams}
					title="Game"
					toggleParam={toggleGame}
					clearParam={() => clearParam("game")}
				/>
				{gameParams.length > 0 ? <ClearFiltersButton onClick={clearAllFilters} /> : null}
			</div>
			<ScrollBar orientation="horizontal" className="sr-only" />
		</ScrollArea>
	)
}
