import { Effect, Option } from "effect"
import { getGames } from "@/data/games"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMainQuests } from "@/data/main-quests"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import SearchInput from "./search-input"

interface ISearchBar {
	showFull?: boolean
}

export default async function SearchBar({ showFull }: ISearchBar) {
	return await Effect.gen(function* () {
		const availableMaps = yield* getInteractiveMaps().pipe(
			Effect.map(maps => maps.filter(map => Option.getOrNull(map.state) !== "Coming Soon")),
			Effect.map(maps => maps.map(map => ({ id: map.id, title: map.title }))),
		)
		const mainQuests = getMainQuests()
			.filter(q => Option.getOrNull(q.state) !== "Coming Soon")
			.map(q => ({
				id: q.map.id,
				title: q.map.title,
				game: {
					id: q.map.game.id,
					title: q.map.game.title,
				},
			}))
		const games = getGames().map(g => ({
			id: g.id,
			title: g.title,
		}))
		const sideQuests = getSideQuests()
			.filter(q => Option.getOrNull(q.state) !== "Coming Soon")
			.map(q => ({
				id: q.id,
				title: q.title,
				map: {
					id: q.map.id,
					title: q.map.title,
				},
				game: {
					id: q.map.game.id,
					title: q.map.game.title,
				},
			}))
		const zombies = getZombies()
			.filter(z => Option.getOrNull(z.state) !== "Coming Soon")
			.map(z => ({
				id: z.id,
				title: z.title,
			}))
		const relics = getRelics()
			.filter(r => r.state !== "Coming Soon")
			.map(r => ({
				id: r.id,
				title: r.title,
				map: {
					id: r.map.id,
					title: r.map.title,
				},
				game: {
					id: r.map.game.id,
					title: r.map.game.title,
				},
			}))

		return (
			<div className="flex w-fit animate-fade-in items-center justify-center">
				<SearchInput
					maps={mainQuests}
					games={games}
					quests={sideQuests}
					zombies={zombies}
					relics={relics}
					showFull={showFull}
					availableMaps={availableMaps}
				/>
			</div>
		)
	}).pipe(Effect.runPromise)
}
