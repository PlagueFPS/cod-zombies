import "server-only"
import type { Entry } from "contentful"
import type { TypeSideQuestsSkeleton } from "@/types/contentful-types"
import { Array as Arr, Effect, Order } from "effect"
import { unstable_cache } from "next/cache"
import { cache } from "react"
import { getNewEntries } from "@/lib/redis"
import { CMS } from "@/lib/services/CMS"
import { CACHE_KEYS } from "@/utils/constants"
import {
	calculateTimeToRead,
	createImageDto,
	createMapCategoryDto,
	createQuestMapDto,
} from "@/utils/contentful-utils"
import { DataLayer } from "./utils"

export type SideQuest = NonNullable<Awaited<ReturnType<typeof getQuestBySlug>>>
export type MinifiedSideQuest = Awaited<ReturnType<typeof getQuests>>[number]
export type SideQuestById = NonNullable<Awaited<ReturnType<typeof getQuestById>>>

export const getQuests = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const [quests, questIds] = yield* Effect.all([INTERNAL_getSideQuestData(), getQuestIds], {
					concurrency: "unbounded",
				})

				return quests.map(quest => {
					const { category: game, timeToRead, ...questData } = resolveQuestData(quest, questIds)
					return {
						...questData,
						game,
						id: quest.sys.id,
						updatedAt: quest.sys.updatedAt,
						isComingSoon: quest.fields.isComingSoon ?? false,
						title: quest.fields.title,
						slug: quest.fields.slug,
						description: quest.fields.description,
					}
				})
			}).pipe(
				Effect.withLogSpan("get_quests"),
				Effect.ensureErrorType<never>(),
				Effect.provide(DataLayer),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.sideQuests.all],
		},
	),
)

