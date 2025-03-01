import 'server-only'
import { CACHE_KEYS, MAX_NEW_TIME } from '@/utils/constants'
import { revalidateTag, unstable_cache } from 'next/cache'
import { cache } from 'react'
import { getEntries } from '@/contentful/contentful'
import { TypeGameCategorySkeleton } from '@/contentful/Types/contentful-types'
import { getManagementEntries } from '@/contentful/contentfulManagement'
import { submitFeedbackUseCase } from '@/usecases/feedback'
import { tryCatch } from '@/utils/functions'
import { NEW_ENTRY_KV } from '@/lib/redis'

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
  return await tryCatch(NEW_ENTRY_KV.set(gameId, createdAt, "Published"))
}

export const enforceNewGameStatus = async () => {
  const { data, error } = await tryCatch(NEW_ENTRY_KV.getAll())
  if (error || !data) {
    console.error(`[GAME ENFORCEMENT] Error getting new games. Check server logs for more information.`, error)
    await submitFeedbackUseCase({
      title: "Game Selection Error",
      label: "issue",
      feedback: `Error getting new games. Check server logs for more information.`
    })
    return
  }

  data.forEach(async game => {
    if (!game.createdAt) return
    const currentTime = Date.now()
    const publishedTime = new Date(game.createdAt).getTime()

    if (currentTime - publishedTime > MAX_NEW_TIME) {
      console.log(`[GAME ENFORCEMENT] Deleting Game ${game.entryId} from KV...`)
      const { error } = await tryCatch(NEW_ENTRY_KV.del(game.entryId))
      if (error) {
        console.error(error)
        await submitFeedbackUseCase({
          title: "Game Deletion Error",
          label: "issue",
          feedback: `Error deleting game ${game.entryId}. check server logs for more information.`
        })
        return
      }

      console.log(`[GAME ENFORCEMENT] revalidating ${CACHE_KEYS.GAME_CATEGORIES.ALL}`)
      revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
    } else return

  })
}

const getGameIds = cache(unstable_cache(async () => {
  const gamesPromise = getManagementEntries("gameCategory")
  const newGamesPromise = tryCatch(NEW_ENTRY_KV.getAll())
  const [games, newGames] = await Promise.all([gamesPromise, newGamesPromise])
  const draftIds = new Set<string>()
  const changedIds = new Set<string>()
  const newIds = new Set<string>()

  if (games.error || !games.data) {
    console.error(`Error getting management games`, games.error)
  }
  
  if (newGames.error || !newGames.data) {
    console.error(`Error getting new games`, newGames.error)
  }

  games.data?.items.forEach(game => {
    if (!game.sys.publishedVersion) {
      draftIds.add(game.sys.id)
    } else if (!!game.sys.publishedVersion && game.sys.version >= game.sys.publishedVersion + 2) {
      changedIds.add(game.sys.id)
    }
  })

  newGames.data?.forEach(game => {
    if (game.entryId) newIds.add(game.entryId)
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