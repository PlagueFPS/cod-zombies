import "server-only"
import { env } from "@/env"
import type { EntryStatus, EntryType } from "@/types/EntryEnforcement"
import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN
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