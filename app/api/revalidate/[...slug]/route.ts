import { getGameById, storeNewGameId } from "@/data/games";
import { getMapById, storeNewMapId } from "@/data/maps";
import { getQuestById, storeNewQuestId } from "@/data/sideQuests";
import { env } from "@/env";
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
  const secret = req.headers.get('X-Contentful-Revalidate-Secret')
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
      if (isFirstTimePublish(createdAt, updatedAt)) {
        const { error } = await storeNewMapId(entryId, createdAt)
        revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
        return Response.json({ revalidated: true, message: error ?? `${entryId} stored as new` }, { status: 201 })
      }

      const map = await getMapById(IN_DEVELOPMENT, entryId)
      if (!map) return Response.json({ revalidated: false, message: `Map not found ID: ${entryId}`}, { status: 404 })
      const path = `/${map.category}/${map.slug}`
      
      revalidateTag(CACHE_KEYS.FEATURED_MAPS.ALL)
      revalidatePath(path)
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