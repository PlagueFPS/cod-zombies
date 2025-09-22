import type { MetadataRoute } from "next"
import { getAvailableMaps } from "@/data/interactive-map"
import { getMainQuests } from "@/data/main-quests"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { getServerUrl } from "@/utils/functions"

export default function sitemap(): MetadataRoute.Sitemap {
	const mainQuests = getMainQuests()
	const zombies = getZombies()
	const sideQuests = getSideQuests()
	const interactiveMaps = getAvailableMaps()
	const serverUrl = getServerUrl()

	return [
		{
			url: `${serverUrl}`,
			lastModified: mainQuests[0] ? new Date(mainQuests[0].lastUpdated) : undefined,
		},
		...mainQuests.map((quest): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/${quest.map.game.id}/${quest.id}`,
			lastModified: new Date(quest.lastUpdated),
		})),
		{
			url: `${serverUrl}/side-quests`,
			lastModified: sideQuests[0] ? new Date(sideQuests[0].lastUpdated) : undefined,
		},
		...sideQuests.map((q): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/${q.map.game.id}/${q.map.id}/${q.id}`,
			lastModified: new Date(q.lastUpdated),
		})),
		{
			url: `${serverUrl}/bestiary`,
			lastModified: zombies[0] ? new Date(zombies[0].lastUpdated) : undefined,
		},
		...zombies.map((z): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/bestiary/${z.id}`,
			lastModified: new Date(z.lastUpdated),
		})),
		{
			url: `${serverUrl}/maps`,
		},
		...interactiveMaps.map((map): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/maps/${map}`,
		})),
	]
}
