import { createFileRoute } from "@tanstack/react-router"
import { Effect, Array as Arr, Option } from "effect"
import { getInteractiveMaps } from "@/data/interactive-map"
import { getMapByKey, getMapsWithMainQuest } from "@/data/maps"
import { getRelics } from "@/data/relics"
import { getSideQuests } from "@/data/side-quests"
import { getZombies } from "@/data/zombies"
import { isComingSoon } from "@/utils/content-state"
import { getLastModified } from "@/utils/functions.server"
import { getServerUrl } from "@/utils/request.server"
import { dateFrom } from "@/utils/system-time"

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () =>
				await Effect.gen(function* () {
					const interactiveMaps = Arr.filter(getInteractiveMaps(), map => !isComingSoon(map.state))
					const maps = Arr.filter(getMapsWithMainQuest(), map => !isComingSoon(map.state))
					const sideQuests = Arr.filter(getSideQuests(), quest => !isComingSoon(quest.state))
					const zombies = Arr.filter(getZombies(), zombie => !isComingSoon(zombie.state))
					const relics = Arr.filter(getRelics(), relic => !isComingSoon(relic.state))
					const serverUrl = getServerUrl()

					const mainQuestsMap = yield* Effect.forEach(
						maps,
						map =>
							Effect.sync(() => {
								const mainQuestPath = Option.getOrThrow(map.mainQuest)
								const { lastModified } = getLastModified(mainQuestPath)

								return {
									url: `${serverUrl}/main-quests/${map.game}/${map.id}`,
									lastModified: dateFrom(lastModified),
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
									lastModified: dateFrom(lastModified),
								}
							}),
						{ concurrency: "unbounded" },
					)

					const zombiesMap = Arr.map(zombies, z => {
						const { lastModified } = getLastModified(z.combatStrategy)

						return {
							url: `${serverUrl}/bestiary/${z.id}`,
							lastModified: dateFrom(lastModified),
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
									lastModified: dateFrom(lastModified),
								}
							}),
						{ concurrency: "unbounded" },
					)

					const firstEntries = Arr.filter(
						[mainQuestsMap[0], sideQuestsMap[0], zombiesMap[0], relicsMap[0]],
						(entry): entry is NonNullable<typeof entry> => entry != null,
					)

					const first = firstEntries[0]

					const mostRecentLastModified =
						first != null
							? Arr.reduce(firstEntries, first.lastModified, (latest, entry) =>
									entry.lastModified > latest ? entry.lastModified : latest,
								)
							: undefined

					const mostRecentMainQuest = Arr.head(maps).pipe(
						Option.map(quest => getLastModified(`content/main-quests/${quest.id}`)),
						Option.getOrThrow,
					)

					const mostRecentSideQuest = Arr.head(sideQuests).pipe(
						Option.map(quest => getLastModified(`content/side-quests/${quest.id}`)),
						Option.getOrThrow,
					)

					const mostRecentZombie = Arr.head(zombies).pipe(
						Option.map(zombie => getLastModified(`content/zombies/${zombie.id}`)),
						Option.getOrThrow,
					)

					const mostRecentRelic = Arr.head(relics).pipe(
						Option.map(relic => getLastModified(`content/relics/${relic.id}`)),
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
    <lastmod>${dateFrom(mostRecentMainQuest.lastModified).toUTCString()}</lastmod>
  </url>
  ${Arr.join(
		Arr.map(
			mainQuestsMap,
			entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toUTCString()}</lastmod>
  </url>`,
		),
		"",
	)}
  <url>
    <loc>${serverUrl}/side-quests</loc>
    <lastmod>${dateFrom(mostRecentSideQuest.lastModified).toUTCString()}</lastmod>
  </url>
  ${Arr.join(
		Arr.map(
			sideQuestsMap,
			entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toUTCString()}</lastmod>
  </url>`,
		),
		"",
	)}
  <url>
    <loc>${serverUrl}/bestiary</loc>
    <lastmod>${dateFrom(mostRecentZombie.lastModified).toUTCString()}</lastmod>
  </url>
  ${Arr.join(
		Arr.map(
			zombiesMap,
			entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toUTCString()}</lastmod>
  </url>`,
		),
		"",
	)}
  <url>
    <loc>${serverUrl}/maps</loc>
    <changefreq>monthly</changefreq>
  </url>
  ${Arr.join(
		Arr.map(
			interactiveMaps,
			entry => `
  <url>
    <loc>${serverUrl}/maps/${entry.id}</loc>
  </url>`,
		),
		"",
	)}
  <url>
    <loc>${serverUrl}/relics</loc>
    <lastmod>${dateFrom(mostRecentRelic.lastModified).toUTCString()}</lastmod>
  </url>
  ${Arr.join(
		Arr.map(
			relicsMap,
			entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toUTCString()}</lastmod>
  </url>`,
		),
		"",
	)}
</urlset>`

					return new Response(sitemap, {
						headers: {
							"Content-Type": "application/xml",
							"CDN-Cache-Control": "public, max-age=0, s-maxage=31536000",
							"Cache-Control": "public, max-age=0, must-revalidate",
						},
					})
				}).pipe(
					Effect.tapCause(cause => Effect.logError(cause)),
					Effect.runPromise,
				),
		},
	},
})
