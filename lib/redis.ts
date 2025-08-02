import "server-only"
import { createHash } from "node:crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { Duration, Effect, Redacted, Schema, Struct } from "effect"
import { headers } from "next/headers"
import { after } from "next/server"
import { env } from "@/env"
import {
	DeleteEntryError,
	EntryNotFoundError,
	GetEntriesError,
	RatelimitExceededError,
	SetEntryError,
	UpdateEntryStatusError,
} from "@/types/errors"
import { Cache } from "./services/Cache"

export const redis = new Redis({
	url: Redacted.value(env.REDIS_URL),
	token: Redacted.value(env.REDIS_TOKEN),
})

export const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.tokenBucket(5, "1m", 10),
	analytics: true,
	enableProtection: true,
})

export const revalidateRateLimit = new Ratelimit({
	redis,
	limiter: Ratelimit.tokenBucket(5, "1s", 5),
})

const EntryResponseSchema = Schema.Struct({
	createdAt: Schema.Date,
	status: Schema.Literal("Coming Soon", "Published"),
	type: Schema.Literal("mainQuest", "sideQuest", "game", "zombie", "legal"),
})

export type EntryStatus = Schema.Schema.Type<typeof EntryResponseSchema>["status"]
export type EntryType = Schema.Schema.Type<typeof EntryResponseSchema>["type"]

export const decodeEntryResponse = Schema.decodeUnknown(EntryResponseSchema)
export const encodeEntryResponse = Schema.encodeUnknown(EntryResponseSchema)

/**
 * An object that provides methods to interact with the new entries cache.
 */
export const NEW_ENTRY_KV = {
	key: "contentful:new-entries" as const,
	/**
	 * Retrieves an entry by its ID from Cache.
	 * @param entryId - The ID of the entry to retrieve.
	 * @returns An Effect that succeeds with the entry data if found, null otherwise.
	 */
	get(entryId: string) {
		return Effect.gen(this, function* () {
			const cache = yield* Cache
			const response = yield* cache.hget(this.key, entryId)
			const decodedResponse = yield* decodeEntryResponse(response)
			return decodedResponse
		}).pipe(
			Effect.mapError(
				error =>
					new GetEntriesError({
						message: `Failed to get value for entry: ${entryId}`,
						cause: error,
					}),
			),
		)
	},
	/**
	 * Retrieves all entries from Cache.
	 * @returns An Effect that succeeds with an array of all entry responses, null otherwise.
	 */
	getAll() {
		return Effect.gen(this, function* () {
			const cache = yield* Cache
			const response = yield* cache.hgetall(this.key)
			if (!response) {
				yield* Effect.logWarning(`No entries stored in ${this.key}`)
				return []
			}

			return yield* Effect.all(
				Struct.entries(response).map(([entryId, entryData]) =>
					Effect.gen(function* () {
						const decodedResponse = yield* decodeEntryResponse(entryData)
						return {
							entryId,
							...decodedResponse,
						}
					}),
				),
				{ concurrency: "unbounded" },
			)
		}).pipe(
			Effect.mapError(
				error => new GetEntriesError({ message: "Failed to get all entries.", cause: error }),
			),
		)
	},
	/**
	 * Sets a new entry in Cache.
	 * @param entryId - The ID of the entry.
	 * @param createdAt - The creation date of the entry.
	 * @param status - The status of the entry.
	 * @param type - The type of the entry.
	 * @returns An Effect that succeeds with the number of fields that were added.
	 */
	set(entryId: string, createdAt: Date, status: EntryStatus, type: EntryType) {
		return Effect.gen(this, function* () {
			const cache = yield* Cache
			const encodedResponse = yield* encodeEntryResponse({
				createdAt,
				status,
				type,
			})

			return yield* cache.hset(this.key, {
				[entryId]: JSON.stringify(encodedResponse),
			})
		}).pipe(
			Effect.mapError(
				error => new SetEntryError({ message: `Failed to set entry: ${entryId}`, cause: error }),
			),
		)
	},
	/**
	 * Deletes entries from Cache by their IDs.
	 * @param entryIds - The IDs of the entries to delete.
	 * @returns An Effect that succeeds with the number of entries that were deleted.
	 */
	del(entryIds: string[]) {
		return Effect.gen(this, function* () {
			const cache = yield* Cache
			return yield* cache.hdel(this.key, entryIds)
		}).pipe(
			Effect.mapError(
				error =>
					new DeleteEntryError({
						message: `Failed to delete the following entries: ${entryIds}`,
						cause: error,
					}),
			),
		)
	},
} as const

