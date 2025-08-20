import "server-only"
import type { FeaturedMapById } from "@/data/maps"
import type { SideQuestById } from "@/data/side-quests"
import type { ZombieById } from "@/data/zombies"
import type { IZombieRelease } from "@/emails/zombie-release-email"
import type {
	TypeFeaturedMapsSkeleton,
	TypeSideQuestsSkeleton,
	TypeZombiesSkeleton,
} from "@/types/contentful-types"
import type { TAllowedSlugs } from "./validation-schemas"
import { Effect, Schedule } from "effect"
import { revalidateTag } from "next/cache"
import { getLegalDocById } from "@/data/legal"
import { env } from "@/env"
import { getEntryStatus, storeNewEntryId, updateEntryStatus } from "@/lib/redis"
import { CMS } from "@/lib/services/CMS"
import { EntryNotFoundError } from "@/types/errors"
import {
	sendLegalUpdateBroadcast,
	sendQuestReleaseBroadcast,
	sendZombieReleaseBroadcast,
} from "@/usecases/email"
import { CACHE_KEYS } from "./constants"
import {
	calculateTimeToRead,
	createImageDto,
	createMapCategoryDto,
	createQuestMapDto,
	isFirstTimePublish,
} from "./contentful-utils"

interface RevalidateData {
	entryId: string
	createdAt: Date
	updatedAt: Date
}

interface BroadcastResponse {
	success: boolean
	message: string
}

export type BroadcastEntry = FeaturedMapById | SideQuestById | ZombieById

const createSuccessResponse = (message: string, broadcast: BroadcastResponse | null) =>
	Response.json({ revalidated: true, message, broadcast }, { status: 201 })

