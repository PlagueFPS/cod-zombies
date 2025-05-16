import "server-only"
import type { EntryStatus } from "@/types/EntryEnforcement"
import type { AllowedSlugs } from "./validationSchemas"
import { revalidateTag } from "next/cache"
import { isFirstTimePublish } from "./contentful-utils"
import { getMapById, getMapStatus, storeNewMapId, updateMapStatus } from "@/data/maps"
import { CACHE_KEYS } from "./constants"
import { sendQuestReleaseBroadcast, sendZombieReleaseBroadcast } from "@/usecases/email"
import { env } from "@/env"
import { storeNewGameId } from "@/data/games"
import { storeNewQuestId } from "@/data/sideQuests"
import { getZombieById, getZombieStatus, storeNewZombieId, updateZombieStatus } from "@/data/zombies"

interface RevalidateData {
  entryId: string
  createdAt: string
  updatedAt: string
}

interface BroadcastEntry {
  title: string
  description: string
  image: {
    url: string | undefined
    width: number | undefined
    height: number | undefined
  }
}

type RevalidateHandler = (data: RevalidateData) => Promise<Response>

const RevalidateResponse = {
  notFound(type: string, entryId: string) {
    return Response.json({ revalidated: false, message: `${type} not found ID: ${entryId}` }, { status: 404 })
  },
  success(message: string, broadcast?: { success: boolean, message: string }) {
    return Response.json({ revalidated: true, message, broadcast }, { status: 201 })
  },
  error(message: string, status: number = 400) {
    return Response.json({ revalidated: false, message }, { status })
  }
} as const

const handleFirstTimePublish = async (
  entryId: string, 
  createdAt: string, 
  cacheKey: string,
  storeEntry: (id: string, createdAt: string, status: EntryStatus) => Promise<{ error: Error | null }>,
  status: EntryStatus
) => {
    const { error } = await storeEntry(entryId, createdAt, status)
    if (error) return RevalidateResponse.error(error.message, 500)

    revalidateTag(cacheKey)
    return RevalidateResponse.success(`${entryId} stored as new`)
}

const sendQuestBroadcast = async <T extends BroadcastEntry>(type: "Main" | "Side", entry: T, url: string) => {
  return await sendQuestReleaseBroadcast({
    type,
    redirectUrl: url,
    ...entry,
  })
}

export const RevalidateHandlers: Record<AllowedSlugs, RevalidateHandler> = {
  maps: async ({ entryId, createdAt, updatedAt }) => {
    const map = await getMapById(true, entryId)
    if (!map) return RevalidateResponse.notFound("map", entryId)
    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game}/${map.slug}`

    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = map.isComingSoon ? "Coming Soon" : "Published"
      const result = await handleFirstTimePublish(entryId, createdAt, CACHE_KEYS.FEATURED_MAPS.ALL, storeNewMapId, status)

      if (result.status !== 201) return result

      if (!map.isComingSoon) {
        const broadcast = await sendQuestBroadcast("Main", map, url)
        return RevalidateResponse.success(`${entryId} stored as new.`, broadcast)
      }

      return result
    }

    const { status } = await getMapStatus(entryId)
    revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)

    if (status === "Coming Soon" && !map.isComingSoon) {
      const updatePromise = updateMapStatus(entryId, updatedAt)
      const broadcastPromise = sendQuestBroadcast('Main', map, url)
      const [broadcast, { error }] = await Promise.all([broadcastPromise, updatePromise])

      if (error) return RevalidateResponse.success(`Map data revalidated; Status Error: ${error}`, broadcast)
      return RevalidateResponse.success(`Map data revalidated.`, broadcast)
    }

    return RevalidateResponse.success(`Map data revalidated.`)
  },
  games: async ({ entryId, createdAt, updatedAt }) => {
    if (isFirstTimePublish(createdAt, updatedAt)) {
      return handleFirstTimePublish(entryId, createdAt, CACHE_KEYS.GAME_CATEGORIES.ALL, storeNewGameId, "Published")
    }

    revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
    return RevalidateResponse.success(`Game data revalidated.`)
  },
  "side-quests": async ({ entryId, createdAt, updatedAt }) => {
    if (isFirstTimePublish(createdAt, updatedAt)) {
      return handleFirstTimePublish(entryId, createdAt, CACHE_KEYS.SIDE_QUESTS.ALL, storeNewQuestId, "Published")
    }

    revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)
    return RevalidateResponse.success(`Side Quest data revalidated.`)
  },
  zombies: async ({ entryId, createdAt, updatedAt }) => {
    const zombie = await getZombieById(true, entryId)
    if (!zombie) return RevalidateResponse.notFound("zombie", entryId)
    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`
    const broadcastData = {
      type: zombie.type,
      title: zombie.title,
      description: zombie.description,
      image: zombie.image,
      redirectUrl: url,
    }

    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = zombie.isComingSoon ? "Coming Soon" : "Published"
      const result = await handleFirstTimePublish(entryId, createdAt, CACHE_KEYS.ZOMBIES.ALL, storeNewZombieId, status)

      if (result.status !== 201) return result

      if (!zombie.isComingSoon) {
        const broadcast = await sendZombieReleaseBroadcast(broadcastData)
        return RevalidateResponse.success(`${entryId} stored as new.`, broadcast)
      }

      return result
    }

    const { status } = await getZombieStatus(entryId)
    revalidateTag(CACHE_KEYS.ZOMBIES.ALL)

    if (status === "Coming Soon" && !zombie.isComingSoon) {
      const updatePromise = updateZombieStatus(entryId, updatedAt)
      const broadcastPromise = sendZombieReleaseBroadcast(broadcastData)
      const [broadcast, { error }] = await Promise.all([broadcastPromise, updatePromise])

      if (error) return RevalidateResponse.success(`Zombie data revalidated; Status Error: ${error}`, broadcast)
      return RevalidateResponse.success(`Zombie data revalidated.`, broadcast)
    }

    return RevalidateResponse.success(`Zombie data revalidated.`)
  },
  legal: async () => {
    revalidateTag(CACHE_KEYS.LEGAL.ALL)
    return RevalidateResponse.success(`legal data revalidated.`)
  }
}