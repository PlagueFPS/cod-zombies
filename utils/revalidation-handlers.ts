import "server-only"
import type { AllowedSlugs } from "./validationSchemas"
import { revalidateTag } from "next/cache"
import { isFirstTimePublish } from "./contentful-utils"
import { CACHE_KEYS } from "./constants"
import { sendLegalUpdateBroadcast, sendQuestReleaseBroadcast, sendZombieReleaseBroadcast } from "@/usecases/email"
import { env } from "@/env"
import { getMapById } from "@/data/maps"
import { getGameById } from "@/data/games"
import { getQuestById } from "@/data/sideQuests"
import { getZombieById } from "@/data/zombies"
import { getLegalDocById } from "@/data/legal"
import { EntryNotFoundError, UpstreamProviderError } from "@/types/Error"
import { getEntryStatus, storeNewEntryId, updateEntryStatus } from "@/lib/redis"

interface RevalidateData {
  entryId: string
  createdAt: string
  updatedAt: string
}

interface BroadcastEntry {
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

type RevalidateHandler = (data: RevalidateData) => Promise<Response>

const RevalidateResponse = {
  notFound(type: string, entryId: string) {
    return Response.json({ revalidated: false, message: `${type} not found ID: ${entryId}` }, { status: 404 })
  },
  success(message: string, broadcast?: BroadcastResponse): Response {
    return Response.json({ revalidated: true, message, broadcast }, { status: 201 })
  },
  successWithStatusError(message: string, statusError: UpstreamProviderError | EntryNotFoundError, broadcast?: BroadcastResponse) {
    return Response.json({ revalidated: true, message, statusError, broadcast }, { status: 201 })
  },
  error<T extends Error>(error: T, status: number = 400) {
    return Response.json({ revalidated: false, error }, { status })
  }
} as const

const sendQuestBroadcast = async <T extends BroadcastEntry>(type: "Main" | "Side", entry: T, url: string) => {
  const imageUrl = type === "Main" 
    ? `${env.NEXT_PUBLIC_WEBSITE_URL}/api/og/maps/${entry.slug}` 
    : `${env.NEXT_PUBLIC_WEBSITE_URL}/api/og/side-quests/${entry.slug}`

  return await sendQuestReleaseBroadcast({
    type,
    redirectUrl: url,
    imageUrl,
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
      const result = await storeNewEntryId(entryId, createdAt, status, "mainQuest")
      if (result.isErr()) return RevalidateResponse.error(result.error, 500)
      
      revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
      if (!map.isComingSoon) {
        const broadcast = await sendQuestBroadcast("Main", map, url)
        return RevalidateResponse.success(`${entryId} stored as new.`, broadcast)
      }

      return RevalidateResponse.success(`${entryId} stored as new`)
    }

    revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
    const status = await getEntryStatus(entryId)
    if (status.isErr()) return RevalidateResponse.successWithStatusError(`Map data revalidated.`, status.error)

    if (status.value === "Coming Soon" && !map.isComingSoon) {
      const updatePromise = updateEntryStatus(entryId, updatedAt, "mainQuest")
      const broadcastPromise = sendQuestBroadcast('Main', map, url)
      const [broadcast, updateResult] = await Promise.all([broadcastPromise, updatePromise])

      if (updateResult.isErr()) return RevalidateResponse.successWithStatusError(`Map data revalidated`, updateResult.error, broadcast)
      return RevalidateResponse.success(`Map data revalidated.`, broadcast)
    }

    return RevalidateResponse.success(`Map data revalidated.`)
  },
  games: async ({ entryId, createdAt, updatedAt }) => {
    const game = await getGameById(true, entryId)
    if (!game) return RevalidateResponse.notFound("game", entryId)

    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = game.isComingSoon ? "Coming Soon" : "Published"
      const result = await storeNewEntryId(entryId, createdAt, status, "game")
      if (result.isErr()) return RevalidateResponse.error(result.error, 500)
      
      revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
      return RevalidateResponse.success(`${entryId} stored as new`)
    }

    revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
    const status = await getEntryStatus(entryId)
    if (status.isErr()) return RevalidateResponse.successWithStatusError(`Game data revalidated.`, status.error)

    if (status.value === "Coming Soon" && !game.isComingSoon) {
      const result = await updateEntryStatus(entryId, updatedAt, "game")
      if (result.isErr()) return RevalidateResponse.successWithStatusError(`Game data revalidated`, result.error)
    }

    return RevalidateResponse.success(`Game data revalidated.`)
  },
  "side-quests": async ({ entryId, createdAt, updatedAt }) => {
    const quest = await getQuestById(true, entryId)
    if (!quest) return RevalidateResponse.notFound("quest", entryId)
    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${quest.game}/${quest.map}/${quest.slug}`

    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = quest.isComingSoon ? "Coming Soon" : "Published"
      const result = await storeNewEntryId(entryId, createdAt, status, "sideQuest")
      if (result.isErr()) return RevalidateResponse.error(result.error, 500)
      
      revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)

      if (!quest.isComingSoon) {
        const broadcast = await sendQuestBroadcast("Side", quest, url)
        return RevalidateResponse.success(`${entryId} stored as new.`, broadcast)
      }

      return RevalidateResponse.success(`${entryId} stored as new`)
    }

    revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)
    const status = await getEntryStatus(entryId)
    if (status.isErr()) return RevalidateResponse.successWithStatusError(`Side quest data revalidated.`, status.error)

    if (status.value === "Coming Soon" && !quest.isComingSoon) {
      const updatePromise = updateEntryStatus(entryId, updatedAt, "sideQuest")
      const broadcastPromise = sendQuestBroadcast("Side", quest, url)
      const [broadcast, result] = await Promise.all([broadcastPromise, updatePromise])

      if (result.isErr()) return RevalidateResponse.successWithStatusError(`Side quest data revalidated`, result.error, broadcast)
      return RevalidateResponse.success(`Side Quest data revalidated.`, broadcast)
    }

    return RevalidateResponse.success(`Side quest data revalidated.`)
  },
  zombies: async ({ entryId, createdAt, updatedAt }) => {
    const zombie = await getZombieById(true, entryId)
    if (!zombie) return RevalidateResponse.notFound("zombie", entryId)
    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`
    const broadcastData = {
      type: zombie.type,
      title: zombie.title,
      imageUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/og/zombies/${zombie.slug}`,
      description: zombie.description,
      redirectUrl: url,
    }

    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = zombie.isComingSoon ? "Coming Soon" : "Published"
      const result = await storeNewEntryId(entryId, createdAt, status, "zombie")
      if (result.isErr()) return RevalidateResponse.error(result.error, 500)
      
      revalidateTag(CACHE_KEYS.ZOMBIES.ALL)

      if (!zombie.isComingSoon) {
        const broadcast = await sendZombieReleaseBroadcast(broadcastData)
        return RevalidateResponse.success(`${entryId} stored as new.`, broadcast)
      }

      return RevalidateResponse.success(`${entryId} stored as new`)
    }

    revalidateTag(CACHE_KEYS.ZOMBIES.ALL)
    const status = await getEntryStatus(entryId)
    if (status.isErr()) return RevalidateResponse.successWithStatusError(`Zombie data revalidated.`, status.error)

    if (status.value === "Coming Soon" && !zombie.isComingSoon) {
      const updatePromise = updateEntryStatus(entryId, updatedAt, "zombie")
      const broadcastPromise = sendZombieReleaseBroadcast(broadcastData)
      const [broadcast, result] = await Promise.all([broadcastPromise, updatePromise])

      if (result.isErr()) return RevalidateResponse.successWithStatusError(`Zombie data revalidated`, result.error, broadcast)
      return RevalidateResponse.success(`Zombie data revalidated.`, broadcast)
    }

    return RevalidateResponse.success(`Zombie data revalidated.`)
  },
  legal: async ({ entryId, createdAt, updatedAt }) => {
    const legalDoc = await getLegalDocById(true, entryId)
    if (!legalDoc) return RevalidateResponse.notFound('legal', entryId)
    revalidateTag(CACHE_KEYS.LEGAL.ALL)

    if (isFirstTimePublish(createdAt, updatedAt)) {
      return RevalidateResponse.success(`legal data revalidated.`)
    }

    const broadcast = await sendLegalUpdateBroadcast()
    return RevalidateResponse.success(`legal data revalidated.`, broadcast)
  }
}