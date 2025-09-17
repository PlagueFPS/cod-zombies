import type { MetadataRoute } from "next"
import { getAvailableMaps } from "@/data/interactive-map"
import { getLegalDocsMetadata } from "@/data/legal"
import { getMainQuestMetadata } from "@/data/main-quests"
import { getSideQuestsMetadata } from "@/data/side-quests"
import { getZombiesMetadata } from "@/data/zombies"
import { getServerUrl } from "@/utils/functions"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const mainQuestsPromise = getMainQuestMetadata()
	const zombiesPromise = getZombiesMetadata()
	const sideQuestsPromise = getSideQuestsMetadata()
	const legalDocsPromise = getLegalDocsMetadata()
	const interactiveMaps = getAvailableMaps()
	const serverUrl = getServerUrl()

	const [mainQuests, zombies, sideQuests, legalDocs] = await Promise.all([
		mainQuestsPromise,
		zombiesPromise,
		sideQuestsPromise,
		legalDocsPromise,
	])

	return [
		{
			url: `${serverUrl}`,
			lastModified: mainQuests[0] ? new Date(mainQuests[0].updatedAt) : undefined,
		},
		...mainQuests.map((quest): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/${quest.game.slug}/${quest.slug}`,
			lastModified: new Date(quest.updatedAt),
		})),
		{
			url: `${serverUrl}/side-quests`,
			lastModified: sideQuests[0] ? new Date(sideQuests[0].updatedAt) : undefined,
		},
		...sideQuests.map((q): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}`,
			lastModified: new Date(q.updatedAt),
		})),
		{
			url: `${serverUrl}/bestiary`,
			lastModified: zombies[0] ? new Date(zombies[0].updatedAt) : undefined,
		},
		...zombies.map((z): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/bestiary/${z.slug}`,
			lastModified: new Date(z.updatedAt),
		})),
		{
			url: `${serverUrl}/maps`,
		},
		...interactiveMaps.map((map): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/maps/${map}`,
		})),
		...legalDocs.map((doc): MetadataRoute.Sitemap[number] => ({
			url: `${serverUrl}/${doc.slug}`,
			lastModified: new Date(doc.updatedAt),
		})),
	]
}
