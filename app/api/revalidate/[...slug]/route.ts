import { getGameById, storeNewGameId } from "@/data/games";
import { getMapById, getMapStatus, storeNewMapId, updateMapStatus } from "@/data/maps";
import { getQuestById, storeNewQuestId } from "@/data/sideQuests";
import { env } from "@/env";
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

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params
  const secret = req.headers.get('X-Contentful-Revalidate-Secret') || ''
  const webhookBodyPromise = req.json()

  if (!authorizedRequest(secret, env.REVALIDATE_SECRET)) {
    return Response.json({ revalidated: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  const webhookBody = await webhookBodyPromise
  const body = RevalidateWebhookBodySchema.safeParse(webhookBody)
  if (!body.success) {
    return Response.json({ revalidated: false, message: 'Invalid Request Body', errors: body.error.flatten().fieldErrors })
  }

  const { entryId, createdAt, updatedAt } = body.data
  switch(slug[0]) {
    case 'maps': {
      const map = await getMapById(IN_DEVELOPMENT, entryId)
      if (!map) return Response.json({ revalidated: false, message: `Map not found ID: ${entryId}`}, { status: 404 })
      const path = `/${map.game}/${map.slug}`

      if (isFirstTimePublish(createdAt, updatedAt)) {
        // we must keep track of the status seperately
        // the only reason is to ensure we do not send multiple broadcasts for the same updated content
        const { error } = await storeNewMapId(entryId, createdAt, map.isComingSoon ? "Coming Soon" : "Published")
        revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)

        if (!map.isComingSoon) {
          const { success, message } = await sendBroadcastEmailUseCase({
            title: map.title,
            description: map.description,
            image: map.image,
            redirectTo: `${env.NEXT_PUBLIC_WEBSITE_URL}${path}`,
            redirectText: "View Guide"
          })

          return Response.json({ 
            revalidated: true, 
            message: error ?? `${entryId} stored as new`,
            broadcastSuccess: success,
            broadcastMessage: message
          }, { status: 201 })
        }
        
        return Response.json({ 
          revalidated: true, 
          message: error ?? `${entryId} stored as new`,
        }, { status: 201 })
      }
      
      // If the map is being updated/re-published
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
        const statusPromise = updateMapStatus(entryId)
        const [{ success, message }, { error }] = await Promise.all([broadcastPromise, statusPromise])

        return Response.json({
          revalidated: true,
          message: `${path} and map data revalidated`,
          statusUpdated: error ? false : true,
          statusError: error,
          broadcastSuccess: success,
          broadcastMessage: message
        }, { status: 201 })
      }

      return Response.json({ revalidated: true, message: `${path} and map data revalidated` }, { status: 201 })
    }
    case 'games': {
      if (isFirstTimePublish(createdAt, updatedAt)) {
        const { error } = await storeNewGameId(entryId, createdAt)
        revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
        return Response.json({ revalidated: true, message: error ?? `${entryId} stored as new` }, { status: 201 })
      }

      const game = await getGameById(IN_DEVELOPMENT, entryId)
      if (!game) return Response.json({ revalidated: false, message: `Game not found ID: ${entryId}`}, { status: 404 })
      const path = `/${game.slug}`
      
      revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
      revalidatePath(path)
      return Response.json({ revalidated: true, message: `${path} and game data revalidated` }, { status: 201 })
    }
    case 'side-quests': {
      if (isFirstTimePublish(createdAt, updatedAt)) {
        const { error } = await storeNewQuestId(entryId, createdAt)
        revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)
        return Response.json({ revalidated: true, message: error ?? `${entryId} stored as new` }, { status: 201 })
      }

      const quest = await getQuestById(IN_DEVELOPMENT, entryId)
      if (!quest) return Response.json({ revalidated: false, message: `quest not found ID: ${entryId}`}, { status: 404 })
      const path = `/side-quests/${quest.game}/${quest.map}/${quest.slug}`
      
      revalidateTag(CACHE_KEYS.SIDE_QUESTS.ALL)
      revalidatePath(path)
      return Response.json({ revalidated: true, message: `${path} and quest data revalidated` }, { status: 201 })
    }
    default: {
      return Response.json({ revalidated: false, message: `Invalid Params: ${slug}` }, { status: 400 })
    }
  }
}