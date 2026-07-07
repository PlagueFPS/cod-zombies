import type { ContentPaths } from "@/types/generated/content-paths.gen"
import { createFileRoute } from "@tanstack/react-router"
import { Effect, Array as Arr, Option } from "effect"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMapByKey, getMapsWithMainQuest } from "@/data/maps"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { getLastModified } from "@/utils/functions.server"
import { getServerUrl } from "@/utils/request.server"

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				return await Effect.gen(function* () {
					const interactiveMaps = getInteractiveMaps()
					const maps = getMapsWithMainQuest()
					const sideQuests = getSideQuests()
					const zombies = getZombies()
					const relics = getRelics()
					const serverUrl = getServerUrl()

					const mainQuestsMap = yield* Effect.forEach(
						maps,
						map =>
							Effect.sync(() => {
								const mainQuestPath = Option.getOrThrow(map.mainQuest)
								const { lastModified } = getLastModified(mainQuestPath)
								return {
									url: `${serverUrl}/main-quests/${map.game}/${map.id}`,
									lastModified: new Date(lastModified),
								}
							}),
						{ concurrency: "unbounded" },
					)

					const sideQuestsMap = yield* Effect.forEach(
						sideQuests,
						quest =>
							Effect.sync(() => {
								const { lastModified } = getLastModified(quest.content)
								const map = Option.getOrThrow(getMapByKey(quest.map))
								return {
									url: `${serverUrl}/side-quests/${map.game}/${map.id}/${quest.id}`,
									lastModified: new Date(lastModified),
								}
							}),
						{ concurrency: "unbounded" },
					)

					const zombiesMap = zombies.map(z => {
						const { lastModified } = getLastModified(z.combatStrategy)
						return {
							url: `${serverUrl}/bestiary/${z.id}`,
							lastModified: new Date(lastModified),
						}
					})

					const relicsMap = yield* Effect.forEach(
						relics,
						relic =>
							Effect.sync(() => {
								const { lastModified } = getLastModified(relic.content)
								const map = Option.getOrThrow(getMapByKey(relic.map))
								return {
									url: `${serverUrl}/relics/${map.game}/${relic.id}`,
									lastModified: new Date(lastModified),
								}
							}),
						{ concurrency: "unbounded" },
					)

					const firstEntries = [
						mainQuestsMap[0],
						sideQuestsMap[0],
						zombiesMap[0],
						relicsMap[0],
					].filter((entry): entry is NonNullable<typeof entry> => entry != null)

					const first = firstEntries[0]
					const mostRecentLastModified =
						first != null
							? firstEntries.reduce(
									(latest, entry) => (entry.lastModified > latest ? entry.lastModified : latest),
									first.lastModified,
								)
							: undefined

					const mostRecentMainQuest = Arr.head(maps).pipe(
						Option.map(quest => getLastModified(`content/main-quests/${quest.id}` as ContentPaths)),
						Option.getOrThrow,
					)
					const mostRecentSideQuest = Arr.head(sideQuests).pipe(
						Option.map(quest => getLastModified(`content/side-quests/${quest.id}` as ContentPaths)),
						Option.getOrThrow,
					)
					const mostRecentZombie = Arr.head(zombies).pipe(
						Option.map(zombie => getLastModified(`content/zombies/${zombie.id}` as ContentPaths)),
						Option.getOrThrow,
					)
					const mostRecentRelic = Arr.head(relics).pipe(
						Option.map(relic => getLastModified(`content/relics/${relic.id}` as ContentPaths)),
						Option.getOrThrow,
					)

					const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${serverUrl}</loc>
    <lastmod>${mostRecentLastModified?.toUTCString()}</lastmod>
  </url>
  <url>
    <loc>${serverUrl}/main-quests</loc>
    <lastmod>${new Date(mostRecentMainQuest.lastModified).toUTCString()}</lastmod>
  </url>
  ${mainQuestsMap
		.map(
			entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toUTCString()}</lastmod>
  </url>`,
		)
		.join("")}
  <url>
    <loc>${serverUrl}/side-quests</loc>
    <lastmod>${new Date(mostRecentSideQuest.lastModified).toUTCString()}</lastmod>
  </url>
  ${sideQuestsMap
		.map(
			entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toUTCString()}</lastmod>
  </url>`,
		)
		.join("")}
  <url>
    <loc>${serverUrl}/bestiary</loc>
    <lastmod>${new Date(mostRecentZombie.lastModified).toUTCString()}</lastmod>
  </url>
  ${zombiesMap
		.map(
			entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toUTCString()}</lastmod>
  </url>`,
		)
		.join("")}
  <url>
    <loc>${serverUrl}/maps</loc>
    <changefreq>monthly</changefreq>
  </url>
  ${interactiveMaps
		.map(
			entry => `
  <url>
    <loc>${serverUrl}/maps/${entry.id}</loc>
  </url>`,
		)
		.join("")}
  <url>
    <loc>${serverUrl}/relics</loc>
    <lastmod>${new Date(mostRecentRelic.lastModified).toUTCString()}</lastmod>
  </url>
  ${relicsMap
		.map(
			entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toUTCString()}</lastmod>
  </url>`,
		)
		.join("")}
</urlset>`

					return new Response(sitemap, {
						headers: {
							"Content-Type": "application/xml",
							// CDN Edge: long-lived; new deploy purges CDN cache
							"CDN-Cache-Control": "public, max-age=0, s-maxage=31536000",
							// Browsers: store allowed, but treat as stale immediately → revalidate before use
							"Cache-Control": "public, max-age=0, must-revalidate",
						},
					})
				}).pipe(
					Effect.tapCause(cause => Effect.logError(cause)),
					Effect.die,
					Effect.runPromise,
				)
			},
		},
	},
})
