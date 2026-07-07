import type { FileRoutesByTo } from "@/routeTree.gen"
import { Option } from "effect"
import { SearchBarInput } from "@/components/search-bar-input"
import { getGameByKey, getGames } from "@/data/games"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMapByKey, getMaps } from "@/data/maps"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"

export function SearchBar() {
	const maps = getMaps()
	const availableMaps = getInteractiveMaps().flatMap(map =>
		Option.getOrNull(map.state) !== "Coming Soon" ? [{ id: map.id, title: map.title }] : [],
	)

	const mainQuests = maps.flatMap(q => {
		if (Option.isNone(q.mainQuest)) return []

		const game = getGameByKey(q.game)

		if (Option.isNone(game)) return []
		if (q.state.valueOrUndefined === "Coming Soon") return []

		return [
			{
				id: q.id,
				title: q.title,
				game: { id: q.game, title: Option.getOrThrow(getGameByKey(q.game)).title },
			},
		]
	})

	const games = getGames().map(g => ({ id: g.id, title: g.title }))

	const mapSlugs = new Set<string>()
	const sideQuests = getSideQuests().flatMap(q => {
		if (q.state.valueOrUndefined === "Coming Soon") return []

		const map = getMapByKey(q.map)
		if (Option.isNone(map)) return []

		const game = getGameByKey(map.value.game)
		if (Option.isNone(game)) return []

		mapSlugs.add(map.value.id)

		return [
			{
				id: q.id,
				title: q.title,
				map: { id: map.value.id, title: map.value.title },
				game: { id: game.value.id, title: game.value.title },
			},
		]
	})

	const relicMapSlugs = new Set<string>()
	const relics = getRelics().flatMap(r => {
		if (Option.getOrNull(r.state) === "Coming Soon") return []

		const map = getMapByKey(r.map)
		if (Option.isNone(map)) return []

		const game = getGameByKey(map.value.game)
		if (Option.isNone(game)) return []

		relicMapSlugs.add(map.value.id)
		return [
			{
				id: r.id,
				title: r.title,
				map: { id: map.value.id, title: map.value.title },
				game: { id: game.value.id, title: game.value.title },
			},
		]
	})

	const zombies = getZombies().flatMap(z =>
		Option.getOrNull(z.state) !== "Coming Soon" ? [{ id: z.id, title: z.title }] : [],
	)

	const questMaps: typeof maps = []
	const relicMaps: typeof maps = []
	for (const m of maps) {
		if (mapSlugs.has(m.id)) questMaps.push(m)
		if (relicMapSlugs.has(m.id)) relicMaps.push(m)
	}

	const mainQuestsByGame = new Map<string, typeof mainQuests>()
	for (const q of mainQuests) {
		const list = mainQuestsByGame.get(q.game.id) ?? []
		list.push(q)
		mainQuestsByGame.set(q.game.id, list)
	}

	const sideQuestsByMap = new Map<string, typeof sideQuests>()
	for (const q of sideQuests) {
		const list = sideQuestsByMap.get(q.map.id) ?? []
		list.push(q)
		sideQuestsByMap.set(q.map.id, list)
	}

	const relicsByMap = new Map<string, typeof relics>()
	for (const r of relics) {
		const list = relicsByMap.get(r.map.id) ?? []
		list.push(r)
		relicsByMap.set(r.map.id, list)
	}

	const searchMainQuests = games
		.map(game => ({
			value: `${game.title} Main Quests`,
			icon: "BookText" as const,
			items: (mainQuestsByGame.get(game.id) ?? []).map(q => ({
				value: `/main-quests/${q.game.id}/${q.id}` as keyof FileRoutesByTo,
				label: q.title,
			})),
		}))
		.filter(group => group.items.length > 0)

	const searchSideQuests = questMaps
		.map(map => ({
			value: `${map.title} Side Quests`,
			icon: "Book" as const,
			items: (sideQuestsByMap.get(map.id) ?? []).map(q => ({
				value: `/side-quests/${q.game.id}/${q.map.id}/${q.id}` as keyof FileRoutesByTo,
				label: q.title,
			})),
		}))
		.filter(group => group.items.length > 0)

	const searchRelics = relicMaps
		.map(map => ({
			value: `${map.title} Relics`,
			icon: "Component" as const,
			items: (relicsByMap.get(map.id) ?? []).map(r => ({
				value: `/relics/${r.game.id}/${r.id}` as keyof FileRoutesByTo,
				label: r.title,
			})),
		}))
		.filter(group => group.items.length > 0)

	const searchZombies = {
		value: "Zombies",
		icon: "Brain" as const,
		items: zombies.map(zombie => ({
			value: `/bestiary/${zombie.id}` as keyof FileRoutesByTo,
			label: zombie.title,
		})),
	}

	const searchMaps = {
		value: "Interactive Maps",
		icon: "Map" as const,
		items: availableMaps.map(map => ({
			value: `/maps/${map.id}` as keyof FileRoutesByTo,
			label: `${map.title} Interactive Map`,
		})),
	}

	const searchItems = [
		...searchMainQuests,
		...searchSideQuests,
		...searchRelics,
		searchZombies,
		searchMaps,
	]

	return (
		<div className="flex w-fit animate-fade-in items-center justify-center">
			<SearchBarInput searchItems={searchItems} />
		</div>
	)
}