const sendQuestBroadcast = (
	type: "Main" | "Side",
	entryType: Extract<TAllowedSlugs, "maps" | "side-quests">,
	entry: FeaturedMapById | SideQuestById,
	redirectUrl: string,
) =>
	Effect.gen(function* () {
		const imageUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/preview-image/${entryType}/${entry.id}`
		return yield* sendQuestReleaseBroadcast({ type, redirectUrl, imageUrl, ...entry })
	}).pipe(
		Effect.withLogSpan("send_quest_broadcast"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(error => Effect.succeed({ success: false, message: error.message })),
	)

const sendZombieBroadcast = (entry: ZombieById, redirectUrl: string) =>
	Effect.gen(function* () {
		const imageUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/api/newsletter/preview-image/zombies/${entry.id}`
		const broadcastData: Omit<IZombieRelease, "unsubscribeUrl"> = {
			type: entry.type,
			title: entry.title,
			imageUrl,
			description: entry.description,
			redirectUrl,
		}

		return yield* sendZombieReleaseBroadcast(broadcastData)
	}).pipe(
		Effect.withLogSpan("send_zombie_broadcast"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(error => Effect.succeed({ success: false, message: error.message })),
	)

/**
 * Collection of revalidation handlers for different content types.
 * Each handler manages cache invalidation and status updates for its respective content type.
 */
export const RevalidateHandlers = {
	/**
	 * Handles revalidation for map entries.
	 * - Invalidates the featured maps cache
	 * - Manages entry status updates (Coming Soon/Published)
	 * - Sends notifications for new/updated maps
	 * @param params - The revalidation parameters
	 * @param params.entryId - The ID of the map entry
	 * @param params.createdAt - ISO timestamp of when the entry was created
	 * @param params.updatedAt - ISO timestamp of when the entry was last updated
	 * @returns An Effect that succeeds with the result of the revalidation
	 */
	maps: ({ entryId, createdAt, updatedAt }: RevalidateData) =>
		Effect.gen(function* () {
			const { getEntry } = yield* CMS
			const map = yield* getEntry<TypeFeaturedMapsSkeleton>(entryId).pipe(
				Effect.flatMap(map =>
					Effect.gen(function* () {
						const game = yield* createMapCategoryDto(map.fields.gameCategory)
						return {
							id: map.sys.id,
							updatedAt: map.sys.updatedAt,
							slug: map.fields.slug,
							title: map.fields.title,
							description: map.fields.description,
							isComingSoon: map.fields.isComingSoon ?? false,
							image: createImageDto(map.fields.image),
							game: game.slug,
							difficulty: map.fields.difficulty,
							timeToRead: calculateTimeToRead(map.fields.body),
						}
					}),
				),
			)

			const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game}/${map.slug}`
			let shouldBroadcast = false

			if (isFirstTimePublish(createdAt, updatedAt)) {
				const status = map.isComingSoon ? "Coming Soon" : "Published"
				yield* storeNewEntryId(entryId, createdAt, status, "mainQuest")

				if (!map.isComingSoon) shouldBroadcast = true
			} else {
				const status = yield* getEntryStatus(entryId)
				if (status === "Coming Soon" && !map.isComingSoon) {
					yield* updateEntryStatus(entryId, updatedAt, "Published")
					shouldBroadcast = true
				}
			}

			revalidateTag(CACHE_KEYS.featuredMaps.all)
			if (shouldBroadcast) {
				const broadcast = yield* sendQuestBroadcast("Main", "maps", map, url)
				return createSuccessResponse("Map revalidated", broadcast)
			}

			return createSuccessResponse("Map revalidated", null)
		}).pipe(
			Effect.withLogSpan("maps_revalidate_handler"),
			Effect.annotateLogs("entryId", entryId),
			Effect.tap(() => Effect.log(`Successfully revalidated map data`)),
			Effect.retry({
				times: 3,
				schedule: Schedule.exponential(200, 2),
				while: error => error._tag === "EntryNotFoundError",
			}),
		),

	/**
	 * Handles revalidation for game entries.
	 * - Invalidates the game categories cache
	 * - Manages entry status updates (Coming Soon/Published)
	 * @param params - The revalidation parameters
	 * @param params.entryId - The ID of the game entry
	 * @param params.createdAt - ISO timestamp of when the entry was created
	 * @param params.updatedAt - ISO timestamp of when the entry was last updated
	 * @returns An Effect that succeeds with the result of the revalidation
	 */
	games: ({ entryId, createdAt, updatedAt }: RevalidateData) =>
		Effect.gen(function* () {
			const { getEntry } = yield* CMS
			const game = yield* getEntry<TypeFeaturedMapsSkeleton>(entryId).pipe(
				Effect.map(game => ({
					id: game.sys.id,
					slug: game.fields.slug,
					isComingSoon: game.fields.isComingSoon ?? false,
				})),
			)
			if (!game)
				return yield* new EntryNotFoundError({
					message: `No game found for entry ID: ${entryId}`,
					cause: null,
				})

			if (isFirstTimePublish(createdAt, updatedAt)) {
				const status = game.isComingSoon ? "Coming Soon" : "Published"
				yield* storeNewEntryId(entryId, createdAt, status, "game")
			} else {
				const status = yield* getEntryStatus(entryId)
				if (status === "Coming Soon" && !game.isComingSoon) {
					yield* updateEntryStatus(entryId, updatedAt, "Published")
				}
			}

			revalidateTag(CACHE_KEYS.gameCategories.all)
			return createSuccessResponse("Game revalidated", null)
		}).pipe(
			Effect.withLogSpan("games_revalidate_handler"),
			Effect.annotateLogs("entryId", entryId),
			Effect.tap(() => Effect.log(`Successfully revalidated game data`)),
			Effect.retry({
				times: 3,
				schedule: Schedule.exponential(200, 2),
				while: error => error._tag === "EntryNotFoundError",
			}),
		),

	/**
	 * Handles revalidation for side quest entries.
	 * - Invalidates the side quests cache
	 * - Manages entry status updates (Coming Soon/Published)
	 * - Sends notifications for new/updated side quests
	 * @param params - The revalidation parameters
	 * @param params.entryId - The ID of the side quest entry
	 * @param params.createdAt - ISO timestamp of when the entry was created
	 * @param params.updatedAt - ISO timestamp of when the entry was last updated
	 * @returns An Effect that succeeds with the result of the revalidation
	 */
	"side-quests": ({ entryId, createdAt, updatedAt }: RevalidateData) =>
		Effect.gen(function* () {
			const { getEntry } = yield* CMS
			const quest = yield* getEntry<TypeSideQuestsSkeleton>(entryId).pipe(
				Effect.flatMap(quest =>
					Effect.gen(function* () {
						const map = yield* createQuestMapDto(quest.fields.map)
						const game = yield* createMapCategoryDto(quest.fields.game)
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
							timeToRead: calculateTimeToRead(quest.fields.content),
						}
					}),
				),
			)

			const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${quest.game}/${quest.map}/${quest.slug}`
			let shouldBroadcast = false

			if (isFirstTimePublish(createdAt, updatedAt)) {
				const status = quest.isComingSoon ? "Coming Soon" : "Published"
				yield* storeNewEntryId(entryId, createdAt, status, "sideQuest")

				if (!quest.isComingSoon) shouldBroadcast = true
			} else {
				const status = yield* getEntryStatus(entryId)
				if (status === "Coming Soon" && !quest.isComingSoon) {
					yield* updateEntryStatus(entryId, updatedAt, "Published")

					shouldBroadcast = true
				}
			}

			revalidateTag(CACHE_KEYS.sideQuests.all)
			if (shouldBroadcast) {
				const broadcast = yield* sendQuestBroadcast("Side", "side-quests", quest, url)
				return createSuccessResponse("Side Quest revalidated", broadcast)
			}

			return createSuccessResponse("Side Quest revalidated", null)
		}).pipe(
			Effect.withLogSpan("side_quests_revalidate_handler"),
			Effect.annotateLogs("entryId", entryId),
			Effect.tap(() => Effect.log("Successfully revalidated side quest data")),
			Effect.retry({
				times: 3,
				schedule: Schedule.exponential(200, 2),
				while: error => error._tag === "EntryNotFoundError",
			}),
		),

	/**
	 * Handles revalidation for zombie entries.
	 * - Invalidates the zombies cache
	 * - Manages entry status updates (Coming Soon/Published)
	 * - Sends notifications for new/updated zombies
	 * @param params - The revalidation parameters
	 * @param params.entryId - The ID of the zombie entry
	 * @param params.createdAt - ISO timestamp of when the entry was created
	 * @param params.updatedAt - ISO timestamp of when the entry was last updated
	 * @returns An Effect that succeeds with the result of the revalidation
	 */
	zombies: ({ entryId, createdAt, updatedAt }: RevalidateData) =>
		Effect.gen(function* () {
			const { getEntry } = yield* CMS
			const zombie = yield* getEntry<TypeZombiesSkeleton>(entryId).pipe(
				Effect.flatMap(zombie =>
					Effect.gen(function* () {
						const map = yield* createQuestMapDto(zombie.fields.maps[0])
						const game = yield* createMapCategoryDto(zombie.fields.games[0])
						return {
							id: zombie.sys.id,
							updatedAt: zombie.sys.updatedAt,
							slug: zombie.fields.slug,
							title: zombie.fields.name,
							type: zombie.fields.type,
							description: zombie.fields.description,
							image: createImageDto(zombie.fields.image),
							isComingSoon: zombie.fields.isComingSoon ?? false,
							game: game.title,
							map: map.title,
						}
					}),
				),
			)
			if (!zombie)
				return yield* new EntryNotFoundError({
					message: `No zombie found for entry ID: ${entryId}`,
					cause: null,
				})

			const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`
			let shouldBroadcast = false

			if (isFirstTimePublish(createdAt, updatedAt)) {
				const status = zombie.isComingSoon ? "Coming Soon" : "Published"
				yield* storeNewEntryId(entryId, createdAt, status, "zombie")

				if (!zombie.isComingSoon) shouldBroadcast = true
			} else {
				const status = yield* getEntryStatus(entryId)
				if (status === "Coming Soon" && !zombie.isComingSoon) {
					yield* updateEntryStatus(entryId, updatedAt, "Published")
					shouldBroadcast = true
				}
			}

			revalidateTag(CACHE_KEYS.zombies.all)
			if (shouldBroadcast) {
				const broadcast = yield* sendZombieBroadcast(zombie, url)
				return createSuccessResponse("Zombie revalidated", broadcast)
			}

			return createSuccessResponse("Zombie revalidated", null)
		}).pipe(
			Effect.withLogSpan("zombies_revalidate_handler"),
			Effect.annotateLogs("entryId", entryId),
			Effect.tap(() => Effect.log("Successfully revalidated zombies data")),
			Effect.retry({
				times: 3,
				schedule: Schedule.exponential(200, 2),
				while: error => error._tag === "EntryNotFoundError",
			}),
		),

	/**
	 * Handles revalidation for legal document entries.
	 * - Invalidates the legal documents cache
	 * - Sends notifications for updated legal documents
	 * @param params - The revalidation parameters
	 * @param params.entryId - The ID of the legal document entry
	 * @param params.createdAt - ISO timestamp of when the entry was created
	 * @param params.updatedAt - ISO timestamp of when the entry was last updated
	 * @returns An Effect that succeeds with the result of the revalidation
	 */
	legal: ({ entryId, createdAt, updatedAt }: RevalidateData) =>
		Effect.gen(function* () {
			const legalDoc = yield* Effect.promise(() => getLegalDocById(entryId))
			if (!legalDoc)
				return yield* new EntryNotFoundError({
					message: `No legal document found for entry ID: ${entryId}`,
					cause: null,
				})

			let shouldBroadcast = false

			// We broadcast on updates instead of first-time publish to notify users of policy changes
			if (!isFirstTimePublish(createdAt, updatedAt)) {
				shouldBroadcast = true
			}

			revalidateTag(CACHE_KEYS.legal.all)
			if (shouldBroadcast) {
				const broadcast = yield* sendLegalUpdateBroadcast
				return createSuccessResponse("Legal document revalidated", broadcast)
			}

			return createSuccessResponse("Legal document revalidated", null)
		}).pipe(
			Effect.withLogSpan("legal_revalidate_handler"),
			Effect.annotateLogs("entryId", entryId),
			Effect.tap(() => Effect.log("Successfully revalidated legal docs data")),
			Effect.retry({
				times: 3,
				schedule: Schedule.exponential(200, 2),
				while: error => error._tag === "EntryNotFoundError",
			}),
		),
}