export const getQuestSearchData = cache(
	unstable_cache(
		async () => {
			return await Effect.gen(function* () {
				const quests = yield* INTERNAL_getSideQuestData()
				const currentQuests = quests.filter(q => !q.fields.isComingSoon)

				return currentQuests.map(quest => ({
					id: quest.sys.id,
					title: quest.fields.title,
					slug: quest.fields.slug,
					game: createMapCategoryDto(quest.fields.game),
					map: createQuestMapDto(quest.fields.map),
				}))
			}).pipe(
				Effect.withLogSpan("get_quest_search_data"),
				Effect.ensureErrorType<never>(),
				Effect.provide(CMS.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.sideQuests.all],
		},
	),
)

export const getQuestById = cache(
	unstable_cache(
		async (id: string) => {
			return await Effect.gen(function* () {
				const quests = yield* INTERNAL_getSideQuestData()

				const quest = quests.find(q => q.sys.id === id)
				if (!quest) {
					yield* Effect.logWarning(`Quest with id ${id} not found`)
					return null
				}

				const map = createQuestMapDto(quest.fields.map)
				const game = createMapCategoryDto(quest.fields.game)
				const timeToRead = calculateTimeToRead(quest.fields.content)

				return {
					id: quest.sys.id,
					updatedAt: quest.sys.updatedAt,
					slug: quest.fields.slug,
					title: quest.fields.title,
					description: quest.fields.description,
					image: createImageDto(quest.fields.image),
					isComingSoon: quest.fields.isComingSoon ?? false,
					map: map.slug,
					game: game.slug,
					timeToRead,
				}
			}).pipe(
				Effect.withLogSpan("get_quest_by_id"),
				Effect.annotateLogs({ id }),
				Effect.ensureErrorType<never>(),
				Effect.provide(CMS.Default),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.sideQuests.all],
		},
	),
)

export const getQuestBySlug = cache(
	unstable_cache(
		async (slug: string) => {
			return await Effect.gen(function* () {
				const quests = yield* INTERNAL_getSideQuestData()

				const quest = quests.find(q => q.fields.slug === slug)
				if (!quest) {
					yield* Effect.logWarning(`Quest with slug ${slug} not found`)
					return null
				}

				const questIds = yield* getQuestIds
				const { category: game, ...rest } = resolveQuestData(quest, questIds)

				return {
					...rest,
					game,
					id: quest.sys.id,
					updatedAt: quest.sys.updatedAt,
					isComingSoon: quest.fields.isComingSoon ?? false,
					title: quest.fields.title,
					slug: quest.fields.slug,
					description: quest.fields.description,
					content: quest.fields.content,
				}
			}).pipe(
				Effect.withLogSpan("get_quest_by_slug"),
				Effect.annotateLogs({ slug }),
				Effect.ensureErrorType<never>(),
				Effect.provide(DataLayer),
				Effect.runPromise,
			)
		},
		[],
		{
			tags: [CACHE_KEYS.sideQuests.all],
		},
	),
)

export const getSideQuest = Effect.fnUntraced(function* (id: string) {
	const { getEntry } = yield* CMS
	return yield* getEntry<TypeSideQuestsSkeleton>(id).pipe(
		Effect.map(quest => ({
			id: quest.sys.id,
			updatedAt: quest.sys.updatedAt,
			slug: quest.fields.slug,
			title: quest.fields.title,
			description: quest.fields.description,
			image: createImageDto(quest.fields.image),
			isComingSoon: quest.fields.isComingSoon ?? false,
			map: createQuestMapDto(quest.fields.map).slug,
			game: createMapCategoryDto(quest.fields.game).slug,
			timeToRead: calculateTimeToRead(quest.fields.content),
		})),
	)
}, Effect.withLogSpan("get_side_quest"))

const resolveQuestData = (
	quest: Entry<TypeSideQuestsSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>,
	questIds: Effect.Effect.Success<typeof getQuestIds>,
) => {
	const { changedIds, draftIds, newIds } = questIds
	const map = createQuestMapDto(quest.fields.map)
	const category = createMapCategoryDto(quest.fields.game)
	const image = createImageDto(quest.fields.image)
	const isDraft = draftIds.has(quest.sys.id)
	const isChanged = changedIds.has(quest.sys.id)
	const isNew = newIds.has(quest.sys.id)
	const timeToRead = calculateTimeToRead(quest.fields.content)

	return {
		image,
		map,
		category,
		isDraft,
		isChanged,
		isNew,
		timeToRead,
	}
}

const getQuestIds = Effect.gen(function* () {
	const [quests, newEntries] = yield* Effect.all(
		[INTERNAL_getManagementSideQuestData(), getNewEntries],
		{
			concurrency: "unbounded",
		},
	)

	const draftIds = new Set<string>()
	const changedIds = new Set<string>()
	const newIds = new Set<string>()

	quests.forEach(quest => {
		if (!quest.sys.publishedVersion) {
			draftIds.add(quest.sys.id)
		} else if (
			!!quest.sys.publishedVersion &&
			quest.sys.version >= quest.sys.publishedVersion + 2
		) {
			changedIds.add(quest.sys.id)
		}
	})

	newEntries.forEach(entry => {
		if (entry.type !== "sideQuest") return
		newIds.add(entry.entryId)
	})

	return { newIds, draftIds, changedIds }
}).pipe(Effect.withLogSpan("get_quest_ids"))

const INTERNAL_getManagementSideQuestData = cache(() =>
	Effect.gen(function* () {
		const { getManagementEntries } = yield* CMS
		const quests = yield* getManagementEntries("sideQuests")
		return quests.items
	}).pipe(
		Effect.withLogSpan("internal_get_management_side_quest_data"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)

const INTERNAL_getSideQuestData = cache(() =>
	Effect.gen(function* () {
		const { getEntries } = yield* CMS
		const quests = yield* getEntries<TypeSideQuestsSkeleton>({
			content_type: "sideQuests",
			select: ["sys.id", "sys.updatedAt", "fields"],
			order: ["-sys.createdAt"],
		})

		const byMapDate = Order.mapInput(Order.Date, (quest: (typeof quests.items)[number]) => {
			const map = quest.fields.map

			return new Date(map?.fields.releaseDate ?? quest.sys.createdAt)
		})

		return Arr.sort(quests.items, Order.reverse(byMapDate))
	}).pipe(
		Effect.withLogSpan("internal_get_side_quest_data"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed([])),
	),
)
