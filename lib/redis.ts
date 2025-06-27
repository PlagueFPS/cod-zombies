import "server-only"
import { env } from "@/env"
import type { EntryStatus, EntryType } from "@/types/EntryEnforcement"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { EntryNotFoundError, GetCacheValueError, GetEntriesError, GetEntryStatusError, StoreNewEntryError, UpdateEntryStatusError } from "@/types/Error"
import { Effect, Schema } from "effect"
import { Cache } from "./services/Cache"

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.tokenBucket(5, "10s", 100),
  analytics: true,
})

const EntryResponseSchema = Schema.Struct({
  createdAt: Schema.Date,
  status: Schema.Literal("Coming Soon", "Published"),
  type: Schema.Literal("mainQuest", "sideQuest", "game", "zombie", "legal")
})

export const decodeEntryResponse = Schema.decodeUnknown(EntryResponseSchema)
export const encodeEntryResponse = Schema.encodeUnknown(EntryResponseSchema)

export const NEW_ENTRY_KV = {
  key: "contentful:new-entries" as const,
  /**
   * Retrieves an entry by its ID from Cache.
   * @param entryId - The ID of the entry to retrieve.
   * @returns An Effect that succeeds with the entry data if found, null otherwise.
   */
  get(entryId: string) {
    return Effect.gen(this, function*() {
      const cache = yield* Cache
      const response = yield* cache.hget(this.key, entryId)
      const decodedResponse = yield* decodeEntryResponse(response)
      return decodedResponse
    })
  },
  /**
   * Retrieves all entries from Cache.
   * @returns An Effect that succeeds with an array of all entry responses, null otherwise.
   */
  getAll() {
    return Effect.gen(this, function*() {
      const cache = yield* Cache
      const response = yield* cache.hgetall(this.key)
      if (!response) return yield* new GetCacheValueError({
        message: `No data found for key: ${this.key}`,
        cause: null
      })

      return yield* Effect.all(Object.entries(response).map(([entryId, entryData]) => Effect.gen(function*() {
        const decodedResponse = yield* decodeEntryResponse(entryData)
        return {
          entryId,
          ...decodedResponse
        }
      })), { concurrency: "unbounded" })
    })
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
      const cache = yield* Cache
      const encodedResponse = yield* encodeEntryResponse({
        createdAt,
        status,
        type
      })

      return yield* cache.hset(this.key, {
        [entryId]: JSON.stringify(encodedResponse)
      })
    })
  },
  /**
   * Deletes entries from Cache by their IDs.
   * @param entryIds - The IDs of the entries to delete.
   * @returns An Effect that succeeds with the number of entries that were deleted.
   */
  del(entryIds: string[]) {
    return Effect.gen(this, function*() {
      const cache = yield* Cache
      return yield* cache.hdel(this.key, entryIds)
    })
  },
}

export const getNewEntries = () => NEW_ENTRY_KV.getAll().pipe(
  Effect.withLogSpan("get_new_entries"),
  Effect.mapError(error => new GetEntriesError({
    message: "Failed to get new entries",
    cause: error
  }))
)

export const storeNewEntryId = (entryId: string, createdAt: Date, status: EntryStatus, type: EntryType) => 
  Effect.gen(function*() {
    const result = yield* NEW_ENTRY_KV.set(entryId, createdAt, status, type)
    yield* Effect.log(`Stored ${result} new entry ID: ${entryId}`)
    return result
  }).pipe(
    Effect.withLogSpan("store_new_entry_id"),
    Effect.mapError(error => new StoreNewEntryError({
      message: `Failed to store new entry ID: ${entryId}`,
      cause: error
    }))
)

export const getEntryStatus = (entryId: string) => Effect.gen(function*(){
  const { status } = yield* NEW_ENTRY_KV.get(entryId)
  return status
}).pipe(
  Effect.withLogSpan("get_entry_status"),
  Effect.mapError(error => new GetEntryStatusError({
    message: `Failed to get entry status for entry ID: ${entryId}`,
    cause: error
  }))
)

export const updateEntryStatus = (entryId: string, updatedAt: Date, type: EntryStatus) => 
  Effect.gen(function*() {
    const data = yield* NEW_ENTRY_KV.get(entryId)
    if (!data) return yield* new EntryNotFoundError({
      message: `No data found for entry ID: ${entryId}`,
      cause: null
    })

    const result = yield* NEW_ENTRY_KV.set(entryId, updatedAt, type, data.type)
    yield* Effect.log(`Updated ${result} entry status to "${type}": ${entryId}`)
    return result
  }).pipe(
    Effect.withLogSpan("update_entry_status"),
    Effect.mapError(error => new UpdateEntryStatusError({
      message: `Failed to update entry status for entry ID: ${entryId}`,
      cause: error
    }))
  )