import 'server-only'
import { CACHE_KEYS, MAX_NEW_TIME } from '@/utils/constants'
import { revalidateTag, unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getEntries } from '@/contentful/contentful'
import { TypeGameCategorySkeleton } from '@/contentful/Types/contentful-types'
import { managementClient } from '@/contentful/contentfulManagement'
import { db } from '@/db/db'
import { categories } from '@/db/schema'
import { createImageDTO, resolveAsset } from '@/utils/contentful-utils'
import { eq } from 'drizzle-orm'
import { submitFeedbackUseCase } from '@/usecases/feedback'

export const getGames = cache(unstable_cache(async (draftMode: boolean) => {
  const gameIdsPromise = getGameIds()
  const gamesPromise = INTERNAL_getGameData(draftMode)
  const [{ changedIds, draftIds, newIds }, games] = await Promise.all([gameIdsPromise, gamesPromise])
  return games.map(game => {
    const isDraft = draftIds.has(game.sys.id)
    const isChanged = changedIds.has(game.sys.id)
    const isNew = !!newIds.find(g => g.categoryId === game.sys.id)
    return {
      id: game.sys.id,
      title: game.fields.title,
      slug: game.fields.slug,
      isDraft,
      isChanged,
      isNew
    }
  })
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

export const getGameSearchData = cache(unstable_cache(async (draftMode: boolean) => {
  const games = await INTERNAL_getGameData(draftMode)
  return games.map(g => ({
    id: g.sys.id,
    title: g.fields.title,
    slug: g.fields.slug
  }))
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

export const getGameBySlug = cache(unstable_cache(async (draftMode: boolean, slug: string) => {
  const games = await INTERNAL_getGameData(draftMode)

 const game = games.find(g => g.fields.slug === slug)
 if (!game) return null
 
 return {
    id: game.sys.id,
    title: game.fields.title,
    slug: game.fields.slug,
    image: createImageDTO(resolveAsset(game.fields.image))
  }
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

export const getGameById = cache(unstable_cache(async (draftMode: boolean, id: string) => {
  const games = await INTERNAL_getGameData(draftMode)
  const game = games.find(g => g.sys.id === id)
  if (!game) return null

  return {
    slug: game.fields.slug
  }
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

export const storeNewGameId = async (gameId: string, createdAt: string) => {
  try {
    await db.insert(categories).values({ categoryId: gameId, publishedAt: createdAt })
    return { error: null }
  } catch (error) {
    console.error(error)
    return { error: "Failed to store game ID. Check server logs for more information."}
  }
}

export const enforceNewGameStatus = async () => {
  try {
    const newGames = await db.select({
      categoryId: categories.categoryId,
      publishedAt: categories.publishedAt
    }).from(categories)
    
    for (const game of newGames) {
      if (!game.publishedAt) continue
      const currentTime = Date.now()
      const publishedTime = new Date(game.publishedAt).getTime()

      if (currentTime - publishedTime > MAX_NEW_TIME) {
        console.log(`[CATEGORY ENFORCEMENT] deleting ${game.categoryId} from DB...`)
        await db.delete(categories).where(eq(categories.categoryId, game.categoryId))
        console.log(`[CATEGORY ENFORCEMENT] revalidating ${CACHE_KEYS.GAME_CATEGORIES.ALL}`)
        revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
      } else continue
    }
  } catch (error) {
    console.error(`[CATEGORY ENFORCEMENT] Error enforcing categories: ${error}`)
    const { success } = await submitFeedbackUseCase({
      title: "Category Status Error",
      label: "issue",
      feedback: `Error enforcing categories ${error}`
    })
    if (!success) console.error(`[CATEGORY ENFORCEMENT] Failed to submit feedback`)
  }
}

const getDraftsAndChanged = cache(unstable_cache(async () => {
  const games = await managementClient.entry.getMany({
    query: {
      content_type: 'gameCategory'
    }
  })
  const draftIds = new Set<string>()
  const changedIds = new Set<string>()

    games.items.forEach(game => {
      if (!game.sys.publishedVersion) {
        draftIds.add(game.sys.id)
      } else if (!!game.sys.publishedVersion && game.sys.version >= game.sys.publishedVersion + 2) {
        changedIds.add(game.sys.id)
      }
    })

    return { draftIds, changedIds }
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

const getNewGameIds = cache(unstable_cache(async () => {
  const ids = await db.select({ categoryId: categories.categoryId }).from(categories)
  return ids
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

const getGameIds = cache(async () => {
  const newIdsPromise = getNewGameIds()
  const draftAndChangedPromise = getDraftsAndChanged()
  const [newIds, { changedIds, draftIds }] = await Promise.all([newIdsPromise, draftAndChangedPromise])
  return { newIds, changedIds, draftIds }
})

const INTERNAL_getGameData = cache(async (draftMode: boolean) => {
  const games = await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['-fields.releaseDate'],
    select: [
      "sys.id",
      "sys.updatedAt",
      "fields"
    ]
  }, draftMode)

  return games.items
})