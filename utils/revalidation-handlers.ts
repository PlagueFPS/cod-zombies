import "server-only"
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
import { EntryNotFoundError } from "@/types/Error"
import { getEntryStatus, storeNewEntryId, updateEntryStatus } from "@/lib/redis"
import { Effect } from "effect"

interface RevalidateData {
  entryId: string
  createdAt: Date
  updatedAt: Date
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

const createSuccessResponse = (message: string, broadcast: BroadcastResponse | null) => 
  Response.json({ revalidated: true, message, broadcast }, { status: 201 })

const sendQuestBroadcast = <T extends BroadcastEntry>(type: "Main" | "Side", entry: T, url: string) => Effect.gen(function*(){
  const imageUrl = type === "Main" 
    ? `${env.NEXT_PUBLIC_WEBSITE_URL}/api/og/maps/${entry.slug}` 
    : `${env.NEXT_PUBLIC_WEBSITE_URL}/api/og/side-quests/${entry.slug}`

  return yield* sendQuestReleaseBroadcast({
    type,
    redirectUrl: url,
    imageUrl,
    ...entry,
  })
})

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
  maps: ({ entryId, createdAt, updatedAt }: RevalidateData) => Effect.gen(function*(){
    const map = yield* Effect.promise(() => getMapById(true, entryId))
    if (!map) return yield* new EntryNotFoundError({
      message: `No map found for entry ID: ${entryId}`,
      cause: null
    })
    
    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game}/${map.slug}`
    let broadcast: BroadcastResponse | null = null
    
    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = map.isComingSoon ? "Coming Soon" : "Published"
      yield* storeNewEntryId(entryId, createdAt, status, "mainQuest")
      
      if (!map.isComingSoon) broadcast = yield* sendQuestBroadcast("Main", map, url)
    } 
    else {
      const status = yield* getEntryStatus(entryId)
      if (status === "Coming Soon" && !map.isComingSoon) {
        const [_, broadcastResult] = yield* Effect.all([
          updateEntryStatus(entryId, updatedAt, "Published"),
          sendQuestBroadcast("Main", map, url)
        ], { concurrency: "unbounded" })
        
        broadcast = broadcastResult
      }
    }

    revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
    return createSuccessResponse("Map revalidated", broadcast)
  }).pipe(Effect.withLogSpan("maps_revalidate_handler")),

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
  games: ({ entryId, createdAt, updatedAt }: RevalidateData) => Effect.gen(function*(){
    const game = yield* Effect.promise(() => getGameById(true, entryId))
    if (!game) return yield* new EntryNotFoundError({
      message: `No game found for entry ID: ${entryId}`,
      cause: null
    })
    
    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = game.isComingSoon ? "Coming Soon" : "Published"
      yield* storeNewEntryId(entryId, createdAt, status, "game")
    } 
    else {
      const status = yield* getEntryStatus(entryId)
      if (status === "Coming Soon" && !game.isComingSoon) {
        yield* updateEntryStatus(entryId, updatedAt, "Published")
      }
    }

    revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
    return createSuccessResponse("Game revalidated", null)
  }).pipe(Effect.withLogSpan("games_revalidate_handler")),

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
  "side-quests": ({ entryId, createdAt, updatedAt }: RevalidateData) => Effect.gen(function*(){
    const quest = yield* Effect.promise(() => getQuestById(true, entryId))
    if (!quest) return yield* new EntryNotFoundError({
      message: `No quest found for entry ID: ${entryId}`,
      cause: null
    })

    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/side-quests/${quest.game}/${quest.map}/${quest.slug}`
    let broadcast: BroadcastResponse | null = null
    
    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = quest.isComingSoon ? "Coming Soon" : "Published"
      yield* storeNewEntryId(entryId, createdAt, status, "sideQuest")
      
      if (!quest.isComingSoon) broadcast = yield* sendQuestBroadcast("Side", quest, url)
    } 
    else {
      const status = yield* getEntryStatus(entryId)
      if (status === "Coming Soon" && !quest.isComingSoon) {
        const [_, broadcastResult] = yield* Effect.all([
          updateEntryStatus(entryId, updatedAt, "Published"),
          sendQuestBroadcast("Side", quest, url)
        ], { concurrency: "unbounded" })

        broadcast = broadcastResult
      }
    }

    revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)
    return createSuccessResponse("Side Quest revalidated", broadcast)
  }).pipe(Effect.withLogSpan("side_quests_revalidate_handler")),
  
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
  zombies: ({ entryId, createdAt, updatedAt }: RevalidateData) => Effect.gen(function*(){
    const zombie = yield* Effect.promise(() => getZombieById(true, entryId))
    if (!zombie) return yield* new EntryNotFoundError({
      message: `No zombie found for entry ID: ${entryId}`,
      cause: null
    })
    
    const url = `${env.NEXT_PUBLIC_WEBSITE_URL}/bestiary/${zombie.slug}`
    const broadcastData = {
      type: zombie.type,
      title: zombie.title,
      imageUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/og/zombies/${zombie.slug}`,
      description: zombie.description,
      redirectUrl: url,
    }

    let broadcast: BroadcastResponse | null = null

    if (isFirstTimePublish(createdAt, updatedAt)) {
      const status = zombie.isComingSoon ? "Coming Soon" : "Published"
      yield* storeNewEntryId(entryId, createdAt, status, "zombie")

      if (!zombie.isComingSoon) broadcast = yield* sendZombieReleaseBroadcast(broadcastData)
    } 
    else {
      const status = yield* getEntryStatus(entryId)
      if (status === "Coming Soon" && !zombie.isComingSoon) {
        const [_, broadcastResult] = yield* Effect.all([
          updateEntryStatus(entryId, updatedAt, "Published"),
          sendZombieReleaseBroadcast(broadcastData)
        ], { concurrency: "unbounded" })

        broadcast = broadcastResult
      }
    }

    revalidateTag(CACHE_KEYS.ZOMBIES.ALL)
    return createSuccessResponse("Zombie revalidated", broadcast)
  }).pipe(Effect.withLogSpan("zombies_revalidate_handler")),
  
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
  legal: ({ entryId, createdAt, updatedAt }: RevalidateData) => Effect.gen(function*(){
    const legalDoc = yield* Effect.promise(() => getLegalDocById(true, entryId))
    if (!legalDoc) return yield* new EntryNotFoundError({
      message: `No legal document found for entry ID: ${entryId}`,
      cause: null
    })

    let broadcast: BroadcastResponse | null = null
    
    if (!isFirstTimePublish(createdAt, updatedAt)) {
      broadcast = yield* sendLegalUpdateBroadcast()
    }
    
    revalidateTag(CACHE_KEYS.LEGAL.ALL)
    return createSuccessResponse("Legal document revalidated", broadcast)
  }).pipe(Effect.withLogSpan("legal_revalidate_handler"))
}