import "server-only"
import type { IZombieRelease } from "@/emails/ZombieReleaseEmail"
import type { TAllowedSlugs } from "./validation-schemas"
import { Effect } from "effect"
import { revalidateTag } from "next/cache"
import { getGameById } from "@/data/games"
import { getLegalDocById } from "@/data/legal"
import { getMapById } from "@/data/maps"
import { getImageUrl } from "@/data/og-images"
import { getQuestById } from "@/data/side-quests"
import { getZombieById } from "@/data/zombies"
import { env } from "@/env"
import { getEntryStatus, storeNewEntryId, updateEntryStatus } from "@/lib/redis"
import { EntryNotFoundError } from "@/types/errors"
import {
	sendLegalUpdateBroadcast,
	sendQuestReleaseBroadcast,
	sendZombieReleaseBroadcast,
} from "@/usecases/email"
import { CACHE_KEYS } from "./constants"
import { isFirstTimePublish } from "./contentful-utils"

interface RevalidateData {
	entryId: string
	createdAt: Date
	updatedAt: Date
}

export interface BroadcastEntry {
	id: string
	title: string
	slug: string
	description: string
	image: {
		url: string | undefined
		width: number | undefined
		height: number | undefined
	}
}

interface BroadcastResponse {
	success: boolean
	message: string
}

const createSuccessResponse = (message: string, broadcast: BroadcastResponse | null) =>
	Response.json({ revalidated: true, message, broadcast }, { status: 201 })

const sendQuestBroadcast = <T extends BroadcastEntry>(
	type: "Main" | "Side",
	entryType: TAllowedSlugs,
	entry: T,
	redirectUrl: string,
) =>
	Effect.gen(function* () {
		const imageUrl = yield* getImageUrl(entryType, entry)
		return yield* sendQuestReleaseBroadcast({ type, redirectUrl, imageUrl, ...entry })
	}).pipe(
		Effect.withLogSpan("send_quest_broadcast"),
		Effect.tapError(Effect.logError),
		Effect.catchAll(error => Effect.succeed({ success: false, message: error.message })),
	)

const sendZombieBroadcast = (
	entry: NonNullable<Awaited<ReturnType<typeof getZombieById>>>,
	redirectUrl: string,
) =>
	Effect.gen(function* () {
		const imageUrl = yield* getImageUrl("zombies", entry)
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
			const map = yield* Effect.promise(() => getMapById(true, entryId))
			if (!map)
				return yield* new EntryNotFoundError({
					message: `No map found for entry ID: ${entryId}`,
					cause: null,
				})

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
			Effect.tap(() => Effect.log(`Successfully revalidated map data`)),
			Effect.annotateLogs("entryId", entryId),
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
			const game = yield* Effect.promise(() => getGameById(true, entryId))
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
			Effect.tap(() => Effect.log(`Successfully revalidated game data`)),
			Effect.annotateLogs("entryId", entryId),
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
			const quest = yield* Effect.promise(() => getQuestById(true, entryId))
			if (!quest)
				return yield* new EntryNotFoundError({
					message: `No quest found for entry ID: ${entryId}`,
					cause: null,
				})

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
			Effect.tap(() => Effect.log("Successfully revalidated side quest data")),
			Effect.annotateLogs("entryId", entryId),
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
			const zombie = yield* Effect.promise(() => getZombieById(true, entryId))
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
			Effect.tap(() => Effect.log("Successfully revalidated zombies data")),
			Effect.annotateLogs("entryId", entryId),
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
			const legalDoc = yield* Effect.promise(() => getLegalDocById(true, entryId))
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
			Effect.tap(() => Effect.log("Successfully revalidated legal docs data")),
			Effect.annotateLogs("entryId", entryId),
		),
}
