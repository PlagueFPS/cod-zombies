import { storeNewGameId } from "@/data/games";
import { getLegalDocById } from "@/data/legal";
import { getMapById, getMapStatus, storeNewMapId, updateMapStatus } from "@/data/maps";
import { getQuestById, storeNewQuestId } from "@/data/sideQuests";
import { getZombieById, getZombieStatus, storeNewZombieId, updateZombieStatus } from "@/data/zombies";
import { env } from "@/env";
import type { AllowedSlugs } from "@/types/EntryEnforcement";
import { sendQuestReleaseBroadcast} from "@/usecases/email";
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
          const broadcast = await sendQuestReleaseBroadcast({
            type: "Main",
            title: map.title,
            description: map.description,
            image: map.image,
            redirectUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.game}/${map.slug}`,
          })

          return RevalidateResponse.success(`${entryId} stored as new`, broadcast)
        }
        
        return RevalidateResponse.success(`${entryId} stored as new`)
      }
      
      const map = await getMapById(IN_DEVELOPMENT, entryId)
      if (!map) return RevalidateResponse.notFound("map", entryId)

      const path = `/${map.game}/${map.slug}`
      const { status } = await getMapStatus(entryId)
      revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
      revalidatePath(path)
      

      if (status === "Coming Soon" && !map.isComingSoon) {
        const statusPromise = updateMapStatus(entryId, updatedAt)
        const broadcastPromise = sendQuestReleaseBroadcast({
          type: "Main",
          title: map.title,
          description: map.description,
          image: map.image,
          redirectUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}${path}`,
        })

        const [broadcast, { error }] = await Promise.all([broadcastPromise, statusPromise])
        if (error) return RevalidateResponse.success(`${path} and map data revalidated; Status Error: ${error}`, broadcast)
        return RevalidateResponse.success(`${path} and map data revalidated`, broadcast)
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

      revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
      return RevalidateResponse.success(`game data revalidated.`)
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
        // Must bypass cache since data has not been revalidated yet
        const zombie = await getZombieById(true, entryId)
        if (!zombie) return RevalidateResponse.notFound("zombie", entryId)

        const { error } = await storeNewZombieId(entryId, createdAt, zombie.isComingSoon ? "Coming Soon" : "Published")
        if (error) return RevalidateResponse.error(error.message, 500)

        revalidateTag(CACHE_KEYS.ZOMBIES.ALL)
        return RevalidateResponse.success(`${entryId} stored as new`)
      }

      const zombie = await getZombieById(IN_DEVELOPMENT, entryId)
      if (!zombie) return RevalidateResponse.notFound("zombie", entryId)

      const path = `/bestiary/${zombie.slug}`
      const { status } = await getZombieStatus(entryId)
      revalidateTag(CACHE_KEYS.ZOMBIES.ALL)
      revalidatePath(path)

      if (status === "Coming Soon" && !zombie.isComingSoon) {
        const { error } = await updateZombieStatus(entryId, updatedAt)
        if (error) return RevalidateResponse.success(`${path} and zombie data revalidated; Failed to update status: ${error}`)
        return RevalidateResponse.success(`${path} and zombie data revalidated; Zombie Status updated successfully!`)
      }

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