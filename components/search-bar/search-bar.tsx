import { getGames } from "@/data/games"
import { getAvailableMaps } from "@/data/interactive-map"
import { getMainQuests } from "@/data/main-quests"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import SearchInput from "./search-input"

interface ISearchBar {
	showFull?: boolean
}

export default function SearchBar({ showFull }: ISearchBar) {
	const mainQuests = getMainQuests()
	const games = getGames().map(g => ({
		id: g.id,
		slug: g.id,
		title: g.title,
	}))
	const sideQuests = getSideQuests()
	const zombies = getZombies().map(z => ({
		id: z.id,
		slug: z.id,
		title: z.title,
	}))
	const availableMaps = getAvailableMaps()

	const mainQuestsDtos = mainQuests
		.filter(q => q.state !== "Coming Soon")
		.map(q => ({
			id: q.id,
			slug: q.map.id,
			title: q.map.title,
			game: {
				title: q.map.game.title,
				slug: q.map.game.id,
			},
		}))
	const sideQuestsDtos = sideQuests
		.filter(q => q.state !== "Coming Soon")
		.map(q => ({
			id: q.id,
			slug: q.id,
			title: q.title,
			game: {
				title: q.map.game.title,
				slug: q.map.game.id,
			},
			map: {
				title: q.map.title,
				slug: q.map.id,
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
