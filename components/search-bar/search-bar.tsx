import { getGames } from "@/data/games"
import { getAvailableMaps } from "@/data/interactive-map"
import { getMapsWithQuest } from "@/data/maps"
import { getSideQuests } from "@/data/side-quests"
import { getZombiesMetadata } from "@/data/zombies"
import SearchInput from "./search-input"

interface ISearchBar {
	showFull?: boolean
}

export default async function SearchBar({ showFull }: ISearchBar) {
	const mainQuestsPromise = getMapsWithQuest()
	const gamesPromise = getGames()
	const sideQuestsPromise = getSideQuests()
	const zombiesPromise = getZombiesMetadata()
	const availableMaps = getAvailableMaps()
	const [mainQuests, games, sideQuests, zombies] = await Promise.all([
		mainQuestsPromise,
		gamesPromise,
		sideQuestsPromise,
		zombiesPromise,
	])
	const mainQuestsDtos = mainQuests
		.filter(q => !q.isComingSoon)
		.map(q => ({
			id: q.id,
			slug: q.slug,
			title: q.title,
			game: {
				title: q.game.title,
				slug: q.game.slug,
			},
		}))
	const sideQuestsDtos = sideQuests
		.filter(q => !q.isComingSoon)
		.map(q => ({
			id: q.id,
			slug: q.slug,
			title: q.title,
			game: {
				title: q.game.title,
				slug: q.game.slug,
			},
			map: {
				title: q.map.title,
				slug: q.map.slug,
			},
		}))

	return (
		<div className="flex w-fit animate-fade-in items-center justify-center">
			<SearchInput
				maps={mainQuestsDtos}
				games={games}
				quests={sideQuestsDtos}
				zombies={zombies}
				showFull={showFull}
				availableMaps={availableMaps}
			/>
		</div>
	)
}
