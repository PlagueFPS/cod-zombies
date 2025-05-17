import "server-only"
import type { EntryStatus } from "@/types/EntryEnforcement"
import type { AllowedSlugs } from "./validationSchemas"
import { revalidateTag } from "next/cache"
import { isFirstTimePublish } from "./contentful-utils"
import { getMapById, getMapStatus, storeNewMapId, updateMapStatus } from "@/data/maps"
import { CACHE_KEYS } from "./constants"
import { sendLegalUpdateBroadcast, sendQuestReleaseBroadcast, sendZombieReleaseBroadcast } from "@/usecases/email"
import { env } from "@/env"
import { getGameById, getGameStatus, storeNewGameId, updateGameStatus } from "@/data/games"
import { getQuestById, getQuestStatus, storeNewQuestId, updateQuestStatus } from "@/data/sideQuests"
import { getZombieById, getZombieStatus, storeNewZombieId, updateZombieStatus } from "@/data/zombies"
import { getLegalDocById } from "@/data/legal"

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
    const game = await getGameById(true, entryId)
    if (!game) return RevalidateResponse.notFound("game", entryId)

    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = game.isComingSoon ? "Coming Soon" : "Published"
      return await handleFirstTimePublish(entryId, createdAt, CACHE_KEYS.GAME_CATEGORIES.ALL, storeNewGameId, status)
    }

    const { status } = await getGameStatus(entryId)
    revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)

    if (status === "Coming Soon" && !game.isComingSoon) {
      const { error } = await updateGameStatus(entryId, updatedAt)
      if (error) return RevalidateResponse.success(`Game data revalidated; Status Error: ${error}`)
    }

    return RevalidateResponse.success(`Game data revalidated.`)
  },
  "side-quests": async ({ entryId, createdAt, updatedAt }) => {
    const quest = await getQuestById(true, entryId)
    if (!quest) return RevalidateResponse.notFound("quest", entryId)
    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${quest.game}/${quest.map}/${quest.slug}`

    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = quest.isComingSoon ? "Coming Soon" : "Published"
      const result = await handleFirstTimePublish(entryId, createdAt, CACHE_KEYS.SIDE_QUESTS.ALL, storeNewQuestId, status)

      if (result.status !== 201) return result

      if (!quest.isComingSoon) {
        const broadcast = await sendQuestBroadcast("Side", quest, url)
        return RevalidateResponse.success(`${entryId} stored as new.`, broadcast)
      }

      return result
    }

    const { status } = await getQuestStatus(entryId)
    revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)

    if (status === "Coming Soon" && !quest.isComingSoon) {
      const updatePromise = updateQuestStatus(entryId, updatedAt)
      const broadcastPromise = sendQuestBroadcast("Side", quest, url)
      const [broadcast, { error }] = await Promise.all([broadcastPromise, updatePromise])

      if (error) return RevalidateResponse.success(`Side Quest data revalidated; Status Error: ${error}`, broadcast)
      return RevalidateResponse.success(`Side Quest data revalidated.`, broadcast)
    }

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