import 'server-only'
import { CACHE_KEYS, MAX_NEW_TIME } from '@/utils/constants'
import { revalidateTag, unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getEntries } from '@/contentful/contentful'
import { TypeGameCategorySkeleton } from '@/contentful/Types/contentful-types'
import { getManagementEntries } from '@/contentful/contentfulManagement'
import { db } from '@/db/db'
import { categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { submitFeedbackUseCase } from '@/usecases/feedback'
import { tryCatch } from '@/utils/functions'

export const getGames = cache(unstable_cache(async (draftMode: boolean) => {
  const gameIdsPromise = getGameIds()
  const gamesPromise = INTERNAL_getGameData(draftMode)
  const [{ changedIds, draftIds, newIds }, games] = await Promise.all([gameIdsPromise, gamesPromise])
  return games.map(game => {
    const isDraft = draftIds.has(game.sys.id)
    const isChanged = changedIds.has(game.sys.id)
    const isNew = newIds.has(game.sys.id)
    return {
      id: game.sys.id,
      title: game.fields.title,
      slug: game.fields.slug,
      isDraft,
      isChanged,
      isNew,
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
  return await tryCatch(db.insert(categories).values({ categoryId: gameId, publishedAt: createdAt }))
}

export const enforceNewGameStatus = async () => {
  const { data: newGames, error: selectError } = await tryCatch(db.select({
    categoryId: categories.categoryId,
    publishedAt: categories.publishedAt
  }).from(categories))

  if (selectError) {
    console.error(`[CATEGORY ENFORCEMENT] Error selecting new categories`, selectError)
    await submitFeedbackUseCase({
      title: "Category Selection Error",
      label: "issue",
      feedback: `Error selecting new categories. check server logs for more information.`
    })
    return
  }

  for (const game of newGames) {
    const currentTime = Date.now()
    const publishedTime = new Date(game.publishedAt).getTime()

    if (currentTime - publishedTime > MAX_NEW_TIME) {
      console.log(`[CATEGORY ENFORCEMENT] deleting ${game.categoryId} from DB...`)
      const { error: deleteError } = await tryCatch(db.delete(categories).where(eq(categories.categoryId, game.categoryId)))

      if (deleteError) {
        console.error(`[CATEGORY ENFORCEMENT] Error deleting category: ${game.categoryId}`,deleteError)
        await submitFeedbackUseCase({
          title: "Category Deletion Error",
          label: "issue",
          feedback: `Error deleting category: ${game.categoryId} - check server logs for more information.`
        })
        continue
      }

      console.log(`[CATEGORY ENFORCEMENT] revalidating ${CACHE_KEYS.GAME_CATEGORIES.ALL}`)
      revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
    } else continue
  }
}

const getGameIds = cache(unstable_cache(async () => {
  const idsPromise = db.select({ categoryId: categories.categoryId }).from(categories)
  const gamesPromise = getManagementEntries("gameCategory")
  const [newGameIds, { data, error }] = await Promise.all([idsPromise, gamesPromise])
  const draftIds = new Set<string>()
  const changedIds = new Set<string>()
  const newIds = new Set<string>(newGameIds.map(id => id.categoryId))

  if (error) {
    console.error(error)
    return { newIds, draftIds, changedIds }
  }

  data.items.forEach(game => {
    if (!game.sys.publishedVersion) {
      draftIds.add(game.sys.id)
    } else if (!!game.sys.publishedVersion && game.sys.version >= game.sys.publishedVersion + 2) {
      changedIds.add(game.sys.id)
    }
  })

  return { newIds, draftIds, changedIds }
}, [], {
  tags: [CACHE_KEYS.GAME_CATEGORIES.ALL]
}))

const INTERNAL_getGameData = cache(async (draftMode: boolean) => {
  const { data, error } = await getEntries<TypeGameCategorySkeleton>({
    content_type: 'gameCategory',
    order: ['-fields.releaseDate'],
    select: [
      "sys.id",
      "sys.updatedAt",
      "fields"
    ]
  }, draftMode)

  if (error) {
    console.error(error)
    return []
  }

  return data.items
})