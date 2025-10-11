import type { MetadataRoute } from "next"
import { getAvailableMaps } from "@/data/interactive-map"
import { getMainQuests } from "@/data/main-quests"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { getLastUpdated, getServerUrl } from "@/utils/functions"

export default function sitemap(): MetadataRoute.Sitemap {
	const mainQuests = getMainQuests()
	const zombies = getZombies()
	const sideQuests = getSideQuests()
	const interactiveMaps = getAvailableMaps()
	const serverUrl = getServerUrl()

	const mainQuestsMap = mainQuests.map(quest => {
		const lastUpdated = getLastUpdated(`${quest.id}.mdx`)
		return {
			url: `${serverUrl}/${quest.map.game.id}/${quest.id}`,
			lastModified: new Date(lastUpdated),
		}
	},
	)

	const sideQuestsMap = sideQuests.map(quest => {
		const lastUpdated = getLastUpdated(`${quest.id}.mdx`)
		return {
			url: `${serverUrl}/${quest.map.game.id}/${quest.map.id}/${quest.id}`,
			lastModified: new Date(lastUpdated),
		}
	},
	)

	const zombiesMap = zombies.map(zombie => {
		const lastUpdated = getLastUpdated(`${zombie.id}.mdx`)
		return {
			url: `${serverUrl}/bestiary/${zombie.id}`,
			lastModified: lastUpdated,
		}
	},
	)

	return [
		{
			url: `${serverUrl}`,
			lastModified: mainQuests[0] ? getLastUpdated(`${mainQuests[0].id}.mdx`) : undefined,
		},
		...mainQuestsMap,
		{
			url: `${serverUrl}/side-quests`,
			lastModified: sideQuests[0] ? getLastUpdated(`${sideQuests[0].id}.mdx`) : undefined,
		},
		...sideQuestsMap,
		{
			url: `${serverUrl}/bestiary`,
			lastModified: zombies[0] ? getLastUpdated(`${zombies[0].id}.mdx`) : undefined,
		},
		...zombiesMap,
		{
			url: `${serverUrl}/maps`,
		},
		...interactiveMaps.map((map): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/maps/${map}`,
		})),
	]
}
