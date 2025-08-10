import { getGames } from "@/data/games"
import { getAvailableMaps } from "@/data/interactive-map"
import { getMapSearchData } from "@/data/maps"
import { getQuestSearchData } from "@/data/side-quests"
import { getZombieSearchData } from "@/data/zombies"
import SearchInput from "./search-input"

interface ISearchBar {
	showFull?: boolean
}

export default async function SearchBar({ showFull }: ISearchBar) {
	const mapsPromise = getMapSearchData()
	const gamesPromise = getGames()
	const questsPromise = getQuestSearchData()
	const zombiesPromise = getZombieSearchData()
	const availableMaps = getAvailableMaps()
	const [maps, games, quests, zombies] = await Promise.all([
		mapsPromise,
		gamesPromise,
		questsPromise,
		zombiesPromise,
	])
	const modifiedGames = games
		.filter(g => !g.isComingSoon)
		.map(game => ({
			id: game.id,
			title: game.title,
			slug: game.slug,
		}))
	const modifiedZombies = zombies.map(zombie => ({
		id: zombie.id,
		title: zombie.name,
		slug: zombie.slug,
	}))

	return (
		<div className="flex w-fit animate-fade-in items-center justify-center">
			<SearchInput
				maps={maps}
				games={modifiedGames}
				quests={quests}
				zombies={modifiedZombies}
				showFull={showFull}
				availableMaps={availableMaps}
			/>
		</div>
	)
}
