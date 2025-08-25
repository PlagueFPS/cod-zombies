import type { MetadataRoute } from "next"
import { getAvailableMaps } from "@/data/interactive-map"
import { getLegalDocuments } from "@/data/legal"
import { getMaps } from "@/data/maps"
import { getQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { env } from "@/env"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const mapsPromise = getMaps()
	const questsProimse = getQuests()
	const zombiesPromise = getZombies()
	const legalPromise = getLegalDocuments()
	const interactiveMaps = getAvailableMaps()
	const [maps, quests, zombies, legalDocs] = await Promise.all([
		mapsPromise,
		questsProimse,
		zombiesPromise,
		legalPromise,
	])

	return [
		{
			url: `${env.NEXT_PUBLIC_WEBSITE_URL}`,
			lastModified: maps[0] ? new Date(maps[0].updatedAt) : undefined,
		},
		...maps
			.filter(map => !map.isComingSoon)
			.map((map): MetadataRoute.Sitemap[number] => ({
				url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game.slug}/${map.slug}`,
				lastModified: new Date(map.updatedAt),
			})),
		{
			url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests`,
			lastModified: quests[0] ? new Date(quests[0].updatedAt) : undefined,
		},
		...quests.map((q): MetadataRoute.Sitemap[number] => ({
			url: `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${q.game.slug}/${q.map.slug}/${q.slug}`,
			lastModified: new Date(q.updatedAt),
		})),
		{
			url: `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary`,
			lastModified: zombies[0] ? new Date(zombies[0].updatedAt) : undefined,
		},
		...zombies
			.filter(z => !z.isComingSoon)
			.map((z): MetadataRoute.Sitemap[number] => ({
				url: `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${z.slug}`,
				lastModified: new Date(z.updatedAt),
			})),
		{
			url: `${env.NEXT_PUBLIC_WEBSITE_URL}/maps`,
		},
		...interactiveMaps.map((map): MetadataRoute.Sitemap[number] => ({
			url: `${env.NEXT_PUBLIC_WEBSITE_URL}/maps/${map}`,
		})),
		...legalDocs.map((doc): MetadataRoute.Sitemap[number] => ({
			url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${doc.slug}`,
			lastModified: new Date(doc.updatedAt),
		})),
	]
}
