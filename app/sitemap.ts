import type { MetadataRoute } from "next"
import { Array as Arr, Effect } from "effect"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMainQuests } from "@/data/main-quests"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { PageRuntime } from "@/lib/layers"
import { getLastModified, getServerUrl } from "@/utils/server-functions"
import { sortReleaseDateDesc } from "@/utils/shared-functions"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return await Effect.gen(function* () {
		const interactiveMaps = yield* getInteractiveMaps()
		const mainQuests = getMainQuests()
		const sideQuests = getSideQuests()
		const zombies = getZombies()
		const relics = getRelics()
		const serverUrl = getServerUrl()

		const mainQuestsMap = yield* Effect.forEach(
			mainQuests,
			quest =>
				Effect.gen(function* () {
					const { lastModified } = yield* getLastModified(`main-quests/${quest.id}.mdx`)
					return {
						url: `${serverUrl}/main-quests/${quest.map.game.id}/${quest.id}`,
						lastModified: new Date(lastModified),
					}
				}),
			{ concurrency: "unbounded" },
		)

		const sideQuestsMap = yield* Effect.forEach(
			sideQuests,
			quest =>
				Effect.gen(function* () {
					const { lastModified } = yield* getLastModified(`side-quests/${quest.id}.mdx`)
					return {
						url: `${serverUrl}/side-quests/${quest.map.game.id}/${quest.map.id}/${quest.id}`,
						lastModified: new Date(lastModified),
					}
				}),
			{ concurrency: "unbounded" },
		)

		const zombiesMap = yield* Effect.forEach(
			zombies,
			zombie =>
				Effect.gen(function* () {
					const { lastModified } = yield* getLastModified(`zombies/${zombie.id}.mdx`)
					return {
						url: `${serverUrl}/bestiary/${zombie.id}`,
						lastModified: new Date(lastModified),
					}
				}),
			{ concurrency: "unbounded" },
		)

		const sortedRelics = [...relics].sort((a, b) =>
			sortReleaseDateDesc(a.discoveredDate, b.discoveredDate),
		)
		const relicsMap = yield* Effect.forEach(
			sortedRelics,
			relic =>
				Effect.gen(function* () {
					const { lastModified } = yield* getLastModified(`relics/${relic.id}.mdx`)
					return {
						url: `${serverUrl}/relics/${relic.map.game.id}/${relic.id}`,
						lastModified: new Date(lastModified),
					}
				}),
			{ concurrency: "unbounded" },
		)

		const firstEntries = [mainQuestsMap[0], sideQuestsMap[0], zombiesMap[0], relicsMap[0]].filter(
			(entry): entry is NonNullable<typeof entry> => entry != null,
		)

		const first = firstEntries[0]
		const mostRecentLastModified =
			first != null
				? firstEntries.reduce(
						(latest, entry) => (entry.lastModified > latest ? entry.lastModified : latest),
						first.lastModified,
					)
				: undefined

		const mostRecentMainQuest = yield* Arr.head(mainQuests)
			.asEffect()
			.pipe(Effect.flatMap(quest => getLastModified(`main-quests/${quest.id}.mdx`)))
		const mostRecentSideQuest = yield* Arr.head(sideQuests)
			.asEffect()
			.pipe(Effect.flatMap(quest => getLastModified(`side-quests/${quest.id}.mdx`)))
		const mostRecentZombie = yield* Arr.head(zombies)
			.asEffect()
			.pipe(Effect.flatMap(zombie => getLastModified(`zombies/${zombie.id}.mdx`)))
		const mostRecentRelic = yield* Arr.head(relics)
			.asEffect()
			.pipe(Effect.flatMap(relic => getLastModified(`relics/${relic.id}.mdx`)))

		return [
			{
				url: `${serverUrl}`,
				lastModified: mostRecentLastModified,
			},
			{
				url: `${serverUrl}/main-quests`,
				lastModified: new Date(mostRecentMainQuest.lastModified),
			},
			...mainQuestsMap,
			{
				url: `${serverUrl}/side-quests`,
				lastModified: new Date(mostRecentSideQuest.lastModified),
			},
			...sideQuestsMap,
			{
				url: `${serverUrl}/bestiary`,
				lastModified: new Date(mostRecentZombie.lastModified),
			},
			...zombiesMap,
			{
				url: `${serverUrl}/maps`,
			},
			...interactiveMaps.map((map): MetadataRoute.Sitemap[number] => ({
				url: `${serverUrl}/maps/${map.id}`,
			})),
			{
				url: `${serverUrl}/relics`,
				lastModified: new Date(mostRecentRelic.lastModified),
			},
			...relicsMap,
		]
	}).pipe(PageRuntime.runPromise)
}
