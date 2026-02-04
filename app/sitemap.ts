import type { MetadataRoute } from "next"
import { Effect } from "effect"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMainQuests } from "@/data/main-quests"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { getLastUpdated, getServerUrl } from "@/utils/server-functions"
import { sortReleaseDateDesc } from "@/utils/shared-functions"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const interactiveMaps = await Effect.runPromise(getInteractiveMaps())
	const mainQuests = getMainQuests()
	const sideQuests = getSideQuests()
	const zombies = getZombies()
	const relics = getRelics()
	const serverUrl = getServerUrl()

	const mainQuestsMap = mainQuests.map(quest => {
		const { lastModified } = getLastUpdated(`main-quests/${quest.id}.mdx`)
		return {
			url: `${serverUrl}/main-quests/${quest.map.game.id}/${quest.id}`,
			lastModified: new Date(lastModified),
		}
	})

	const sideQuestsMap = sideQuests.map(quest => {
		const { lastModified } = getLastUpdated(`side-quests/${quest.id}.mdx`)
		return {
			url: `${serverUrl}/side-quests/${quest.map.game.id}/${quest.map.id}/${quest.id}`,
			lastModified: new Date(lastModified),
		}
	})

	const zombiesMap = zombies.map(zombie => {
		const { lastModified } = getLastUpdated(`zombies/${zombie.id}.mdx`)
		return {
			url: `${serverUrl}/bestiary/${zombie.id}`,
			lastModified: new Date(lastModified),
		}
	})

	const relicsMap = relics.sort((a, b) => sortReleaseDateDesc(a.discoveredDate, b.discoveredDate)).map(relic => {
		const { lastModified } = getLastUpdated(`relics/${relic.id}.mdx`)
		return {
			url: `${serverUrl}/relics/${relic.map.game.id}/${relic.id}`,
			lastModified: new Date(lastModified),
		}
	})

	const firstEntries = [
		mainQuestsMap[0],
		sideQuestsMap[0],
		zombiesMap[0],
		relicsMap[0],
	].filter((entry): entry is NonNullable<typeof entry> => entry != null)

	const first = firstEntries[0]
	const mostRecentLastModified =
		first != null
			? firstEntries.reduce((latest, entry) =>
					entry.lastModified > latest ? entry.lastModified : latest,
				first.lastModified,
			)
			: undefined

	return [
		{
			url: `${serverUrl}`,
			lastModified: mostRecentLastModified,
		},
		{
			url: `${serverUrl}/main-quests`,
			lastModified: mainQuests[0]
				? new Date(getLastUpdated(`main-quests/${mainQuests[0].id}.mdx`).lastModified)
				: undefined,
		},
		...mainQuestsMap,
		{
			url: `${serverUrl}/side-quests`,
			lastModified: sideQuests[0]
				? new Date(getLastUpdated(`side-quests/${sideQuests[0].id}.mdx`).lastModified)
				: undefined,
		},
		...sideQuestsMap,
		{
			url: `${serverUrl}/bestiary`,
			lastModified: zombies[0]
				? new Date(getLastUpdated(`zombies/${zombies[0].id}.mdx`).lastModified)
				: undefined,
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
			lastModified: relics[0]
				? new Date(getLastUpdated(`relics/${relics[0].id}.mdx`).lastModified)
				: undefined,
		},
		...relicsMap,
	]
}