/**
 * An object that provides methods to interact with the image cache.
 */
export const IMAGE_CACHE = {
	/**
	 * Generates the cache key for the given slug.
	 * @param slug - The slug to generate the key for.
	 * @returns The cache key.
	 */
	generateKey(slug: string) {
		return `og-image-${slug}`
	},
	/**
	 * Retrieves the cached image reference for the given slug.
	 * @param slug - The slug to retrieve the image reference for.
	 * @returns An Effect that succeeds with the cached image reference if found, null otherwise.
	 */
	get(slug: string) {
		return Effect.gen(this, function* () {
			const cache = yield* Cache
			const response = yield* cache.get(this.generateKey(slug))
			if (!response) return null

			const decodedResponse = yield* Schema.decodeUnknown(Schema.String)(response)
			return decodedResponse
		}).pipe(Effect.withLogSpan("get_image_cache"), Effect.annotateLogs("slug", slug))
	},
	/**
	 * Sets the cached image reference for the given slug.
	 * @param slug - The slug to set the image for.
	 * @param value - The image reference to cache.
	 * @returns An Effect that succeeds when the image reference is cached.
	 */
	set(slug: string, value: string) {
		return Effect.gen(this, function* () {
			const cache = yield* Cache
			return yield* cache.set(this.generateKey(slug), value)
		}).pipe(Effect.withLogSpan("set_image_cache"), Effect.annotateLogs("slug", slug))
	},
} as const

export const getNewEntries = NEW_ENTRY_KV.getAll().pipe(
	Effect.withLogSpan("get_new_entries"),
	Effect.tapError(Effect.logError),
	Effect.catchAll(() => Effect.succeed([])),
)

export const storeNewEntryId = (
	entryId: string,
	createdAt: Date,
	status: EntryStatus,
	type: EntryType,
) =>
	Effect.gen(function* () {
		const result = yield* NEW_ENTRY_KV.set(entryId, createdAt, status, type)
		yield* Effect.log(`Stored ${result} new entry ID: ${entryId}`)
		return result
	}).pipe(Effect.withLogSpan("store_new_entry_id"), Effect.annotateLogs("entryId", entryId))

export const getEntryStatus = (entryId: string) =>
	Effect.gen(function* () {
		const { status } = yield* NEW_ENTRY_KV.get(entryId)
		return status
	}).pipe(
		Effect.withLogSpan("get_entry_status"),
		Effect.annotateLogs("entryId", entryId),
		Effect.tapError(Effect.logError),
		Effect.catchAll(() => Effect.succeed(null)),
	)

export const updateEntryStatus = (entryId: string, updatedAt: Date, type: EntryStatus) =>
	Effect.gen(function* () {
		const data = yield* NEW_ENTRY_KV.get(entryId)
		if (!data)
			return yield* new EntryNotFoundError({
				message: `No data found for entry ID: ${entryId}`,
				cause: null,
			})

		const result = yield* NEW_ENTRY_KV.set(entryId, updatedAt, type, data.type)
		yield* Effect.log(`Updated ${result} entry status to "${type}": ${entryId}`)
		return result
	}).pipe(
		Effect.withLogSpan("update_entry_status"),
		Effect.annotateLogs("entryId", entryId),
		Effect.mapError(
			error =>
				new UpdateEntryStatusError({
					message: `Failed to update entry status for entry ID: ${entryId}`,
					cause: error,
				}),
		),
	)

export const checkRatelimit = async () => {
	const headerList = await headers()
	const ip = headerList.get("x-forwarded-for") || "127.0.0.1"
	const userAgent = headerList.get("user-agent")
	const identifier = createHash("sha256").update(`${ip}:${userAgent}`).digest("hex")
	const { success, pending, reason, reset } = await ratelimit.limit(identifier, { ip })

	after(async () => await pending)

	if (!success) {
		const resetTime = new Date(reset).getTime()
		const remainingTime = Duration.subtract(resetTime, Date.now()).pipe(Duration.toMillis)

		const error = new RatelimitExceededError({
			message: `Too many requests. Please try again in ${remainingTime}ms`,
			cause: reason,
		})

		console.error(error)

		return {
			success: false,
			message: error.message,
		}
	}

	return { success }
}
