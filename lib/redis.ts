import "server-only"
import { env } from "@/env"
import type { EntryStatus, EntryType } from "@/types/EntryEnforcement"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { EntryNotFoundError } from "@/types/Error"
import { Console, Effect, Schema } from "effect"
import { CacheService } from "./services/CacheService"

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(5, "10s", 100),
  analytics: true,
})

export const EntryResponseSchema = Schema.Struct({
  createdAt: Schema.Date,
  status: Schema.Literal("Coming Soon", "Published"),
  type: Schema.Literal("mainQuest", "sideQuest", "game", "zombie", "legal")
})

export const NEW_ENTRY_KV = {
  key: "contentful:new-entries" as const,
  /**
   * Retrieves an entry by its ID from Cache.
   * @param entryId - The ID of the entry to retrieve.
   * @returns An Effect that succeeds with the entry data if found, null otherwise.
   */
  get(entryId: string) {
    return Effect.gen(this, function*() {
      const cache = yield* CacheService
      const response = yield* cache.hget(this.key, entryId)
      const decodedResponse = yield* Schema.decodeUnknown(EntryResponseSchema)(response)
      return decodedResponse
    }).pipe(
      Effect.tapError(error => Console.error(error)),
      Effect.catchAll(() => Effect.succeed(null))
    )
  },
  /**
   * Retrieves all entries from Cache.
   * @returns An Effect that succeeds with an array of all entry responses, null otherwise.
   */
  getAll() {
    return Effect.gen(this, function*() {
      const cache = yield* CacheService
      const response = yield* cache.hgetall(this.key)
      if (!response) return null

      return yield* Effect.all(Object.entries(response).map(([entryId, entryData]) => Effect.gen(function*() {
        const decodedResponse = yield* Schema.decodeUnknown(EntryResponseSchema)(entryData)
        return {
          entryId,
          ...decodedResponse
        }
      })), { concurrency: "unbounded" })
    }).pipe(
      Effect.tapError(error => Console.error(error)),
      Effect.catchAll(() => Effect.succeed(null))
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
    return Effect.gen(this, function*() {
      const cache = yield* CacheService
      const encodedResponse = yield* Schema.encodeUnknown(EntryResponseSchema)({
        createdAt,
        status,
        type
      })

      return yield* cache.hset(this.key, {
        [entryId]: JSON.stringify(encodedResponse)
      })
    }).pipe(
      Effect.tapError(error => Console.error(error)),
      Effect.catchAll(() => Effect.succeed(0))
    )
  },
  /**
   * Deletes entries from Cache by their IDs.
   * @param entryIds - The IDs of the entries to delete.
   * @returns An Effect that succeeds with the number of entries that were deleted.
   */
  del(entryIds: string[]) {
    return Effect.gen(this, function*() {
      const cache = yield* CacheService
      return yield* cache.hdel(this.key, entryIds)
    }).pipe(
      Effect.tapError(error => Console.error(error)),
      Effect.catchAll(() => Effect.succeed(0))
    )
  },
}

export const getNewEntries = () => Effect.gen(function*() {
  const data = yield* NEW_ENTRY_KV.getAll()
  if (!data) return []

  return data
}).pipe(Effect.withLogSpan("get_new_entries"))

export const storeNewEntryId = (entryId: string, createdAt: Date, status: EntryStatus, type: EntryType) => {
  return NEW_ENTRY_KV.set(entryId, createdAt, status, type).pipe(Effect.withLogSpan("store_new_entry_id"))
}

export const getEntryStatus = (entryId: string) => Effect.gen(function*() {
  const data = yield* NEW_ENTRY_KV.get(entryId)
  if (!data) return yield* Effect.fail(new EntryNotFoundError({
    message: `No data found for entry ID: ${entryId}`,
    cause: null
  }))

  return data.status
}).pipe(Effect.withLogSpan("get_entry_status"))

export const updateEntryStatus = (entryId: string, updatedAt: Date, type: EntryStatus) => Effect.gen(function*() {
  const data = yield* NEW_ENTRY_KV.get(entryId)
  if (!data) return yield* Effect.fail(new EntryNotFoundError({
    message: `No data found for entry ID: ${entryId}`,
    cause: null
  }))

  return yield* NEW_ENTRY_KV.set(entryId, updatedAt, type, data.type)
}).pipe(Effect.withLogSpan("update_entry_status"))