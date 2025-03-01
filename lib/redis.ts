import { env } from "@/env"
import { TypeGuards } from "@/utils/functions"
import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN
})

interface EntryResponse {
  entryId: string
  createdAt: string | null
  status: "Coming Soon" | "Published" | null
}

export const NEW_ENTRY_KV = {
  key: "contentful:new-entries",
  async get(entryId: string): Promise<EntryResponse> {
    const response = await redis.hget(this.key, entryId)

    if (!response || !TypeGuards.isString(response)) return {
      entryId,
      createdAt: null,
      status: null
    }

    return {
      entryId,
      ...JSON.parse(response)
    }
  },
  async getAll(): Promise<EntryResponse[]> {
    const response = await redis.hgetall(this.key)
    if (!response) return []

    return Object.entries(response).map(([entryId, entryData]) => {
      if (!TypeGuards.isString(entryData)) return null
      return {
        entryId,
        ...JSON.parse(entryData)
      }
    }).filter(entry => entry !== null)
  },
  async set(entryId: string, createdAt: string, status: "Coming Soon" | "Published") {
    return await redis.hset(this.key, {
      [entryId]: JSON.stringify({
        createdAt,
        status
      })
    })
  },
  async del(entryId: string) {
    return await redis.hdel(this.key, entryId)
  }
}