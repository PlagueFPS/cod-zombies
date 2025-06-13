import "server-only"
import { env } from "@/env"
import type { EntryStatus, EntryType } from "@/types/EntryEnforcement"
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { err, ok, Result } from "neverthrow"
import { EntryNotFoundError, UpstreamProviderError } from "@/types/Error"
import { tryCatch } from "@/utils/functions"

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "2m"),
  analytics: true,
})

interface RedisResponse {
  createdAt: string
  status: EntryStatus
  type: EntryType
}

interface EntryResponse extends RedisResponse {
  entryId: string
}

export const NEW_ENTRY_KV = {
  key: "contentful:new-entries",
  /**
   * Retrieves an entry by its ID from Redis.
   * @param entryId - The ID of the entry to retrieve.
   * @returns The entry data if found, null otherwise.
   */
  async get(entryId: string): Promise<EntryResponse | null> {
    const response = await redis.hget(this.key, entryId)

    if (!response) return null

    return {
      entryId,
      ...response
    } as EntryResponse
  },
  /**
   * Retrieves all entries from Redis.
   * @returns An array of all entry responses.
   */
  async getAll(): Promise<EntryResponse[]> {
    const response = await redis.hgetall(this.key)
    if (!response) return []

    return Object.entries(response).map(([entryId, entryData]) => {
      return {
        entryId,
        ...entryData as RedisResponse
      }
    }).filter(entry => entry !== null)
  },
  /**
   * Sets a new entry in Redis.
   * @param entryId - The ID of the entry.
   * @param createdAt - The creation timestamp.
   * @param status - The status of the entry.
   * @param type - The type of the entry.
   * @returns The number of fields that were added.
   */
  async set(entryId: string, createdAt: string, status: EntryStatus, type: EntryType) {
    return await redis.hset(this.key, {
      [entryId]: JSON.stringify({
        createdAt,
        status,
        type
      })
    })
  },
  /**
   * Deletes an entry from Redis by its ID.
   * @param entryId - The ID of the entry to delete.
   * @returns The number of fields that were removed.
   */
  async del(entryId: string) {
    return await redis.hdel(this.key, entryId)
  },
  /**
   * Deletes multiple entries from Redis by their IDs.
   * @param entryIds - An array of entry IDs to delete.
   * @returns The number of fields that were removed.
   */
  async delAll(entryIds: string[]) {
    return await redis.hdel(this.key, ...entryIds)
  }
}

export const getNewEntries = async () => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.getAll())
  if (error) {
    const upstreamError = new UpstreamProviderError(`Redis get all failed: ${error.message}`, { cause: error })
    console.error(upstreamError)
    return []
  }

  return data
}

export const storeNewEntryId = async (entryId: string, createdAt: string, status: EntryStatus, type: EntryType): Promise<Result<true, UpstreamProviderError>> => {
  const { error } = await tryCatch(NEW_ENTRY_KV.set(entryId, createdAt, status, type))
  if (error) {
    const upstreamError = new UpstreamProviderError(`Redis set failed: ${error.message}`, { cause: error })
    console.error(upstreamError)
    return err(upstreamError)
  }

  return ok(true)
}

export const getEntryStatus = async (entryId: string): Promise<Result<EntryStatus, UpstreamProviderError | EntryNotFoundError>> => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.get(entryId))
  if (error) {
    const upstreamError = new UpstreamProviderError(`Redis get failed: ${error.message}`, { cause: error })
    console.error(upstreamError)
    return err(upstreamError)
  }
  
  if (!data) {
    const entryNotFound = new EntryNotFoundError(`No data found for entry ID: ${entryId}`)
    console.info(`[${entryNotFound._tag}] ${entryNotFound.message}`)
    return err(entryNotFound)
  }

  return ok(data.status)
}

export const updateEntryStatus = async (entryId: string, updatedAt: string, type: EntryType): Promise<Result<true, UpstreamProviderError | EntryNotFoundError>> => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.get(entryId))
  if (error) {
    const upstreamError = new UpstreamProviderError(`Redis get failed: ${error.message}`, { cause: error })
    console.error(upstreamError)
    return err(upstreamError)
  }
  
  if (!data) {
    const entryNotFound = new EntryNotFoundError(`No data found for entry ID: ${entryId}`)
    console.info(`[${entryNotFound._tag}] ${entryNotFound.message}`)
    return err(entryNotFound)
  }
  
  const { error: updateError } = await tryCatch(NEW_ENTRY_KV.set(entryId, updatedAt, "Published", type))
  if (updateError) {
    const upstreamError = new UpstreamProviderError(`Redis set failed: ${updateError.message}`, { cause: updateError })
    console.error(upstreamError)
    return err(upstreamError)
  }

  return ok(true)
}