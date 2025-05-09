import { getGameById, storeNewGameId } from "@/data/games";
import { getLegalDocById } from "@/data/legal";
import { getMapById, getMapStatus, storeNewMapId, updateMapStatus } from "@/data/maps";
import { getQuestById, storeNewQuestId } from "@/data/sideQuests";
import { getZombieById, storeNewZombieId } from "@/data/zombies";
import { env } from "@/env";
import type { AllowedSlugs } from "@/types/EntryEnforcement";
import { sendBroadcastEmailUseCase } from "@/usecases/email";
import { CACHE_KEYS, IN_DEVELOPMENT } from "@/utils/constants";
import { isFirstTimePublish } from "@/utils/contentful-utils";
import { authorizedRequest } from "@/utils/functions";
import { RevalidateWebhookBodySchema } from "@/utils/validationSchemas";
import { revalidatePath, revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string[] }>
}

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

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  const secret = req.headers.get('X-Contentful-Revalidate-Secret') || ''
  const webhookBodyPromise = req.json()

  if (!authorizedRequest(secret, env.REVALIDATE_SECRET)) {
    return RevalidateResponse.error("Unauthorized Request", 401)
  }

  const webhookBody = await webhookBodyPromise
  const body = RevalidateWebhookBodySchema.safeParse(webhookBody)
  if (!body.success) {
    return RevalidateResponse.error(`Invalid Payload Body: ${body.error.flatten().fieldErrors}`)
  }

  const { entryId, createdAt, updatedAt } = body.data
  switch(slug[0] as AllowedSlugs) {
    case 'maps': {
      if (isFirstTimePublish(createdAt, updatedAt)) {
        // Must bypass cache since data has not been revalidated yet
        const map = await getMapById(true, entryId)
        if (!map) return RevalidateResponse.notFound("map", entryId)
        const { error } = await storeNewMapId(entryId, createdAt, map.isComingSoon ? "Coming Soon" : "Published")
        if (error) return RevalidateResponse.error(error.message, 500)

        revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
        if (!map.isComingSoon) {
          const broadcast = await sendBroadcastEmailUseCase({
            title: map.title,
            description: map.description,
            image: map.image,
            redirectTo: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game}/${map.slug}`,
            redirectText: "View Guide"
          })

          return RevalidateResponse.success(`${entryId} stored as new`, broadcast)
        }
        
        return RevalidateResponse.success(`${entryId} stored as new`)
      }
      
      // If the map is being updated/re-published
      const map = await getMapById(IN_DEVELOPMENT, entryId)
      if (!map) return RevalidateResponse.notFound("map", entryId)
      const path = `/${map.game}/${map.slug}`
      revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
      revalidatePath(path)
      const { status } = await getMapStatus(entryId)
      
      // If previously stored status was "Coming Soon" and status is no longer "Coming Soon" in Contentful
      // update stored status and send out release broadcasts to users
      if (status === "Coming Soon" && !map.isComingSoon) {
        const broadcastPromise = sendBroadcastEmailUseCase({
          title: map.title,
          description: map.description,
          image: map.image,
          redirectTo: `${env.NEXT_PUBLIC_WEBSITE_URL}${path}`,
          redirectText: "View Guide"
        })
        // We override the old creation timestamp with the updated one
        // to reflect that the "new" timer starts now instead of from the old creation
        // when the map was "Coming Soon" and not new
        const statusPromise = updateMapStatus(entryId, updatedAt)
        const [broadcast, { error }] = await Promise.all([broadcastPromise, statusPromise])

        return RevalidateResponse.success(`${path} and map data revalidated. Status Error: ${error}`, broadcast)
      }

      return RevalidateResponse.success(`${path} and map data revalidated`)
    }
    case 'games': {
      if (isFirstTimePublish(createdAt, updatedAt)) {
        const { error } = await storeNewGameId(entryId, createdAt)
        if (error) return RevalidateResponse.error(error.message, 500)

        revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
        return RevalidateResponse.success(`${entryId} stored as new`)
      }

      const game = await getGameById(IN_DEVELOPMENT, entryId)
      if (!game) return RevalidateResponse.notFound("game", entryId)
      const path = `/${game.slug}`
      
      revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
      revalidatePath(path)
      return RevalidateResponse.success(`${path} and game data revalidated`)
    }
    case 'side-quests': {
      if (isFirstTimePublish(createdAt, updatedAt)) {
        const { error } = await storeNewQuestId(entryId, createdAt)
        if (error) return RevalidateResponse.error(error.message, 500)

        revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)
        return RevalidateResponse.success(`${entryId} stored as new`)
      }

      const quest = await getQuestById(IN_DEVELOPMENT, entryId)
      if (!quest) return RevalidateResponse.notFound("quest", entryId)
      const path = `/side-quests/${quest.game}/${quest.map}/${quest.slug}`
      
      revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)
      revalidatePath(path)
      return RevalidateResponse.success(`${path} and quest data revalidated`)
    }
    case 'zombies': {
      if (isFirstTimePublish(createdAt, updatedAt)) {
        const { error } = await storeNewZombieId(entryId, createdAt)
        if (error) return RevalidateResponse.error(error.message, 500)

        revalidateTag(CACHE_KEYS.ZOMBIES.ALL)
        return RevalidateResponse.success(`${entryId} stored as new`)
      }

      const zombie = await getZombieById(IN_DEVELOPMENT, entryId)
      if (!zombie) return RevalidateResponse.notFound("zombie", entryId)
      const path = `/bestiary/${zombie.slug}`
      revalidateTag(CACHE_KEYS.ZOMBIES.ALL)
      revalidatePath(path)
      return RevalidateResponse.success(`${path} and zombie data revalidated`)
    }
    case 'legal': {
      const legalDoc = await getLegalDocById(IN_DEVELOPMENT, entryId)
      if (!legalDoc) return RevalidateResponse.notFound("legal", entryId)
      const path = `/${legalDoc.slug}`
      revalidateTag(CACHE_KEYS.LEGAL.ALL)
      revalidatePath(path)
      return RevalidateResponse.success(`${path} and legal data revalidated`)
    }
    default: {
      return RevalidateResponse.error(`Invalid Params: ${slug}`)
    }
  }
}